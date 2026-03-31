# Analysis Specifications

> **Purpose**: Detailed functional analysis of all application modules  
> **Target**: React 19 + Shadcn/ui + TanStack Router + Tailwind CSS 4  
> **Last Updated**: 2026-03-31  
> **Status**: **ACTIVE** — Documents being reorganized per migration plan

## Navigation

**Start here**: [`SITE-NAVIGATION.md`](./SITE-NAVIGATION.md) — Complete sitemap with links to all domain specifications

## Domain Overview

The analysis directory is organized into **12 domain folders** aligned with the application's sitemap structure:

| # | Domain | Documents | Wireframes | Completion | Owner |
|---|--------|-----------|------------|------------|-------|
| 1 | [`dashboard/`](./dashboard/README.md) | 4 | 8 | 🟡 Partial | Planning & System |
| 2 | [`appointments/`](./appointments/README.md) | 5 | 8 | 🟢 Complete | Planning |
| 3 | [`shifts/`](./shifts/README.md) | 1 | 4 | 🟡 Partial | Planning |
| 4 | [`treatments/`](./treatments/README.md) | 2 | 0 | 🔴 Not Started | Treatment |
| 5 | [`council/`](./council/README.md) | 1 | 3 | 🟡 Partial | Planning |
| 6 | [`consultations/`](./consultations/README.md) | 8 | 12 | 🟢 Complete | Treatment |
| 7 | [`appointment-admin/`](./appointment-admin/README.md) | 2 | 11 | 🟢 Complete | Planning & Accounting |
| 8 | [`notifications/`](./notifications/README.md) | 1 | 4 | 🟡 Partial | System |
| 9 | [`customers/`](./customers/README.md) | 6 | 8 | 🟡 Partial | Customer & Accounting |
| 10 | [`staff/`](./staff/README.md) | 4 | 10 | 🟡 Partial | User Management |
| 11 | [`administration/`](./administration/README.md) | 8 | 2 | 🔴 Not Started | Accounting |
| 12 | [`system-admin/`](./system-admin/README.md) | 5 | 2 | 🔴 Not Started | System |
| — | [`includes/`](./includes/README.md) | 4 | 6 | 🟡 Partial | System (Shared) |

**Legend**: 🟢 Complete (all wireframes done) | 🟡 Partial (some wireframes done) | 🔴 Not Started

## Overall Progress

### Analysis Phase

**Total Documents**: 47 analysis documents across 12 domains

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete | 42 | 89% |
| 📝 In Progress | 3 | 6% |
| 📋 Planned | 2 | 5% |

### Wireframe Phase

**Total Wireframes**: 76 wireframes planned across 12 domains

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete | 58 | 76% |
| 📝 In Progress | 8 | 11% |
| 📋 Planned | 10 | 13% |

## Domain Summaries

### 1. Dashboard Domain

**Domain**: [`dashboard/`](./dashboard/README.md)  
**Legacy URLs**: `/dash.html`, `/monthView.html`, `/weekView.html`, `/expertWorkMonthly.html`  
**Key Features**:
- Role-based dashboard switching (standard vs admin vs self-service)
- MonthTable calendar grid (custom day × job calendar)
- Expert availability grids (week and month views with tri-state toggle)
- Quick actions: ad-hoc appointments, end shift

**Status**: 🟡 Partial — All analysis complete, worklog wireframes pending

---

### 2. Appointments Domain

**Domain**: [`appointments/`](./appointments/README.md)  
**Legacy URLs**: `/appointment.html`, `/appointmentPlan.html`, `/patientData.html`  
**Key Features**:
- 12-state appointment state machine with color-coded badges
- MonthTable calendar: rows = days, columns = jobs, cells = colored appointments
- 5-tab detail dialog (1200px drawer)
- Collision detection when assigning experts
- Type-driven field visibility (APPOINTMENT, SHIFT, COUNCIL, TREATMENT)

**Status**: 🟢 Complete — All analysis and wireframes done

---

### 3. Shifts Domain

**Domain**: [`shifts/`](./shifts/README.md)  
**Legacy URLs**: `/shift.html`, `/shiftPlan.html`  
**Key Features**:
- Shift plan templates (recurring weekly/monthly schedules)
- Price type auto-suggestion (weekday/night/weekend/weekend night)
- Preferred experts collection with priority ordering
- Apply Plan generates appointments asynchronously

**Status**: 🟡 Partial — Analysis complete, some wireframes pending

---

### 4. Treatments Domain

**Domain**: [`treatments/`](./treatments/README.md)  
**Legacy URLs**: `/treatment.html`, `/treatmentPlan.html`  
**Key Features**:
- Treatment categories hierarchy
- Treatment plan scheduling
- History view for completed treatments

**Status**: 🔴 Not Started — Analysis documents need migration, wireframes not started

---

### 5. Council Domain

**Domain**: [`council/`](./council/README.md)  
**Legacy URLs**: `/council.html`, `/councilPlan.html`  
**Key Features**:
- Council plan templates (similar to shift plans, simpler)
- Doctor collection with role assignments
- Job support checkbox (council-specific)
- No price type (councils don't have shift-based pricing)

**Status**: 🟡 Partial — Analysis complete, some wireframes pending

---

### 6. Consultations Domain

**Domain**: [`consultations/`](./consultations/README.md)  
**Legacy URLs**: `/consultation.html`  
**Key Features**:
- 7 consultation types controlling tab/field visibility
- 6-state consultation state machine (OPEN, IN_PROGRESS, TRANSMITTED, etc.)
- ICD-10 search dialog with inclusion/exclusion lists
- Nested prescription collection (prescription → activeIngredients)
- Incarceration siren animation (blue-to-red flash on critical fields)
- Markdown editor for review comments

**Status**: 🟢 Complete — All analysis and wireframes done

---

### 7. Appointment Admin Domain

**Domain**: [`appointment-admin/`](./appointment-admin/README.md)  
**Legacy URLs**: `/appointmentAdmin.html`, `/closedMonth.html`, `/questionaire.html`  
**Key Features**:
- 13-column admin grid with year/month/day filter
- Detail drawer with 3 time columns (Expert / Logging / Verified)
- Inline consultation CRUD (add, edit, duplicate, move, transmit, delete)
- CDR call assignment (assigned vs unassigned panels)
- Export workflows (EK, VK, VK by Location, Template Export)
- Month closed status (read-only mode)

**Status**: 🟢 Complete — All analysis and wireframes done

---

### 8. Notifications Domain

**Domain**: [`notifications/`](./notifications/README.md)  
**Legacy URLs**: `/notification.html`  
**Key Features**:
- Folder-based filtering (Inbox, Sent, Trash)
- Rights-based access: `NOTIFICATION_READ`, `SELF_ASSIGNMENT`
- Compose notification dialog
- Send message to users

**Status**: 🟡 Partial — Analysis complete, some wireframes pending

---

### 9. Customers Domain

**Domain**: [`customers/`](./customers/README.md)  
**Legacy URLs**: `/customer.html`, `/onboardingCustomer.html`, `/invoice.html`, `/invoiceReceiver.html`, `/customerUser.html`, `/customerLocation.html`, `/room.html`, `/onboardingLocation.html`  
**Key Features**:
- Customer hierarchy (customer → locations → users → rooms)
- Invoice generation and payment tracking
- Invoice receiver (payment contact) management
- Contact management (private, work, other addresses)

**Status**: 🟡 Partial — Most analysis complete, some wireframes pending

---

### 10. Staff Domain

**Domain**: [`staff/`](./staff/README.md)  
**Legacy URLs**: `/staff.html`, `/onboarding.html`, `/adminUser.html`, `/expertWorkWeeklyAssignments.html`  
**Key Features**:
- Profile form with 4 tabs (personal, business, other, overview)
- Expert availability (week and month grids)
- User assignment to customers/locations
- TOTP onboarding for 2FA

**Status**: 🟡 Partial — Most analysis complete, some wireframes pending

---

### 11. Administration Domain

**Domain**: [`administration/`](./administration/README.md)  
**Legacy URLs**: `/admin.html` + 11 submenu items  
**Key Features**:
- Job configuration (billing codes)
- Product catalog
- Skill taxonomy
- Warning categories for consultations
- Equipment/device management

**Status**: 🔴 Not Started — Analysis needs migration, most wireframes not started

---

### 12. System Admin Domain

**Domain**: [`system-admin/`](./system-admin/README.md)  
**Legacy URLs**: `/sysadmin.html` + 13 submenu items  
**Key Features**:
- System configuration (sysconfig)
- Message of the Day (MOTD) management
- CDR call tracking (7 color-coded statuses)
- Work hour definitions
- Login notifications

**Status**: 🔴 Not Started — Analysis needs migration, most wireframes not started

---

## Shared Infrastructure

### Includes Domain

**Domain**: [`includes/`](./includes/README.md)  
**Purpose**: Shared components, templates, and infrastructure used across all modules

**Documents**:
- [`site-shell.md`](./includes/site-shell.md) — Application shell architecture
- [`shared-components.md`](./includes/shared-components.md) — Shared dialogs (loading spinner, bug report, role switch)
- [`customization.md`](./includes/customization.md) — Customization points and theming
- [`templates-files.md`](./includes/templates-files.md) — Template system and file includes

**Status**: 🟡 Partial — Analysis complete, some wireframes pending

---

## Cross-Reference Index

### By Entity Type

| Entity | Primary Domain | Related Domains |
|--------|----------------|-----------------|
| Appointment | [`appointments/`](./appointments/README.md) | [`shifts/`](./shifts/README.md), [`council/`](./council/README.md), [`treatments/`](./treatments/README.md) |
| Consultation | [`consultations/`](./consultations/README.md) | [`treatments/`](./treatments/README.md), [`appointment-admin/`](./appointment-admin/README.md) |
| Customer | [`customers/`](./customers/README.md) | [`staff/`](./staff/README.md) (customer users) |
| User/Staff | [`staff/`](./staff/README.md) | [`customers/`](./customers/README.md) (assignment) |
| Invoice | [`customers/invoices.md`](./customers/invoices.md) | [`administration/jobs.md`](./administration/jobs.md) (job pricing) |
| CDR Call | [`system-admin/cdr.md`](./system-admin/cdr.md) | [`appointment-admin/admin.md`](./appointment-admin/admin.md) (assignment) |

### By Permission/Role

| Role | Visible Modules |
|------|-----------------|
| **STANDARD** | Dashboard, Consultations, Notifications (with rights) |
| **LEITER_INTERN** | All modules |
| **ADMIN_INTERN** | All modules except Consultations |
| **ADMIN** | All modules |
| **KUNDE_ADMIN** | Dashboard, Notifications, Customers |
| **REGISTERED** | Dashboard only |

## Related Documents

- **[Wireframes Directory](../wireframes/README.md)** — Parallel wireframe specifications
- **[Migration Plan](../MIGRATION-PLAN.md)** — Directory restructuring plan
- **[Data Dictionaries](./data-dictionary-index.md)** — Entity relationship documentation
- **[Table View Rules](../rules/table-view.md)** — TanStack React Table implementation guidelines
- **[AGENTS.md](../../AGENTS.md)** — Project-specific agent instructions

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-31 | 2.0 | Restructured as domain-based navigation per migration plan |
| 2026-03-30 | 1.0 | Initial organization from legacy module folders |

---

**Next**: [`SITE-NAVIGATION.md`](./SITE-NAVIGATION.md) — Complete sitemap with detailed module navigation
