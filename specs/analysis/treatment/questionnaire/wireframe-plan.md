---
title: 'Wireframe Plan'
---

---
---

# Wireframe Creation Plan — Questionnaire Module

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/treatment/questionnaire/`

## Prerequisites

1. All 2 analysis documents in `specs/analysis/treatment/questionnaire/` are complete and reviewed
2. Pencil MCP server is available and responsive
3. Review the Pencil style guide for web-app design: `get_guidelines(topic="web-app")`
4. Obtain a style guide with relevant tags: `get_style_guide_tags` then `get_style_guide(tags=[...])`
5. Data dictionary reviewed: [`treatment/data-dictionary-treatment.md`](../../data-dictionary-treatment.md)

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN)
- **Module overrides**: `messages.i18n.js`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Layout complexity

- **List page** has a 24-column grid — too wide to show all columns at once. Wireframe should show a representative subset and note horizontal scrolling.
- **Inline detail** is inside the same page, not a separate dialog. It renders below/alongside the selected row.
- **Rating table** uses a school-grade scale (1-6) rendered as radio buttons — needs a clear visual pattern.

### Conditional visibility

- **Equipment ratings** (4 rows) hidden by default, shown based on job type (non-psych) or when saved values exist
- **Referral question** hidden for EXTERNAL consultations
- **Mandatory comment** triggered when any equipment rating is 5 or 6 (`requireDocumentation` class)

### Rating scale patterns

Three distinct rating scales need different wireframe representations:

| Scale | Range | Visual pattern |
|:---|:---|:---|
| School grade | 1-6 | 6 radio buttons, labeled 1 (best) to 6 (worst) |
| Probability | 1-6 | 6 radio buttons, labeled "necessary" to "not at all" |
| Boolean | yes/no | 2 radio buttons |

### Spelling normalization

Legacy uses `questionaire` (one 'n'). Modern implementation should use `questionnaire`. Wireframes should use the corrected spelling.

## Shadcn UI Component Mapping

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| SlickGrid (24-column data grid) | `@shadcn/table` + `@shadcn/data-table` | Use TanStack Table with column visibility toggles; horizontal scroll for overflow |
| Toolbar buttons (Edit, Delete, Action) | `@shadcn/button` + `@shadcn/tooltip` | Disabled by default; enable on row selection |
| Detail panel (800px off-canvas) | `@shadcn/sheet` (side="right") | Or embedded inline panel with `@shadcn/card` |
| Header info fields (appointment, customer, location, expert) | `@shadcn/badge` or plain text in `@shadcn/card` | Read-only display row |
| Date + time range display | `@shadcn/badge` with calendar icon | `data.qm.date`, `timeStart` – `timeEnd` |
| Appointment counts section | Grid of `@shadcn/card` stat displays | 5 counters in responsive grid |
| Radio button groups (1-6 scale) | `@shadcn/toggle-group` (type="single") | Reusable `<RatingScale>` component; 6 toggles per group |
| Equipment radio groups (1-6 + "not required") | `@shadcn/toggle-group` (type="single") | 7 toggles (6 + "not required"); default `-1`; wraps in collapsible section |
| Boolean radio (yes/no) | `@shadcn/toggle-group` (type="single") | 2 toggles: Yes / No |
| Conditional equipment section | `@shadcn/collapsible` or conditional rendering | Hidden when job type is "psych"; auto-expand when saved value > 0 |
| Mandatory comment textarea | `@shadcn/textarea` | Becomes required (with min 3 chars) when any equipment rating is 5 or 6 |
| Free-text comment | `@shadcn/textarea` | `data.qm.comment` (currently commented out in legacy) |
| Visibility toggles (`.allowHiding`) | Conditional rendering in React | Equipment rows hidden when value = -1; shown when > 0 |
| Smiley/frown icons on scale | Lucide `Smile` / `Frown` icons | Placed at scale endpoints (1 = best/smile, 6 = worst/frown) |
| Probability scale labels | Custom label array | "necessary" → "not at all" for `ratingRequireExtraReferal` |
| Data grid formatters (`Formatter.dateTime`, `Formatter.bool`) | TanStack Table cell renderers | Custom column definition with `{ cell: ... }` |
| Grid settings persistence | User preferences store | Column widths/order saved per user via settings API |

## Wireframe Inventory

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `questionnaire-list.pen` | 01 | Medium | List page with 24-column grid (show subset), toolbar, inline detail panel |
| W2 | `questionnaire-detail.pen` | 02 | Medium | Detail form: header, counts, 12 rating questions with radio scales, conditional equipment section, comment |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/treatment/questionnaire/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **List registry**: `Shadcn_list_items_in_registries(["@shadcn"])` (first wireframe only)
5. **Design** using `batch_design()`:
   - For list: show grid with representative columns (ID, date, type, key ratings), inline detail expanded below
   - For detail: show all rating rows with radio button pattern (toggle-group), equipment section with `[conditional]` annotation
   - Annotate hidden defaults (-1), conditional visibility rules, scale types
   - Frame width: 1440px for list page, 800px for detail panel
6. **Validate** with `get_screenshot()`
7. **Export** to PNG in `specs/wireframes/treatment/questionnaire/`
8. **Embed** screenshots in `specs/wireframes/treatment/workflows.md`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key |
| `[conditional: job.remoteCode != "psych"]` | Shown only when job type is not psychiatric |
| `[conditional: type != EXTERNAL]` | Hidden for EXTERNAL consultation type |
| `[mandatory-when: equipmentRating >= 5]` | Conditional required field |
| `[default: -1]` | Hidden input with default value (not applicable / not used) |
| `[dead]` | Commented-out / inactive element |
| `[allowHiding]` | Row hidden when value = -1 |
| `[scale: school 1-6]` | School grade rating scale (sehr gut → ungenügend) |
| `[scale: probability 1-6]` | Probability scale (notwendig → gar nicht) |
| `[scale: bool]` | Yes / No toggle |
| `data.qm.field` | Datamodel binding |
| `@shadcn/component` | Target UI component mapping |

## Dependency Notes

- The QM questionnaire form (`detailQM.html`) is **reused** in both the standalone questionnaire detail view AND embedded in dashboard dialogs (`#endAppointmentDlg`, `#summarizeAppointmentDlg`). The wireframe for W2 serves as the canonical reference for both use cases.
- The `filterQm()` function's conditional visibility logic applies in all contexts where the QM form is rendered. The wireframe should annotate these conditions clearly.
