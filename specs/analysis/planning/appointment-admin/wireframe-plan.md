---
title: 'Wireframe Plan'
---

# Wireframe Creation Plan — Planning Domain: Appointment Admin Module

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/planning/appointment-admin/`

## Prerequisites

1. Analysis document in `specs/analysis/planning/appointment-admin/` is complete:
   - `01-appointment-admin.md` — Appointment admin/billing with 10 dialogs, 34 service calls
2. Pencil MCP server is available and responsive
3. Review completed wireframes: `specs/wireframes/consultations/` for consultation patterns
4. Data dictionary: `specs/analysis/planning/data-dictionary-planning.md`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `messages.i18n.js` in `/appointmentAdmin/` directory
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Architecture Note

- **Most complex module**: 34 service calls, 10 dialogs, inline consultations, QM ratings, calculation logic
- **10 distinct dialogs**: Inline consultation, calculation, QM, export dialogs, email, print preview
- **Needs decomposition**: Should be split into 8 sub-features for implementation

### Layout complexity

- **Inline consultation dialog** — Embedded consultation editor within admin workflow
- **Calculation dialog** — Complex pricing logic with service calls
- **QM dialog** — Questionnaire rating integration
- **Export dialogs** — Multiple export formats (XLS, XML, xRechnung)
- **Email dialog** — Invoice email composition with attachments
- **Print preview** — Invoice print template

### State-driven dynamic UI

- **Invoice state machine** — Controls which actions are available
- **Export polling** — Async job status polling with progress indicator
- **Calculation logic** — Dynamic price calculation based on service rules

### Special components requiring detailed wireframing

| Component | Location | Wireframe notes |
|:---|:---|:---|
| Inline consultation | Admin dialog | Embedded consultation editor, patient select |
| Calculation dialog | Calculation | Price breakdown, service rules, manual override |
| QM dialog | QM | Questionnaire ratings, 3 scales |
| Export dialog | Export | Format select (XLS/XML/xRechnung), filters |
| Email dialog | Email | Recipient, subject, body, attachments |
| Print preview | Print | Invoice template preview |

### Hardcoded German strings (~30+ found)

Wireframes should use **English translations**. Mark hardcoded strings with `[HARDCODED]`.

## Shadcn UI Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:---|:---|:---|
| Inline consultation | `@shadcn/dialog` (900px) | Embedded consultation editor |
| Calculation dialog | `@shadcn/dialog` (800px) | Price breakdown table, overrides |
| QM dialog | `@shadcn/dialog` (700px) | Rating scales, radio groups |
| Export dialog | `@shadcn/dialog` (600px) | Format select, date range, filters |
| Email dialog | `@shadcn/dialog` (700px) | Email composition, attachment list |
| Print preview | `@shadcn/dialog` (1000px) | Invoice preview, print button |
| Patient autocomplete | `@shadcn/combobox` | Patient search |
| Service calls | TanStack Query | 34 service endpoints |
| Job status polling | `@shadcn/progress` | Async export polling |

## Wireframe Inventory

### Phase 1: Core wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `admin-inline-consultation.pen` | 01 | High | Embedded consultation editor within admin workflow |
| W2 | `admin-calculation.pen` | 01 | High | Price breakdown, service rules, manual overrides |
| W3 | `admin-qm.pen` | 01 | Medium | Questionnaire ratings, 3 scales |
| W4 | `admin-export.pen` | 01 | Medium | Export format select, filters, async polling |
| W5 | `admin-email.pen` | 01 | Low | Invoice email composition, attachments |

### Phase 2: Supporting wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W6 | `admin-print-preview.pen` | 01 | Medium | Invoice print template preview |
| W7 | `admin-job-status.pen` | 01 | Low | Async job polling dialog |
| W8 | `admin-state-legend.pen` | 01 | Low | Invoice state legend |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/planning/appointment-admin/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **Design** using `batch_design()`:
   - Focus on one dialog at a time
   - Annotate all service calls with `@service: ServiceName.method`
   - Mark calculation logic with `[calc: expression]`
   - Mark async operations with `[async]`
5. **Validate** with `get_screenshot()`
6. **Export** to PNG: `export_nodes()` to `specs/wireframes/planning/appointment-admin/`
7. **Embed screenshots** in `specs/wireframes/planning/workflows.md`
8. **Log completion** in `specs/analysis/wireframes-index.md`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key |
| `[async]` | Async operation |
| `@service: Method` | Service call annotation |
| `[calc: expr]` | Calculation logic |
| `data.field.path` | Datamodel binding |
| `@shadcn/component` | Target UI component |

## Completion Tracking

| Wireframe ID | Status | Date Completed | PNG Exported |
|:---|:---|:---|:---|
| W1 | Done | 2026-03-31 | Yes |
| W2 | Done | 2026-03-31 | Yes |
| W3 | Done | 2026-03-31 | Yes |
| W4 | Done | 2026-03-31 | Yes |
| W5 | Done | 2026-03-31 | Yes |
| W6 | Done | 2026-03-31 | Yes |
| W7 | Done | 2026-03-31 | Yes |
| W8 | Done | 2026-03-31 | Yes |
