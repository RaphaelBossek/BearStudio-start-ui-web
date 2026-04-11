---
name: cross-references
description: Add bidirectional cross-references between analysis markdown files. Covers event flows (jQuery triggers, function calls), structural dependencies (script includes, Mustache partials), and split-file relationships. Use when spec files are coupled through events, shared templates, or script includes and need navigable links between them.
argument-hint: [source-file] [target-file] [coupling-type]
user-invocable: true
allowed-tools: Read, Write, Edit, Glob, Grep
---

# Analysis File Cross-References

## Role

You maintain navigable, bidirectional links between analysis/spec markdown files that are coupled through any of three mechanisms:

1. **Event flows** — `$(document).trigger()` / `.on()` patterns, or direct function calls across namespaces (e.g. `ConsultationDetails.open()`)
2. **Script/partial includes** — Mustache partials (`{{> partialName}}`), `<script src="...">` includes, or template embeds that pull one brownfield source into another
3. **Split-file relationships** — when a single brownfield source (e.g. `appointment/details.html`) was split into multiple analysis files covering different aspects (e.g. scheduling vs. patient tabs)

The goal is to let readers jump back and forth between related spec files without grep-ing the codebase.

## When to Use

- A spec file documents a UI that fires an event or calls a function defined in another spec file
- A spec file's brownfield source is included as a Mustache partial or script tag in another spec file's brownfield source
- A spec file was split from the same brownfield source as another spec file
- You need to make any of these relationships explicit and navigable

## Section Format

Add a `## Cross-References` section to each participating file. Place it **early in the document** — after the title/frontmatter and source-file references, but **before** the first content section.

### Required Table

```markdown
## Cross-References

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| event | **Outgoing** | `loadConsultation` | [Consultation Wizard](path#anchor) | `newPatient` click |
| event | **Incoming** | `ConsultationDetails.open()` | [Dashboard Main](path#anchor) | Consultation row click |
| include | **Included by** | `{{> assignUserDlg}}` | [Appointment List](path#anchor) | Mustache partial |
| include | **Includes** | `<script src="expertDays.js">` | [Expert Availability](path#anchor) | Script include |
| split | **Sibling** | Same source: `appointment/details.html` | [Appointment Details Patient](path#anchor) | Tab 3 extracted |
```

The **Type** column classifies the coupling:
- `event` — document-level events, direct function calls across files
- `include` — Mustache partial includes (`{{> name}}`), script includes (`<script src="...">`), template embeds
- `split` — two analysis files covering different parts of the same brownfield source

The **Direction** column uses these values:
- For `event`: **Incoming** / **Outgoing**
- For `include`: **Included by** (this file's source is pulled into another) / **Includes** (this file's source pulls in another)
- For `split`: **Sibling** (peer relationship — both directions get the same type)

### Required Chain/Context Summary

Below the table, add a blockquote summarising the relationship:

For event flows:
```markdown
> **Event chain:** [File A](path) -> `event1` -> **this file** -> `event2` -> [File C](path)
```

For includes:
```markdown
> **Include context:** This file's source `assignUser.html` is embedded as `{{> assignUserDlg}}` in [Appointment List](path), [Shift List](path), [Treatment List](path), and [Council List](path).
```

For splits:
```markdown
> **Split origin:** Both this file and [Appointment Details Patient](path) were extracted from `appointment/details.html`. This file covers scheduling (Tabs 1/2/4/5); the sibling covers patient data (Tab 3).
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
- For includes: *which partial/script name* and *what it provides* (e.g. "Collision resolution dialog for doctor assignments")
- For splits: *which portion* of the original source each sibling covers

### 4. Standardized section name

Always use exactly `## Cross-References` as the heading. This makes it searchable with grep across the spec tree.

**Migration note:** Files with the older `## Event Flow Cross-References` heading should be updated to `## Cross-References` when touched. The table gains a new `Type` column.

### 5. One table per file, multiple rows

If a file has multiple cross-references of different types, list them all in the same table. Group by type: `event` rows first, then `include`, then `split`.

### 6. Chain/context summary covers the full picture

The summary should give readers enough context to understand the full relationship without reading the table row by row.

### 7. Preserve existing content

Never remove or reorder existing sections when adding cross-references. Insert the new section in the designated position (after title/source, before first content section) and leave everything else untouched.

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
- **Event**: `$(document).trigger()`, `.on()`, direct namespace function calls (e.g. `ConsultationDetails.open()`)
- **Include**: Mustache `{{> partial}}`, `<script src="...">` tags, template includes in HTMLM headers
- **Split**: "Split from" / "Sections extracted" notes at the top of analysis files

### Step 2: Identify all participating files

For includes, search for the partial/script name across all analysis files to find every host that embeds it. For events, trace the full call chain. For splits, find all analysis files mentioning the same brownfield source.

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

### Example 1: Event flow (function call)

```markdown
## Cross-References

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| event | **Incoming** | `ConsultationDetails.open()` | [Dashboard Main](../../system/dashboard/dashboard-main.md#block-consultations-table) | Consultation row click (editable) |
| event | **Incoming** | `ConsultationDetails.open()` | [Consultation Wizard](../dashboard/consultation-wizard.md#54-step-4-cw-success--summary--confirm) | After `ConsultationService.start` succeeds |

> **Incoming calls:** [Dashboard Main](path), [Consultation Wizard](path), [BasisWeb Wizard](path), and [Consultation Template](path) all call `ConsultationDetails.open()` -> **this file**
```

### Example 2: Mustache partial include

```markdown
## Cross-References

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Included by** | `{{> assignUserDlg}}` | [Appointment List](../../planning/appointment/appointment-list.md) | Collision resolution dialog |
| include | **Included by** | `{{> assignUserDlg}}` | [Shift List](../../planning/shift/shift-and-plan.md) | Reused for shift assignments |
| include | **Included by** | `{{> assignUserDlg}}` | [Treatment List](../../treatment/treatment-core/treatment-and-category.md) | Reused for treatment assignments |
| include | **Included by** | `{{> assignUserDlg}}` | [Council List](../../planning/council/council-and-plan.md) | Reused for council assignments |

> **Include context:** This file's source `assignUser.html` is embedded as `{{> assignUserDlg}}` partial in 4 host pages: appointment list, shift list, treatment list, and council list.
```

### Example 3: Split-file relationship

```markdown
## Cross-References

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `appointment/details.html` + `details.js` | [Appointment Details Patient](../../treatment/appointment-patient/appointment-details-patient.md) | Tab 3 (Patients) extracted to sibling |

> **Split origin:** Both this file and [Appointment Details Patient](path) were extracted from `appointment/details.html`. This file covers scheduling (Tabs 1/2/4/5); the sibling covers patient data (Tab 3).
```

### Example 4: Script include

```markdown
## Cross-References

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Included by** | `<script src="/profile/expertDays.js">` | [Month View](../../planning/dashboard/month-view.md) | Month availability grid logic |
| include | **Included by** | `<script src="/profile/expertWeek.js">` | [Week View](../../planning/dashboard/week-view.md) | Week availability grid logic |

> **Include context:** `expertDays.js` is loaded by month view; `expertWeek.js` is loaded by week view and treatment plan. Both operate on table elements defined in the host page's HTML.
```
