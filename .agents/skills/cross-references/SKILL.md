---
name: cross-references
description: Add standardized cross-references between analysis markdown files. Covers source includes (Mustache partials, script includes), service calls (backend invocations), event flows (jQuery triggers, function calls), and split-file relationships. Use when spec files are coupled through events, shared templates, or script includes and need navigable links between them.
argument-hint: [source-file] [target-file] [coupling-type]
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Analysis File Cross-References

## Role

You maintain navigable, bidirectional links between analysis/spec markdown files that document the same brownfield application. Files are coupled through:

1. **Source Includes** — Mustache partials (`{{> partialName}}`), `<script src="...">` includes, or template embeds that pull one brownfield source into another
2. **Service Calls** — Backend service invocations via `Service.method(params)` patterns in JavaScript
3. **Event Flows** — jQuery events (`$(document).trigger()` / `.on()`) or direct namespace function calls (e.g. `ConsultationDetails.open()`)
4. **Split-file Relationships** — when a single brownfield source was split into multiple analysis files covering different aspects

The goal is to let readers jump back and forth between related spec files without grep-ing the codebase.

## When to Use

- A spec file documents a UI that fires an event or calls a function defined in another spec file
- A spec file's brownfield source is included as a Mustache partial or script tag in another spec file's brownfield source
- A spec file was split from the same brownfield source as another spec file
- A spec file makes backend service calls that should be documented
- You need to make any of these relationships explicit and navigable

## Standardized Section Format

Add a `## Cross-References` section to each analysis file. Place it **early in the document** — after the title/frontmatter and source-file references, but **before** the first content section.

### Required Structure

```markdown
## Cross-References

### Source Files

| File | Purpose |
|------|---------|
| `web/src/main/webapp/consultation/index.htmlm` | Page template |
| `web/src/main/webapp/consultation/index.js` | Page behavior |
| `web/src/main/webapp/consultation/messages.i18n.js` | Translations |

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Includes** | `{{> partialName}}` | [Document](path#anchor) | What the partial provides |
| include | **Included by** | `{{> partialName}}` | [Host Document](path#anchor) | Where it's embedded |

### Service Calls

| Service | Method | Parameters | Dialog / Context |
|---------|--------|------------|------------------|
| `AppointmentService` | `done` | `[id, timeStart, timeEnd, qm]` | `#endAppointmentDlg` |
| `ConsultationService` | `checkCustomer` | `[bookNumber, code]` | `#consultationIncarcerationCheck` |

### Event Flows

| Type | Direction | Event | Linked Document | Condition |
|------|-----------|-------|-----------------|----------|
| event | **Incoming** | `ConsultationDetails.open()` | [Dashboard Main](path#anchor) | Consultation row click |
| event | **Outgoing** | `loadBasisweb` | [BasisWeb Wizard](path#anchor) | Conditional on patient type |

---

### Type Column Values

The **Type** column classifies the coupling:
- `include` — Mustache partial includes (`{{> name}}`), script includes (`<script src="...">`), template embeds
- `service` — Backend service invocations via `Service.method(params)` patterns
- `event` — jQuery events or direct function calls across files
- `split` — two analysis files covering different parts of the same brownfield source

### Direction Column Values

- For `event`: **Incoming** / **Outgoing**
- For `include`: **Included by** (this file's source is pulled into another) / **Includes** (this file's source pulls in another)
- For `split`: **Sibling** (peer relationship — both directions get the same type)

### Required Chain/Context Summary

Below the tables, add a blockquote summarising the relationship:

```markdown
> **Include context:** This file's source `detailQM.html` is embedded as `{{> detailQuestionaire}}` partial in [Dialogs Treatment](path), [Consultation Details Header](path), and [Appointment Admin](path).

> **Event chain:** [Dashboard Main](path) -> `loadConsultation` -> **this file** -> `loadBasisweb` -> [BasisWeb Wizard](path)
```

### Close with a horizontal rule

End the section with `---` to visually separate it from the document body.

## Rules

### 1. Bidirectional — always update both sides

When file A includes file B's source:
- File A gets an **Includes** row linking to file B
- File B gets an **Included by** row linking to file A

When file A triggers an event handled by file B:
- File A gets an **Outgoing** row linking to file B
- File B gets an **Incoming** row linking to file A

When files A and B are split siblings:
- Both get a **Sibling** row linking to each other

Never add a link in only one direction.

### 2. Use relative paths with deep anchors

Links must use **relative markdown paths**, not absolute filesystem paths.

Target the **most relevant section anchor** in the linked file. Use GitHub-compatible heading anchors (lowercase, hyphens, no special chars).

### 3. Document the condition or context

The **Condition / Context** column must explain:
- For events: *when* the event fires (guard expressions, user actions)
- For includes: *which partial/script name* and *what it provides*
- For services: *which dialog or context* uses this call

### 4. Standardized section name

Always use exactly `## Cross-References` as the heading. This makes it searchable with grep across the spec tree.

**Migration note:** Files with the older `## Event Flow Cross-References` heading should be updated to `## Cross-References` with the new table format including the Type column.

### 5. Subsection organization

Use four optional subsections depending on what the file contains:
1. **Source Files** — for brownfield source files analyzed (web/src/main/webapp/*); DO NOT remove this information, move it to this subsection instead of keeping blockquotes
2. **Source Includes** — for Mustache partials and script includes
3. **Service Calls** — for backend service invocations
4. **Event Flows** — for jQuery events and function calls

If a file has multiple cross-reference types, use all relevant subsections. Group by type.

### 6. Chain/context summary covers the full picture

The summary should give readers enough context to understand the full relationship without reading the table row by row.

### 7. Preserve existing content

Never remove or reorder existing sections when adding cross-references. Insert the new section in the designated position (after title/source, before first content section) and leave everything else untouched.

### 7b. Convert Source Files blockquotes to Cross-References subsection

When a file has a blockquote like:
```markdown
> **Source**: `~/src/vc/videoclinic-prod/web/src/main/webapp/{room,equipment,contact,medication,patientData}/`
> **Files analyzed**: `index.htmlm` (302 lines), `index.js` (180 lines)
```

Convert it to a **Source Files** subsection within **Cross-References** and remove the blockquote:

```markdown
## Cross-References

### Source Files

| File | Purpose |
|------|---------|
| `web/src/main/webapp/room/index.htmlm` | Room list page |
| `web/src/main/webapp/room/index.js` | Room page behavior |
...

---
```

The Source Files subsection documents which brownfield source files were analyzed to produce this document. This information was previously kept in blockquotes but should now be centralized in the Cross-References section.

### 8. Conditional branches in chains

If an event chain branches conditionally, indicate it:

```markdown
> **Event chain:** [Dashboard](path) -> `loadConsultation` -> [Consultation Wizard](path) -> (conditionally) `loadBasisweb` -> [BasisWeb Wizard](path)
```

### 9. Include multiplicity

When one file's source is included by many host pages, list all hosts as separate rows. The context summary should mention all hosts in one sentence for quick scanning.

### 10. Split provenance

For split files, always state the original brownfield source filename and what each sibling covers. This prevents confusion about why the same source appears in two analysis files.

## Workflow

### Step 1: Identify coupling type

Read all files mentioned by the user. For each file, classify the coupling:
- **Source Include**: Mustache `{{> partial}}`, `<script src="...">` tags, template includes in HTMLM headers
- **Service Call**: `Core.conn.execute("Service", "method", [params])` or similar backend invocation patterns
- **Event**: `$(document).trigger()`, `.on()`, direct namespace function calls (e.g. `ConsultationDetails.open()`)
- **Split**: "Split from" / "Sections extracted" notes at the top of analysis files

### Step 2: Identify all participating files

For includes, search for the partial/script name across all analysis files to find every host that embeds it. For services, trace the JS files for service calls. For events, trace the full call chain. For splits, find all analysis files mentioning the same brownfield source.

### Step 3: Compute relative paths

Determine the relative path from each file to every other file it references.

### Step 4: Check for existing cross-reference sections

Grep each file for `## Cross-References` (and the legacy `## Event Flow Cross-References`). If a section exists, **update it** rather than creating a duplicate. Migrate legacy sections to the new format.

### Step 5: Insert or update the section

For each file:
1. If no section exists: insert `## Cross-References` after the title block / source-file references, before the first content section
2. If a section exists: merge new rows into the existing table and update the summary
3. Add the closing `---` separator

### Step 6: Verify links

For each relative path link, verify the target file exists. Report any broken links.

## Examples

### Example 1: Dialog with source includes and service calls

```markdown
## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Includes** | `{{> detailQuestionaire}}` | [Questionnaire Detail](../../treatment/questionnaire/questionnaire-detail.md) | QM questionnaire partial |

### Service Calls

| Service | Method | Parameters | Dialog | Context |
|---------|--------|------------|--------|---------|
| `AppointmentService` | `done` | `[id, timeStart, timeEnd, qm]` | `#endAppointmentDlg` | End appointment |
| `ConsultationService` | `checkCustomer` | `[bookNumber, code]` | `#consultationIncarcerationCheck` | Verify incarceration |

---

### Example 2: Event flow with incoming and outgoing events

```markdown
## Cross-References

### Event Flows

| Type | Direction | Event | Linked Document | Condition |
|------|-----------|-------|-----------------|----------|
| event | **Incoming** | `ConsultationDetails.open()` | [Dashboard Main](../../system/dashboard/dashboard-main.md#block-consultations-table) | Consultation row click |
| event | **Outgoing** | `loadBasisweb` | [BasisWeb Wizard](../../interfaces/dashboard/basisweb-wizard.md#invocation) | `location.patientDataType == "EXTERNAL_BASISWEB"` |

> **Event chain:** [Dashboard Main](../../system/dashboard/dashboard-main.md) -> `loadConsultation` -> **this file** -> `loadBasisweb` -> [BasisWeb Wizard](../../interfaces/dashboard/basisweb-wizard.md)

---
```

### Example 3: Shared component with multiple hosts

```markdown
## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Included by** | `{{> assignUserDlg}}` | [Appointment List](../../planning/appointment/appointment-list.md) | Collision resolution dialog |
| include | **Included by** | `{{> assignUserDlg}}` | [Shift List](../../planning/shift/shift-and-plan.md) | Reused for shift assignments |
| include | **Included by** | `{{> assignUserDlg}}` | [Treatment List](../../treatment/treatment-core/treatment-and-category.md) | Reused for treatment assignments |
| include | **Included by** | `{{> assignUserDlg}}` | [Council List](../../planning/council/council-and-plan.md) | Reused for council assignments |

> **Include context:** This file's source `assignUser.html` is embedded as `{{> assignUserDlg}}` partial in 4 host pages: appointment list, shift list, treatment list, and council list.

---
```

### Example 4: Split-file relationship

```markdown
## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `appointment/details.html` + `details.js` | [Appointment Details Patient](../../treatment/appointment-patient/appointment-details-patient.md) | Tab 3 (Patients) extracted to sibling |

> **Split origin:** Both this file and [Appointment Details Patient](../../treatment/appointment-patient/appointment-details-patient.md) were extracted from `appointment/details.html`. This file covers scheduling (Tabs 1/2/4/5); the sibling covers patient data (Tab 3).

---
```

### Example 5: Script include for availability grid

```markdown
## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Included by** | `<script src="/profile/expertDays.js">` | [Month View](../../planning/dashboard/month-view.md) | Month availability grid logic |
| include | **Included by** | `<script src="/profile/expertWeek.js">` | [Week View](../../planning/dashboard/week-view.md) | Week availability grid logic |
| include | **Included by** | `<script src="/profile/expertWeek.js">` | [Treatment Plan](../../treatment/treatment-core/treatment-plan.md) | Week grid in create dialog |

> **Include context:** `expertDays.js` is loaded by month view; `expertWeek.js` is loaded by week view and treatment plan. Both scripts operate on table elements defined in the host page's HTML.

---
```
