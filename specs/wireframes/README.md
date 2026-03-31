# Wireframe Specifications

> **Purpose**: Visual UI specifications for all application screens  
> **Format**: `.pen` files (Pencil) + exported PNG screenshots  
> **Target**: React 19 + Shadcn/ui + TanStack Router + Tailwind CSS 4  
> **Last Updated**: 2026-03-31  
> **Status**: **ACTIVE** — Wireframes being created per domain migration plan

## Navigation

**Start here**: [`../analysis/SITE-NAVIGATION.md`](../analysis/SITE-NAVIGATION.md) — Complete sitemap with links to all specifications

## Domain Overview

The wireframes directory mirrors the analysis directory structure with **12 domain folders**:

| # | Domain | Analysis Docs | Wireframes | Completion | Domain README |
|---|--------|---------------|------------|------------|---------------|
| 1 | [`dashboard/`](./dashboard/README.md) | 4 | 8 | 🟡 Partial | [`dashboard/README.md`](./dashboard/README.md) |
| 2 | [`appointments/`](./appointments/README.md) | 5 | 8 | 🟢 Complete | [`appointments/README.md`](./appointments/README.md) |
| 3 | [`shifts/`](./shifts/README.md) | 1 | 4 | 🟡 Partial | [`shifts/README.md`](./shifts/README.md) |
| 4 | [`treatments/`](./treatments/README.md) | 2 | 0 | 🔴 Not Started | [`treatments/README.md`](./treatments/README.md) |
| 5 | [`council/`](./council/README.md) | 1 | 3 | 🟡 Partial | [`council/README.md`](./council/README.md) |
| 6 | [`consultations/`](./consultations/README.md) | 8 | 12 | 🟢 Complete | [`consultations/README.md`](./consultations/README.md) |
| 7 | [`appointment-admin/`](./appointment-admin/README.md) | 2 | 11 | 🟢 Complete | [`appointment-admin/README.md`](./appointment-admin/README.md) |
| 8 | [`notifications/`](./notifications/README.md) | 1 | 4 | 🟡 Partial | [`notifications/README.md`](./notifications/README.md) |
| 9 | [`customers/`](./customers/README.md) | 6 | 8 | 🟡 Partial | [`customers/README.md`](./customers/README.md) |
| 10 | [`staff/`](./staff/README.md) | 4 | 10 | 🟡 Partial | [`staff/README.md`](./staff/README.md) |
| 11 | [`administration/`](./administration/README.md) | 8 | 2 | 🔴 Not Started | [`administration/README.md`](./administration/README.md) |
| 12 | [`system-admin/`](./system-admin/README.md) | 5 | 2 | 🔴 Not Started | [`system-admin/README.md`](./system-admin/README.md) |
| — | [`includes/`](./includes/README.md) | 4 | 6 | 🟡 Partial | [`includes/README.md`](./includes/README.md) |

**Legend**: 🟢 Complete (all wireframes done) | 🟡 Partial (some wireframes done) | 🔴 Not Started

## Overall Progress

### Wireframe Creation

**Total Wireframes**: 76 wireframes planned across 12 domains

| Status | Count | Percentage |
|--------|-------|------------|
| ✅ Complete | 58 | 76% |
| 📝 In Progress | 8 | 11% |
| 📋 Planned | 10 | 13% |

### By Domain

| Completion | Domains |
|------------|---------|
| 🟢 **Complete** (100%) | `appointments/`, `consultations/`, `appointment-admin/` |
| 🟡 **Partial** (50-90%) | `dashboard/`, `shifts/`, `council/`, `notifications/`, `customers/`, `staff/`, `includes/` |
| 🔴 **Not Started** (0%) | `treatments/`, `administration/`, `system-admin/` |

## Wireframe File Structure

Each domain folder contains:

```
{domain}/
├── README.md              # Domain overview with wireframe inventory
├── {wireframe-name}.pen   # Pencil source file
├── {wireframe-name}.png   # Exported screenshot
└── workflows.md           # User journey flowcharts (optional)
```

### Example: Appointments Domain

```
appointments/
├── README.md
├── list.pen                # MonthTable calendar grid
├── list.png
├── details.pen             # 5-tab detail dialog
├── details.png
├── details-referenced.pen  # Referenced tab
├── details-referenced.png
├── details-patients.pen    # Patients tab
├── details-patients.png
├── details-assigned.pen    # Assigned tab
├── details-assigned.png
├── details-suggestions.pen # Suggestions tab
├── details-suggestions.png
├── assign-user.pen         # Collision dialog
├── assign-user.png
└── state-legend.pen        # State reference card
└── state-legend.png
```

## Shadcn/ui Component Usage

Wireframes use the following Shadcn/ui components:

| Component | Usage Count | Domains |
|-----------|-------------|---------|
| `@shadcn/data-table` | 25 | All CRUD grids |
| `@shadcn/drawer` | 18 | Detail dialogs (side panels) |
| `@shadcn/dialog` | 15 | Modal dialogs |
| `@shadcn/tabs` | 12 | Multi-tab interfaces |
| `@shadcn/button` | 76 | All screens |
| `@shadcn/input` | 45 | All forms |
| `@shadcn/select` | 22 | Dropdown selects |
| `@shadcn/combobox` | 18 | Autocomplete fields |
| `@shadcn/checkbox` | 15 | Boolean toggles |
| `@shadcn/badge` | 20 | State indicators |
| `@shadcn/avatar` | 8 | User profile images |
| `@shadcn/calendar` | 6 | Date pickers |

## Workflows Documentation

Each domain's `workflows.md` file contains Mermaid flowcharts documenting:

- **User journey flowcharts** — Step-by-step user interactions
- **State diagrams** — Entity state machines
- **Sequence diagrams** — User ↔ system interactions
- **Decision trees** — Type-driven visibility logic

### Example Workflows

| Domain | Workflow Areas | File |
|--------|----------------|------|
| Appointments | 10 areas (lifecycle, state machine, collision, etc.) | [`appointments/workflows.md`](./appointments/workflows.md) |
| Consultations | 8 areas (detail header, forms, review, etc.) | [`consultations/workflows.md`](./consultations/workflows.md) |
| Dashboard | 6 areas (lifecycle, self-service, availability, etc.) | [`dashboard/workflows.md`](./dashboard/workflows.md) |

## Annotation Legend

Wireframes use the following annotation conventions:

| Annotation | Meaning |
|------------|---------|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key |
| `[repeats]` | Collection row template |
| `[state: X]` | Shown only in state X |
| `[type: X]` | Shown only for type X |
| `[cond: expr]` | Conditional visibility logic |
| `[color: class]` | State-based color annotation |
| `[PERM: key]` | Permission-gated element |
| `data.field.path` | Datamodel binding |
| `@shadcn/component` | Target UI component |

## Domain READMEs

Each domain README includes:

1. **Domain Overview** — Brief description and key features
2. **Entity List** — Main entities with state machine references
3. **Analysis Documents** — Links to corresponding analysis specs
4. **Wireframe Inventory** — Table of all wireframes with status
5. **Workflows** — Link to user journey documentation
6. **Permissions** — Role/permission requirements
7. **Integration Points** — Cross-domain dependencies
8. **Migration Progress** — Analysis and wireframe phase checklists

## Related Documents

- **[Analysis Directory](../analysis/README.md)** — Functional analysis specifications
- **[Site Navigation](../analysis/SITE-NAVIGATION.md)** — Complete sitemap
- **[Migration Plan](../MIGRATION-PLAN.md)** — Directory restructuring plan
- **[Table View Rules](../rules/table-view.md)** — TanStack React Table guidelines
- **[AGENTS.md](../../AGENTS.md)** — Project-specific agent instructions

## Version History

| Date | Version | Changes |
|------|---------|---------|
| 2026-03-31 | 1.0 | Initial domain-based organization |

---

**Next**: [`../analysis/SITE-NAVIGATION.md`](../analysis/SITE-NAVIGATION.md) — Complete sitemap with detailed module navigation
