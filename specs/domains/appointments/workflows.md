---
title: 'Workflows'
---

---
---

# Appointments Domain - Workflows

> **Last Updated**: 2026-04-01  
> **Status**: Draft  
> **See Also**: [Entity Model](./entity-model.md), [State Machines](./state-machines.md), [Domain README](./README.md)

---

## Overview

This document describes the key business workflows in the Appointments domain. Each workflow includes preconditions, steps, postconditions, and error handling.

---

## Workflow 1: Create Appointment

**Actor**: Admin, Customer Service Rep  
**Trigger**: Customer requests appointment

### Preconditions
- Customer exists in system
- Location is configured
- Time slot is available

### Flow

```mermaid
sequenceDiagram
    actor User
    participant UI
    participant API
    participant CollisionDetector
    participant DB
    participant Notifications
    
    User->>UI: Request appointment creation
    UI->>API: POST /appointments {customerId, locationId, startTime, endTime}
    
    API->>DB: Validate customer exists
    DB-->>API: Customer valid
    
    API->>CollisionDetector: Check for collisions
    CollisionDetector->>DB: Query overlapping appointments
    DB-->>CollisionDetector: No collisions found
    CollisionDetector-->>API: Collision check passed
    
    API->>DB: Create appointment (state=DRAFT)
    DB-->>API: Appointment created
    
    API->>Notifications: Send confirmation request
    Notifications->>User: Email/SMS confirmation
    
    API-->>UI: Appointment created (id)
    UI-->>User: Show confirmation
```

### Steps

1. **Validate Input**
   - Customer ID is valid
   - Location ID is valid
   - Start time is in future
   - End time > start time
   - Duration within limits (15min - 4 hours)

2. **Check Availability**
   - Location available at requested time
   - Room available (if specified)
   - No conflicting appointments

3. **Create Appointment**
   - Generate appointment ID
   - Set state = DRAFT
   - Persist to database

4. **Send Notifications**
   - Notify customer (email/SMS)
   - Notify location (if different from customer)

### Postconditions
- Appointment created with state = DRAFT
- Customer notified
- Time slot tentatively reserved

### Error Handling

| Error | Handling |
|-------|----------|
| Customer not found | Return 404, show error |
| Collision detected | Suggest alternative times |
| Invalid time range | Return validation error |
| Location unavailable | Return error, suggest alternatives |

---

## Workflow 2: Schedule Appointment

**Actor**: Admin, Customer Service Rep  
**Trigger**: Appointment created in DRAFT state

### Preconditions
- Appointment exists in DRAFT state
- Customer has confirmed interest

### Flow

```mermaid
sequenceDiagram
    actor User
    participant UI
    participant API
    participant AvailabilityService
    participant DB
    participant Notifications
    
    User->>UI: Schedule appointment
    UI->>API: POST /appointments/{id}/schedule {startTime, endTime}
    
    API->>DB: Get appointment
    DB-->>API: Appointment data
    
    API->>AvailabilityService: Check expert availability
    AvailabilityService->>DB: Query expert calendars
    DB-->>AvailabilityService: Available experts
    
    API->>DB: Check room availability
    DB-->>API: Room available
    
    API->>DB: Update appointment (state=SCHEDULED)
    DB-->>API: Updated
    
    API->>Notifications: Send schedule notifications
    Notifications->>User: Customer notification
    Notifications->>Expert: Assignment notification
    
    API-->>UI: Appointment scheduled
    UI-->>User: Show confirmation
```

### Steps

1. **Get Appointment**
   - Load appointment from database
   - Verify state = DRAFT

2. **Check Availability**
   - Query expert availability
   - Check room availability
   - Verify location open hours

3. **Reserve Resources**
   - Lock time slot
   - Reserve room (if applicable)

4. **Update State**
   - Transition to SCHEDULED
   - Record scheduled time

5. **Notify Parties**
   - Send confirmation to customer
   - Notify experts of potential assignment

### Postconditions
- Appointment state = SCHEDULED
- Time slot reserved
- Customer notified

### Business Rules
- Cannot schedule within 2 hours of start time (unless emergency)
- Must respect location business hours
- Maximum 3 months in advance

---

## Workflow 3: Assign Expert

**Actor**: Admin, System (auto-assignment)  
**Trigger**: Appointment scheduled, expert needed

### Preconditions
- Appointment in SCHEDULED or CONFIRMED state
- Required skill identified

### Flow

```mermaid
sequenceDiagram
    actor Admin
    participant UI
    participant API
    participant ExpertFinder
    participant DB
    participant Notifications
    
    Admin->>UI: Request expert assignment
    UI->>API: POST /appointments/{id}/assign {skillId, userId?}
    
    API->>DB: Get appointment details
    DB-->>API: Appointment + requirements
    
    alt Auto-assign (no userId)
        API->>ExpertFinder: Find available experts
        ExpertFinder->>DB: Query by skill + availability
        DB-->>ExpertFinder: List of experts
        ExpertFinder-->>API: Best match
    else Manual assign (userId provided)
        API->>DB: Validate user has skill
        DB-->>API: Skill validated
    end
    
    API->>DB: Create assignment (state=PENDING)
    DB-->>API: Assignment created
    
    API->>Notifications: Notify expert
    Notifications->>Expert: Assignment request
    
    API-->>UI: Assignment created
    UI-->>Admin: Show assignment status
```

### Steps

1. **Identify Requirements**
   - Get required skill from appointment
   - Check location preferences

2. **Find Experts** (auto-assign only)
   - Query by skill match
   - Filter by availability
   - Sort by workload/priority

3. **Create Assignment**
   - Set state = PENDING
   - Set 24h response timeout
   - Record assigned by whom

4. **Notify Expert**
   - Send assignment notification
   - Include appointment details
   - Provide accept/reject links

### Postconditions
- Assignment created with state = PENDING
- Expert notified
- 24h response timer started

### Business Rules
- Expert must have required skill
- Expert must be available during appointment time
- Maximum 8 appointments per expert per day
- Response timeout: 24 hours

---

## Workflow 4: Accept Assignment

**Actor**: Expert (User)  
**Trigger**: Expert receives assignment notification

### Preconditions
- Assignment exists in PENDING state
- Expert is logged in

### Flow

```mermaid
sequenceDiagram
    actor Expert
    participant UI
    participant API
    participant DB
    participant CollisionDetector
    participant Notifications
    
    Expert->>UI: Click accept assignment
    UI->>API: POST /assignments/{id}/accept
    
    API->>DB: Get assignment
    DB-->>API: Assignment data
    
    API->>CollisionDetector: Check for conflicts
    CollisionDetector->>DB: Query expert's other appointments
    DB-->>CollisionDetector: No conflicts
    CollisionDetector-->>API: Conflict check passed
    
    API->>DB: Update assignment (state=ACCEPTED)
    DB-->>API: Updated
    
    API->>DB: Check if all assignments accepted
    DB-->>API: All accepted
    
    API->>DB: Update appointment (state=CONFIRMED)
    DB-->>API: Appointment confirmed
    
    API->>Notifications: Send confirmations
    Notifications->>Expert: Calendar invite
    Notifications->>Customer: Expert assigned notification
    
    API-->>UI: Assignment accepted
    UI-->>Expert: Show confirmation
```

### Steps

1. **Validate Assignment**
   - Assignment exists and is PENDING
   - Expert is the assigned user
   - Not expired

2. **Check for Conflicts**
   - No overlapping appointments
   - No double-booking

3. **Accept Assignment**
   - Update state = ACCEPTED
   - Record acceptance timestamp
   - Cancel response timeout

4. **Check Appointment Status**
   - If all assignments accepted, confirm appointment
   - Update appointment state = CONFIRMED

5. **Notify Parties**
   - Send calendar invite to expert
   - Notify customer of expert assignment

### Postconditions
- Assignment state = ACCEPTED
- Expert's calendar updated
- Customer notified of expert

---

## Workflow 5: Cancel Appointment

**Actor**: Admin, Customer (self-service)  
**Trigger**: Appointment needs to be cancelled

### Preconditions
- Appointment exists (not in terminal state)
- Canceller has permission

### Flow

```mermaid
sequenceDiagram
    actor User
    participant UI
    participant API
    participant DB
    participant BillingService
    participant Notifications
    
    User->>UI: Request cancellation
    UI->>API: POST /appointments/{id}/cancel {reason?}
    
    API->>DB: Get appointment
    DB-->>API: Appointment data
    
    API->>API: Validate cancellation rules
    Note over API: Check timing, fees, permissions
    
    API->>DB: Update appointment (state=CANCELLED)
    DB-->>API: Updated
    
    API->>BillingService: Apply cancellation fee if applicable
    BillingService->>BillingService: Calculate fee
    BillingService-->>API: Fee amount
    
    API->>DB: Cancel all assignments
    DB-->>API: Assignments cancelled
    
    API->>Notifications: Send cancellation notifications
    Notifications->>Customer: Cancellation confirmation
    Notifications->>Expert: Assignment cancelled
    
    API-->>UI: Appointment cancelled
    UI-->>User: Show confirmation + fee info
```

### Steps

1. **Validate Cancellation**
   - Check appointment state (not terminal)
   - Verify user has permission
   - Calculate time until appointment

2. **Apply Business Rules**
   - Free cancellation if >24 hours before
   - Fee applies if <24 hours
   - No-show rules if applicable

3. **Update State**
   - Transition to CANCELLED
   - Record cancellation reason
   - Record cancellation timestamp

4. **Cancel Assignments**
   - Cancel all pending/accepted assignments
   - Notify affected experts

5. **Process Billing**
   - Calculate cancellation fee
   - Create invoice line item (if applicable)

6. **Notify Parties**
   - Send cancellation confirmation
   - Notify all assigned experts
   - Free up time slot

### Postconditions
- Appointment state = CANCELLED
- All assignments cancelled
- Fee applied (if applicable)
- Time slot freed

### Business Rules
- Free cancellation >24 hours before
- 50% fee for 12-24 hours before
- 100% fee for <12 hours before
- No fee for emergency cancellations

---

## Workflow 6: Complete Appointment

**Actor**: Expert  
**Trigger**: Appointment time ends

### Preconditions
- Appointment in IN_PROGRESS state
- Expert is assigned and present

### Flow

```mermaid
sequenceDiagram
    actor Expert
    participant UI
    participant API
    participant DB
    participant ConsultationService
    participant BillingService
    participant Notifications
    
    Expert->>UI: Mark appointment complete
    UI->>API: POST /appointments/{id}/complete {notes, duration}
    
    API->>DB: Get appointment
    DB-->>API: Appointment data
    
    API->>ConsultationService: Create consultation record
    ConsultationService->>DB: Create consultation
    DB-->>ConsultationService: Consultation created
    
    API->>DB: Update appointment (state=COMPLETED)
    DB-->>API: Updated
    
    API->>DB: Update assignments (state=COMPLETED)
    DB-->>API: Assignments updated
    
    API->>BillingService: Generate billable items
    BillingService->>DB: Create invoice positions
    DB-->>BillingService: Invoice created
    
    API->>Notifications: Send completion notifications
    Notifications->>Customer: Receipt + feedback request
    Notifications->>Expert: Worklog updated
    
    API-->>UI: Appointment completed
    UI-->>Expert: Show confirmation
```

### Steps

1. **Validate Completion**
   - Appointment is IN_PROGRESS
   - Expert is assigned
   - Minimum duration met

2. **Create Consultation Record**
   - Link to appointment
   - Copy relevant data
   - Set initial state

3. **Update States**
   - Appointment → COMPLETED
   - All assignments → COMPLETED

4. **Generate Billing**
   - Create billable items
   - Apply pricing rules
   - Link to customer invoice

5. **Update Worklog**
   - Record expert work time
   - Update utilization metrics

6. **Notify Parties**
   - Send receipt to customer
   - Request feedback
   - Update expert worklog

### Postconditions
- Appointment state = COMPLETED
- Consultation record created
- Invoice generated
- Expert worklog updated

---

## Workflow 7: Handle No-Show

**Actor**: System (automated)  
**Trigger**: 15 minutes after appointment start time

### Preconditions
- Appointment in CONFIRMED or CHECKED_IN state
- Customer has not checked in

### Flow

```mermaid
sequenceDiagram
    participant Scheduler
    participant API
    participant DB
    participant BillingService
    participant Notifications
    
    Scheduler->>API: Check for no-shows
    API->>DB: Find appointments past start + 15min
    
    loop For each potential no-show
        API->>DB: Check check-in status
        DB-->>API: Not checked in
        
        API->>DB: Update appointment (state=NO_SHOW)
        DB-->>API: Updated
        
        API->>BillingService: Apply no-show fee
        BillingService->>DB: Create invoice line
        DB-->>BillingService: Fee applied
        
        API->>Notifications: Send notifications
        Notifications->>Customer: No-show confirmation + fee
        Notifications->>Expert: No-show notification
    end
```

### Steps

1. **Identify No-Shows**
   - Query appointments started >15 min ago
   - Filter by not checked in

2. **Update State**
   - Transition to NO_SHOW
   - Record no-show timestamp

3. **Apply Fees**
   - Calculate no-show fee
   - Create invoice line item

4. **Notify Parties**
   - Notify customer of no-show status
   - Inform expert
   - Free up remaining time slot

### Postconditions
- Appointment state = NO_SHOW
- No-show fee applied
- Expert notified
- Time slot freed

---

## References

- [Entity Model](./entity-model.md) - Entity definitions
- [State Machines](./state-machines.md) - State diagrams
- [Domain README](./README.md) - Overview
- [Permissions](./permissions.md) - Permission gates
