# Requirements: Consultation Scheduling

## JTBD Hypothesis
**When** I am a staff member or an expert,
**I want to** create and manage consultation schedules (Sprechstundenplan),
**So that** I can organize medical services and assign them to experts, locations, and clients efficiently.

## Problem Space
Currently, there is no standardized way to define recurring consultation slots with specific medical services, experts, and locations. This leads to scheduling conflicts and lack of clarity for both staff and patients.

## Success Metrics
- Reduction in manual scheduling errors.
- 100% coverage of recurring patterns as specified (weekly, monthly, etc.).
- Improved visibility of expert availability.

## Technical & Functional Requirements
A consultation schedule entry must include:
- **Service**: Assigned medical service.
- **Weekday**: The day of the week.
- **Start Date**: Initial occurrence date.
- **Last Recurrence Date**: When the series ends.
- **Number of Recurrences**: Total occurrences.
- **Recurrence Type**:
  - Weekly
  - First day of the month
  - Every X-th day of the month
  - Specific day of the month
  - Last day of the month
- **Time Slot**: Start time and End time.
- **Assigned Expert**: The professional providing the service.
- **Assigned Location**: Where it takes place.
- **Assigned Clients**: Participants.
- **End Date**: Final date for this specific series.
- **Comment**: Additional notes.
