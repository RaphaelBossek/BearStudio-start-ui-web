# Appointments Domain - Permissions

> **Last Updated**: 2026-04-01  
> **Status**: Draft  
> **See Also**: [Domain README](./README.md), [Workflows](./workflows.md)

---

## Overview

This document describes the permission gates and Non-Functional Requirements (NFRs) for the Appointments domain.

---

## Permission Gates

### APPOINTMENT_CREATE

**Description**: Create new appointments

**Required For**:
- Creating appointments in DRAFT state
- Scheduling appointments
- Rescheduling appointments

**Role Matrix**:

| Role | Permission | Conditions |
|------|------------|------------|
| ADMIN | ✅ Always | No restrictions |
| LEITER_INTERN | ✅ Always | No restrictions |
| STANDARD | ❌ Never | Cannot create appointments |
| KUNDE | ❌ Never | Must use self-service portal |
| CUSTOMER_SERVICE | ✅ Always | For customer appointments |

**Implementation**:
```typescript
function canCreateAppointment(user: User, data: CreateAppointmentData): boolean {
  if (user.role === 'ADMIN' || user.role === 'LEITER_INTERN') {
    return true;
  }
  if (user.role === 'CUSTOMER_SERVICE') {
    return true;
  }
  return false;
}
```

---

### APPOINTMENT_UPDATE

**Description**: Modify existing appointments

**Required For**:
- Changing appointment time
- Changing location/room
- Updating appointment details
- Adding notes

**Role Matrix**:

| Role | Permission | Conditions |
|------|------------|------------|
| ADMIN | ✅ Always | No restrictions |
| LEITER_INTERN | ✅ Always | No restrictions |
| STANDARD | ⚠️ Conditional | Only own appointments |
| KUNDE | ❌ Never | Must use self-service portal |
| CUSTOMER_SERVICE | ✅ Always | For customer appointments |

**Implementation**:
```typescript
function canUpdateAppointment(user: User, appointment: Appointment): boolean {
  if (user.role === 'ADMIN' || user.role === 'LEITER_INTERN') {
    return true;
  }
  if (user.role === 'CUSTOMER_SERVICE') {
    return true;
  }
  if (user.role === 'STANDARD') {
    // Can only update if assigned to this appointment
    return isAssignedToAppointment(user.id, appointment.id);
  }
  return false;
}
```

---

### APPOINTMENT_CANCEL

**Description**: Cancel appointments

**Required For**:
- Cancelling scheduled appointments
- Cancelling confirmed appointments
- Marking as no-show

**Role Matrix**:

| Role | Permission | Conditions |
|------|------------|------------|
| ADMIN | ✅ Always | No restrictions |
| LEITER_INTERN | ✅ Always | No restrictions |
| STANDARD | ⚠️ Conditional | Only own appointments, >24h before |
| KUNDE | ⚠️ Conditional | Self-service only, >24h before |
| CUSTOMER_SERVICE | ✅ Always | May incur fees for customer |

**Business Rules**:
- Free cancellation >24 hours before start time
- 50% fee for 12-24 hours before
- 100% fee for <12 hours before
- No-show fee = 100% of appointment value

**Implementation**:
```typescript
function canCancelAppointment(user: User, appointment: Appointment): boolean {
  if (user.role === 'ADMIN' || user.role === 'LEITER_INTERN') {
    return true;
  }
  if (user.role === 'CUSTOMER_SERVICE') {
    return true;
  }
  if (user.role === 'STANDARD') {
    const hoursUntilStart = hoursUntil(appointment.startTime);
    return isAssignedToAppointment(user.id, appointment.id) && hoursUntilStart > 24;
  }
  return false;
}
```

---

### APPOINTMENT_ASSIGN

**Description**: Assign experts to appointments

**Required For**:
- Creating assignments
- Reassigning experts
- Withdrawing assignments

**Role Matrix**:

| Role | Permission | Conditions |
|------|------------|------------|
| ADMIN | ✅ Always | No restrictions |
| LEITER_INTERN | ✅ Always | No restrictions |
| STANDARD | ❌ Never | Cannot assign others |
| KUNDE | ❌ Never | Cannot assign experts |
| CUSTOMER_SERVICE | ⚠️ Conditional | Only for their customers |

**Implementation**:
```typescript
function canAssignExpert(user: User, appointment: Appointment): boolean {
  if (user.role === 'ADMIN' || user.role === 'LEITER_INTERN') {
    return true;
  }
  if (user.role === 'CUSTOMER_SERVICE') {
    return user.customerId === appointment.customerId;
  }
  return false;
}
```

---

### SELF_ASSIGNMENT

**Description**: Assign oneself to an appointment

**Required For**:
- Experts accepting open assignments
- Voluntary assignment to available appointments

**Role Matrix**:

| Role | Permission | Conditions |
|------|------------|------------|
| ADMIN | ✅ Always | Can assign self |
| LEITER_INTERN | ✅ Always | Can assign self |
| STANDARD | ✅ Always | If available and qualified |
| KUNDE | ❌ Never | Customers cannot be experts |
| CUSTOMER_SERVICE | ❌ Never | Admin role, not expert |

**Business Rules**:
- Expert must have required skill
- Expert must be available during appointment time
- No overlapping appointments
- Maximum 8 appointments per day

**Implementation**:
```typescript
function canSelfAssign(user: User, appointment: Appointment): boolean {
  if (user.role === 'KUNDE' || user.role === 'CUSTOMER_SERVICE') {
    return false;
  }
  
  // Check availability
  if (!isAvailable(user.id, appointment.startTime, appointment.endTime)) {
    return false;
  }
  
  // Check skill match
  if (appointment.requiredSkillId && !hasSkill(user.id, appointment.requiredSkillId)) {
    return false;
  }
  
  // Check no overlaps
  if (hasOverlap(user.id, appointment.startTime, appointment.endTime)) {
    return false;
  }
  
  // Check daily limit
  if (getDailyAppointmentCount(user.id, appointment.startTime) >= 8) {
    return false;
  }
  
  return true;
}
```

---

### APPOINTMENT_ADHOC

**Description**: Create ad-hoc appointments (without prior planning)

**Required For**:
- Emergency appointments
- Walk-in appointments
- Same-day appointments

**Role Matrix**:

| Role | Permission | Conditions |
|------|------------|------------|
| ADMIN | ✅ Always | No restrictions |
| LEITER_INTERN | ✅ Always | No restrictions |
| STANDARD | ❌ Never | Cannot create ad-hoc |
| KUNDE | ❌ Never | Cannot create ad-hoc |
| CUSTOMER_SERVICE | ⚠️ Conditional | Only during business hours |

**Business Rules**:
- Ad-hoc appointments must start within 2 hours
- Requires manager approval if outside business hours
- Cannot override existing confirmed appointments

**Implementation**:
```typescript
function canCreateAdHocAppointment(user: User, data: CreateAppointmentData): boolean {
  if (user.role === 'ADMIN' || user.role === 'LEITER_INTERN') {
    return true;
  }
  
  if (user.role === 'CUSTOMER_SERVICE') {
    // Only during business hours
    return isBusinessHours() && data.startTime < addHours(now(), 2);
  }
  
  return false;
}
```

---

### APPOINTMENT_VIEW

**Description**: View appointment details

**Required For**:
- Viewing appointment list
- Viewing appointment details
- Accessing appointment history

**Role Matrix**:

| Role | Permission | Conditions |
|------|------------|------------|
| ADMIN | ✅ All | All appointments |
| LEITER_INTERN | ✅ All | All appointments |
| STANDARD | ⚠️ Own | Only assigned appointments |
| KUNDE | ⚠️ Own | Only own appointments |
| CUSTOMER_SERVICE | ⚠️ Customer | Only their customers |

**Implementation**:
```typescript
function canViewAppointment(user: User, appointment: Appointment): boolean {
  if (user.role === 'ADMIN' || user.role === 'LEITER_INTERN') {
    return true;
  }
  
  if (user.role === 'STANDARD') {
    return isAssignedToAppointment(user.id, appointment.id);
  }
  
  if (user.role === 'KUNDE') {
    return appointment.customerId === user.customerId;
  }
  
  if (user.role === 'CUSTOMER_SERVICE') {
    return appointment.customerId === user.customerId;
  }
  
  return false;
}
```

---

## Non-Functional Requirements

### Performance

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-A-001 | Appointment list load time | < 500ms | High |
| NFR-A-002 | Collision detection | < 100ms | High |
| NFR-A-003 | Assignment notification delivery | < 5s | Medium |
| NFR-A-004 | Calendar sync | < 30s | Medium |

**Metrics**:
- 95th percentile response time < 500ms
- 99th percentile response time < 1s
- Collision detection must complete within 100ms

---

### Reliability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-A-010 | Appointment creation success rate | > 99.9% | Critical |
| NFR-A-011 | Notification delivery rate | > 99% | High |
| NFR-A-012 | Data consistency | 100% | Critical |
| NFR-A-013 | Backup recovery time | < 4 hours | High |

**Availability**:
- System uptime: 99.9% (business hours)
- Scheduled maintenance: Outside business hours only
- Graceful degradation: Read-only mode acceptable

---

### Security

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-A-020 | Authentication required | 100% | Critical |
| NFR-A-021 | Authorization checks | 100% | Critical |
| NFR-A-022 | Audit logging | All mutations | High |
| NFR-A-023 | Data encryption | At rest + transit | High |

**Requirements**:
- All API endpoints require authentication
- Permission checks on every mutation
- Audit log for all state changes
- PII encrypted at rest

---

### Scalability

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-A-030 | Concurrent users | 500+ | High |
| NFR-A-031 | Appointments per day | 10,000+ | High |
| NFR-A-032 | Collision checks per second | 100+ | Medium |

**Scaling Strategy**:
- Horizontal scaling for API servers
- Read replicas for appointment queries
- Caching for availability checks

---

### Compliance

| ID | Requirement | Target | Priority |
|----|-------------|--------|----------|
| NFR-A-040 | GDPR compliance | 100% | Critical |
| NFR-A-041 | Data retention policy | Enforced | High |
| NFR-A-042 | Right to erasure | Supported | High |
| NFR-A-043 | Audit trail | 7 years | High |

**Requirements**:
- Customer data deletion on request
- Appointment records retained for 7 years
- Anonymization after retention period
- Consent tracking for communications

---

## Error Handling

### Expected Errors

| Error | Code | Handling |
|-------|------|----------|
| Collision detected | `APPOINTMENT_COLLISION` | Suggest alternatives |
| Expert unavailable | `EXPERT_UNAVAILABLE` | Find other experts |
| Invalid time range | `INVALID_TIME_RANGE` | Show validation error |
| Permission denied | `PERMISSION_DENIED` | Show access error |
| Appointment not found | `NOT_FOUND` | Show 404 |

### Retry Logic

```typescript
// Retry failed notifications
const notificationRetryConfig = {
  maxRetries: 3,
  initialDelay: 1000, // 1 second
  maxDelay: 30000, // 30 seconds
  backoff: 'exponential',
};

// Retry failed state transitions
const transitionRetryConfig = {
  maxRetries: 5,
  initialDelay: 100, // 100ms
  maxDelay: 5000, // 5 seconds
  backoff: 'exponential',
};
```

---

## Monitoring

### Key Metrics

```typescript
// Appointment metrics
const appointmentMetrics = {
  created: 'appointments.created.total',
  cancelled: 'appointments.cancelled.total',
  noShow: 'appointments.noshow.total',
  completed: 'appointments.completed.total',
  duration: 'appointments.duration.seconds',
};

// Assignment metrics
const assignmentMetrics = {
  created: 'assignments.created.total',
  accepted: 'assignments.accepted.total',
  rejected: 'assignments.rejected.total',
  expired: 'assignments.expired.total',
  responseTime: 'assignments.response_time.seconds',
};

// Performance metrics
const performanceMetrics = {
  collisionCheckDuration: 'performance.collision_check.ms',
  availabilityCheckDuration: 'performance.availability_check.ms',
  notificationLatency: 'performance.notification_latency.ms',
};
```

### Alerts

| Alert | Condition | Severity |
|-------|-----------|----------|
| High cancellation rate | >20% in 1 hour | Warning |
| No-show spike | >10% in 1 hour | Warning |
| Notification failures | >5% in 15 min | Critical |
| Collision check slow | p95 > 500ms | Warning |
| System overload | CPU > 80% | Critical |

---

## References

- [Domain README](./README.md) - Overview
- [Entity Model](./entity-model.md) - Entity definitions
- [State Machines](./state-machines.md) - State diagrams
- [Workflows](./workflows.md) - Business workflows
- [RBAC Matrix](../../analysis/permissions/rbac-matrix.md) - Overall permission matrix
