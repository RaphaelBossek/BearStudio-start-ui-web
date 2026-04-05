---
title: 'Appointments'
---

# Appointments Domain

> **Last Updated**: 2026-04-01  
> **Status**: Draft  
> **Related Domains**: [Customers](../customers/README.md), [Staff](../staff/README.md), [Consultations](../consultations/README.md)

---

## Domain Overview

The Appointments domain manages the scheduling, assignment, and lifecycle of appointments in the BearStudio system. It handles collision detection, expert availability, and appointment state management.

## Domain Boundaries

### Responsibilities

- **Scheduling**: Create, update, cancel appointments
- **Assignment**: Assign users (experts) to appointments
- **Collision Detection**: Prevent double-booking
- **State Management**: Track appointment lifecycle
- **Availability**: Manage expert availability calendars

### Not Responsible For

- **Consultation Content**: Handled by [Consultations domain](../consultations/README.md)
- **Customer Management**: Handled by [Customers domain](../customers/README.md)
- **User Profiles**: Handled by [Staff domain](../staff/README.md)
- **Billing/Invoicing**: Handled by Accounting domain

## Entity Model

See [entity-model.md](./entity-model.md) for detailed entity definitions.

### Core Entities

```
┌─────────────────────┐
│    Appointment      │
├─────────────────────┤
│ id: uuid            │
│ customer_id: uuid   │
│ location_id: uuid   │
│ start_time: datetime│
│ end_time: datetime  │
│ state: enum         │
│ type: enum          │
└─────────────────────┘
          │
          │ 1:N
          ▼
┌─────────────────────┐
│ AppointmentAssignment│
├─────────────────────┤
│ id: uuid            │
│ appointment_id: uuid│
│ user_id: uuid       │
│ state: enum         │
│ assigned_at: datetime│
└─────────────────────┘
```

## State Machines

See [state-machines.md](./state-machines.md) for detailed state diagrams.

### Appointment States (12 states)

```
DRAFT → SCHEDULED → CONFIRMED → IN_PROGRESS → COMPLETED
                     ↓              ↓
                  CANCELLED    NO_SHOW
```

### Assignment States (12 states)

```
PENDING → ASSIGNED → ACCEPTED → COMPLETED
            ↓           ↓
         REJECTED   CANCELLED
```

## Workflows

See [workflows.md](./workflows.md) for detailed workflow descriptions.

### Key Workflows

1. **Create Appointment**
   - Check availability
   - Detect collisions
   - Create appointment
   - Send notifications

2. **Assign Expert**
   - Find available experts
   - Create assignment
   - Notify expert
   - Track acceptance

3. **Cancel Appointment**
   - Validate cancellation rules
   - Update state
   - Notify all parties
   - Free up time slot

## Permissions

See [permissions.md](./permissions.md) for detailed permission definitions.

### Permission Gates

- `APPOINTMENT_CREATE`: Create new appointments
- `APPOINTMENT_UPDATE`: Modify existing appointments
- `APPOINTMENT_CANCEL`: Cancel appointments
- `APPOINTMENT_ASSIGN`: Assign experts to appointments
- `SELF_ASSIGNMENT`: Assign oneself to an appointment
- `APPOINTMENT_ADHOC`: Create ad-hoc appointments (without prior planning)

## Integration Points

### Upstream Dependencies

- **Customers Domain**: Customer and location data
- **Staff Domain**: Expert availability and skills
- **Shifts Domain**: Shift planning affects availability

### Downstream Consumers

- **Consultations Domain**: Appointment triggers consultation creation
- **Accounting Domain**: Completed appointments generate billable items
- **Notifications Domain**: Appointment events trigger notifications

## Events

### Domain Events

```typescript
// Appointment lifecycle events
AppointmentCreated
AppointmentUpdated
AppointmentCancelled
AppointmentCompleted
AppointmentNoShow

// Assignment events
ExpertAssigned
ExpertAcceptedAssignment
ExpertRejectedAssignment
AssignmentCancelled
```

## Business Rules

### Appointment Creation

1. Appointment must have a customer
2. Start time must be in the future
3. End time must be after start time
4. Duration must be within allowed limits (15min - 4 hours)
5. No collisions with existing appointments

### Assignment Rules

1. Expert must be available during appointment time
2. Expert must have required skills
3. Expert cannot be assigned to overlapping appointments
4. Maximum assignments per expert per day

### Cancellation Rules

1. Free cancellation up to 24 hours before
2. Late cancellation fee may apply
3. No-show marked after 15 minutes grace period

## Metrics

### Key Performance Indicators

- **Appointment Utilization**: % of available slots booked
- **Cancellation Rate**: % of appointments cancelled
- **No-Show Rate**: % of appointments with no-show
- **Assignment Acceptance Rate**: % of assignments accepted by experts
- **Average Lead Time**: Days between booking and appointment

## Testing Strategy

### Unit Tests

- State transitions
- Collision detection
- Availability calculations
- Business rule validation

### Integration Tests

- Appointment creation flow
- Assignment workflow
- Cancellation process
- Notification triggers

### E2E Tests

- Full appointment lifecycle
- Multi-user scenarios
- Calendar integration

## References

- [Entity Model](./entity-model.md)
- [State Machines](./state-machines.md)
- [Workflows](./workflows.md)
- [Permissions](./permissions.md)
- [Analysis](../../analysis/appointments/README.md)
- [Wireframes](../../wireframes/appointments/README.md)
- [Features](../../features/appointments/README.md)
