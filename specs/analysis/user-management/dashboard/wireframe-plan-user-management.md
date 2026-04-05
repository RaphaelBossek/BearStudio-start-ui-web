---
title: 'Wireframe Plan User Management'
---

# Wireframe Plan -- User Management (Dashboard) (Expanded)

> **Split from**: `dash/wireframes.md`
> **Wireframe IDs preserved for traceability**
> **Target directory**: `specs/wireframes/user-management/dashboard/`

## Prerequisites

1. Analysis document: `specs/analysis/user-management/dashboard/dialogs-user-management.md`
2. Data dictionary: `specs/analysis/user-management/data-dictionary-user-management.md` (Section 17)
3. Pencil MCP server available
4. Design system reference from Batch 1

---

## Shadcn Component Mapping

| Legacy UI Pattern | Shadcn Component | Notes |
|:---|:---|:---|
| Dialog container | `@shadcn/dialog` | Modal with controlled open state |
| Date input (`#employeeDateInput`) | `@shadcn/input` type="date" or `@shadcn/calendar` + `@shadcn/popover` | DatePicker pattern |
| Collection table (department stats) | `@shadcn/table` | Read-only data display |
| Icon-labeled table headers | `@shadcn/tooltip` + Lucide icons | Calendar, Briefcase, Palmtree icons |
| Dialog title | Dialog header text | `employee.dialogtitle` = "Experts" |

---

## Wireframe Inventory

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W14 | `user-stats.pen` | 04-dialogs-user-management.md | Low | Single dialog: date picker input at top, stats collection table below (department name, available count, booked count, holiday count columns with icon headers). Triggered from dashboard date widget. |

---

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `[HARDCODED]` | Needs i18n key (e.g., "Verfugbar", "Gebucht", "Urlaub" header titles) |
| `@shadcn/component` | Target Shadcn UI component |
| `data.path.field` | Data model binding |
| `[repeats]` | Collection row |

---

## Execution Steps

### Step 1: Load design system

```
pencil_get_guidelines(topic="design-system")
```

### Step 2: Create wireframe

**W14 user-stats.pen** -- Single frame:
- Dialog frame (600px width, standard dialog conventions)
- Header: "Experts" title with `fa-user-tie` icon, staff color
- Body:
  - Date input row: `data.ts` date picker
  - Stats table:
    - Column headers with icons: (empty), Calendar "Available", Briefcase "Booked", Palmtree "Holiday"
    - Collection rows: `count.department.description`, `count.available`, `count.booked`, (holiday -- no data field rendered)
- Footer: Standard OK/Cancel

### Step 3: Export and document

```
pencil_export_nodes() -> user-stats.png
```

Embed screenshot into `specs/wireframes/user-management/workflows.md`.

---

## Notes

- The Holiday column header exists in the legacy UI but has **no matching data field** in the row template -- this is a known gap from the analysis. The wireframe should include the column header but annotate the missing binding.
- This dialog is accessible to all dashboard users (no permission gating).
- The date change triggers `InfoService.getNumbers(dateValue)` which returns per-department stats.
