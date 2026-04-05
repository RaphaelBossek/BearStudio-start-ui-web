---
title: 'Dashboard'
---

# Dashboard Domain

> **Legacy URLs**: `/dash.html`, `/monthView.html`, `/weekView.html`, `/expertWorkMonthly.html`  
> **Domain Owner**: Planning & System teams  
> **Complexity**: Medium-High (multiple dashboard variants, custom calendar grids)

## Overview

The Dashboard domain provides role-specific landing pages and calendar views for all users. It includes three dashboard variants (standard, admin, self-service) and expert availability management through week/month grids.

## Key Features

- **Role-based dashboard switching**: Standard users see self-service actions, admins see system metrics
- **MonthTable calendar grid**: Custom day × job calendar (NOT standard DataTables)
- **Expert availability grids**: Week and month views with tri-state toggle (unset/available/unavailable)
- **Quick actions**: Ad-hoc appointments, end shift, shift requests

## Entities

| Entity | Description | State Machine |
|--------|-------------|---------------|
| Appointment | Calendar entries in MonthTable | 12 states (READY → STARTED → ACTIVE → DONE → CLOSED → ARCHIVED) |
| Shift | Work shift assignments | Same as Appointment (type=SHIFT) |
| Holiday | Expert absence requests | 3 states (requested, approved, denied) |
| Birthday | User birthday events | Display only, click-to-message |

## Analysis Documents

| Document | Status | Wireframe | Description |
|----------|--------|-----------|-------------|
| [`standard.md`](./standard.md) | ✅ Complete | [`../wireframes/dashboard/standard.png`](../wireframes/dashboard/standard.png) | Standard user dashboard (main landing page) |
| [`admin.md`](./admin.md) | ✅ Complete | [`../wireframes/dashboard/admin.png`](../wireframes/dashboard/admin.png) | Admin dashboard with system metrics |
| [`self-service.md`](./self-service.md) | ✅ Complete | — | Self-service dashboard for experts with `SELF_ASSIGNMENT` permission |
| [`dialogs.md`](./dialogs.md) | ✅ Complete | Multiple | Shared dashboard dialogs (shift, ad-hoc appointment, end shift) |

## Wireframes

| ID | Wireframe | Status | Location |
|----|-----------|--------|----------|
| W1 | Calendar (Month View) | ✅ Complete | [`../wireframes/dashboard/calendar.png`](../wireframes/dashboard/calendar.png) |
| W2 | Week View | ✅ Complete | [`../wireframes/dashboard/expert-availability-week.png`](../wireframes/dashboard/expert-availability-week.png) |
| W3 | Month View | ✅ Complete | [`../wireframes/dashboard/expert-availability-month.png`](../wireframes/dashboard/expert-availability-month.png) |
| W4 | Shift Dialog — Detail | ✅ Complete | [`../wireframes/dashboard/shift-dialog-detail.png`](../wireframes/dashboard/shift-dialog-detail.png) |
| W5 | Shift Dialog — Request Action | ✅ Complete | [`../wireframes/dashboard/shift-dialog-request.png`](../wireframes/dashboard/shift-dialog-request.png) |
| W6 | Ad-Hoc Appointment | ✅ Complete | [`../wireframes/dashboard/adhoc-appointment.png`](../wireframes/dashboard/adhoc-appointment.png) |
| W7 | End Shift | ✅ Complete | [`../wireframes/dashboard/end-shift.png`](../wireframes/dashboard/end-shift.png) |
| W8 | User Stats Dialog | ✅ Complete | [`../wireframes/dashboard/user-stats.png`](../wireframes/dashboard/user-stats.png) |

## Workflows

See [`../wireframes/dashboard/workflows.md`](../wireframes/dashboard/workflows.md) for detailed user journey flowcharts:

- Area 1: Appointment Lifecycle
- Area 2: Self-Service Dashboard
- Area 3: Calendar View
- Area 4: Expert Availability Management
- Area 5: Shift Detail & Request Action
- Area 6: Ad-Hoc Appointment & End Shift

## Permissions

| Permission | Used By | Description |
|------------|---------|-------------|
| `SELF_ASSIGNMENT` | Self-service dashboard | Allow experts to self-assign appointments |
| `APPOINTMENT_ADHOC` | Ad-hoc appointment dialog | Create unplanned appointments |
| `EXPERT_WEEK` | Week view | Access to expert week availability grid |

## Integration Points

| Domain | Integration | Description |
|--------|-------------|-------------|
| [`appointments/`](../appointments/README.md) | MonthTable grid | Dashboard displays appointment calendar |
| [`shifts/`](../shifts/README.md) | Shift assignments | Dashboard shows upcoming shifts |
| [`staff/`](../staff/README.md) | Expert availability | Profile → Availability → Dashboard grids |
| [`administration/`](../administration/README.md) | Worklog | Dashboard → Worklog links to accounting |

## Migration Progress

### Analysis Phase

- [x] Standard dashboard analysis
- [x] Admin dashboard analysis
- [x] Self-service dashboard analysis
- [x] Dashboard dialogs analysis

### Wireframe Phase

- [x] Calendar view wireframes
- [x] Expert availability grids
- [x] Shift dialog wireframes
- [x] Ad-hoc appointment dialog
- [x] End shift dialog
- [ ] Worklog wireframes (planned)

### Next Steps

1. Create worklog wireframes
2. Update cross-references in other domains
3. Validate all dashboard permission gates

---

**Back to**: [`SITE-NAVIGATION.md`](./SITE-NAVIGATION.md)
