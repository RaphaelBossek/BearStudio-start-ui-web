# Wireframe Plan — Treatment (Dashboard Dialogs)

> **Split from**: `dash/wireframes.md`
> **Wireframe IDs preserved for traceability**
> Target directory: `specs/wireframes/treatment/dashboard/`

## Prerequisites

1. Analysis documents reviewed:
   - [`04-dialogs-treatment.md`](./dialogs-treatment.md) — End appointment, summarize appointment, incarceration dialogs
   - [`05-consultation-wizard.md`](./consultation-wizard.md) — Consultation start wizard + location wizard
   - [`07-consultation-template.md`](./07-consultation-template.md) — Template list + create dialog
2. Questionnaire analysis reviewed (QM form is embedded in dialogs):
   - [`../questionnaire/questionnaire-detail.md`](../questionnaire/questionnaire-detail.md) — QM form with rating scales
3. Data dictionary reviewed: [`../data-dictionary-treatment.md`](../data-dictionary-treatment.md)
4. Pencil MCP server is available and responsive
5. Review guidelines: `get_guidelines(topic="web-app")`

## Shadcn UI Component Mapping

| Legacy UI Element | Shadcn Component | Notes |
|:---|:---|:---|
| Modal dialog (`data-target="modal"`) | `@shadcn/dialog` | Centered overlay; used for incarceration check, template create |
| Off-canvas dialog (`data-target="secondary"`) | `@shadcn/sheet` (side="right") | Used for template list panel (400px) |
| Wizard steps (consultation wizard) | `@shadcn/stepper` or custom step layout | 4-step sequential flow with Cancel/Next buttons |
| Patient dropdown (`<select>`) | `@shadcn/select` | Populated from `appointment.patients[]` |
| Book number input with dynamic mask | `@shadcn/input` + input mask library | Min 3 chars validation; mask from `location.booknumberMask` |
| Consultation type select | `@shadcn/select` | Dynamic option filtering based on job capabilities + location |
| Summary display fields | `@shadcn/card` with read-only text | Expert title, location, book number, type |
| Location autocomplete | `@shadcn/command` (combobox pattern) | `LocationService.autocomplete`; displays `name` |
| Time input (clockpicker) | `@shadcn/input` (type="time") | `data.timeStart`, `data.timeEnd`, `data.summary.adjustedStart`, etc. |
| Communication type select | `@shadcn/select` | Options: VIDEO, VCGO, PHONE, EMAIL |
| Further treatment counter inputs | `@shadcn/input` (type="number") | 4 counters + computed total |
| QM questionnaire embed | Reuse W2 from questionnaire plan | `{{> detailQuestionaire}}` partial |
| Alert warning (previous retrieval) | `@shadcn/alert` (variant="destructive") | Conditional: shown when `data.dateRetrieved` is truthy |
| Address form (incarceration) | `@shadcn/input` fields in grid layout | Name, address, zip+state+city, country, additional text |
| Template list table | `@shadcn/table` | Name (bold), description, edit/remove action buttons |
| Client-side text filter | `@shadcn/input` with search icon | Prefix match filter on template names |
| Create/Edit/Remove buttons | `@shadcn/button` (variants) | Primary for edit, secondary for remove, with icons |
| Confirmation prompt (delete) | `@shadcn/alert-dialog` | Confirm before removing template or submitting summary |
| Text info blocks (HTML content) | `@shadcn/card` or plain text | `[contains HTML]` annotation where applicable |
| Cancel / Next buttonset | `@shadcn/button` pair | Cancel (secondary), Next (primary + arrow icon) |
| CRUD buttons (Save/Cancel) | Dialog footer `@shadcn/button` pair | Standard dialog save/cancel pattern |

## Wireframe Inventory

| ID | Wireframe | Analysis Source | Complexity | Description |
|:---|:---|:---|:---|:---|
| W5 | `consultation-wizard.pen` | 05-consultation-wizard.md | Medium | 4 wizard steps as separate frames: (1) patient select dropdown populated from `appointment.patients`, (2) book number input with `[masked]` annotation + info text with `[contains HTML]`, (3) consultation type select with dynamic filtering annotations, (4) success summary with field displays. Include entry-point decision annotation (3-way routing: location wizard, BasisWeb wizard, or this wizard). |
| W7 | `consultation-location-wizard.pen` | 05-consultation-wizard.md | Low | Single-step dialog: location autocomplete (`[autocomplete: LocationService.autocomplete]`) + Cancel/Next buttons. Triggered when appointment has no location. |
| W9 | `consultation-template.pen` | 07-consultation-template.md | Low | Two frames: (a) template list panel (400px wide) — toolbar with filter input + create button, table with name/description/edit/remove; (b) create dialog — name input (mandatory) + description textarea. |
| W11 | `summarize-appointment.pen` | 04-dialogs-treatment.md §5 | Medium | Complex dialog (1000px): appointment info display row, adjusted start/end time inputs, communication type select (VIDEO/VCGO/PHONE/EMAIL), 4 further-treatment counter inputs (referral/WV/follow-up/referral-other) with live total, included QM questionnaire area. Dynamic title per appointment type (APPOINTMENT/SHIFT/COUNCIL). |
| W12 | `incarceration-dialogs.pen` | 04-dialogs-treatment.md §7-8 | Medium | Two frames: (a) check dialog — book number + code inputs (both mandatory); (b) retrieval dialog — read-only book/code, previous retrieval warning alert (`[cond: data.dateRetrieved]`), full address form (name, address, address2, zip+state+city, country, additional text). |
| W13b | `end-appointment.pen` | 04-dialogs-treatment.md §3 | Low | End appointment dialog (900px): confirmation text, adjustable start/end time inputs, included QM questionnaire area. Same QM embed as summarize dialog. |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document section(s)
2. **Open** Pencil: `open_document("specs/wireframes/treatment/dashboard/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **List registry**: `Shadcn_list_items_in_registries(["@shadcn"])` (first wireframe only)
5. **Design** using `batch_design()`:
   - Dialog wireframes: 600px width for standard dialogs, 1000px for summarize
   - Wizard wireframes: each step as a separate frame at 600px, arranged horizontally
   - Apply annotations from the legend below
6. **Validate** with `get_screenshot()`
7. **Export** to PNG in `specs/wireframes/treatment/dashboard/`
8. **Embed** screenshots in `specs/wireframes/treatment/workflows.md`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key — string is hard-coded in legacy |
| `[contains HTML]` | i18n value contains HTML that must be rendered |
| `[masked: location.booknumberMask]` | Dynamic input mask from location configuration |
| `[autocomplete: ServiceName.method]` | Autocomplete data source |
| `[cond: expression]` | Conditional visibility |
| `[computed: sum of inputs]` | Dynamically calculated value |
| `[filtered: job capabilities]` | Options filtered by job capability flags |
| `[default: value]` | Default/pre-selected value |
| `[dynamic-title: type→label]` | Dialog title changes based on appointment type |
| `[embed: QM questionnaire]` | Embedded QM form (reference questionnaire W2) |
| `data.field.path` | Datamodel binding |
| `@shadcn/component` | Target UI component mapping |

## Dependency Notes

- **Consultation wizard routing**: Before this wizard opens, the system checks:
  1. Does the appointment have a location? If no → open Location Wizard (W7) first
  2. Is the location type `EXTERNAL_BASISWEB` and appointment not `LOCKEDIN`? If yes → route to BasisWeb Wizard (Batch 1, already wireframed)
  3. Otherwise → open this Consultation Wizard (W5)
  The wireframe should annotate this 3-way entry point decision.

- **QM Questionnaire embed**: The `detailQuestionaire` partial (questionnaire W2) is included in both `#endAppointmentDlg` (W13b) and `#summarizeAppointmentDlg` (W11). The wireframes should reference W2 with an `[embed: QM questionnaire]` annotation rather than duplicating the full form.

- **Consultation type filtering**: The type select in step 3 of the wizard uses job capability flags (`consultationStandard`, `consultationOnboarding`, etc.) and location properties (`patientDataType`) to filter available options. The wireframe should show all 7 types but annotate each with its filtering condition.

- **Incarceration flow**: Dialog 7 (check) leads to Dialog 8 (retrieval). The check dialog validates book number + code via `ConsultationService.checkCustomer`, then hands data to the retrieval dialog. This two-step flow should be visually connected in the wireframe.
