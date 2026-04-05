---
title: 'Wireframe Plan'
---

# Wireframe Creation Plan — Consultation Module

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools.
> Target directory: `specs/wireframes/consultation/`

## Prerequisites

1. All 8 analysis documents in `specs/analysis/consultation/` are complete and reviewed
2. Pencil MCP server is available and responsive
3. Review the Pencil style guide for web-app design: `get_guidelines(topic="web-app")`
4. Obtain a style guide with relevant tags: `get_style_guide_tags` then `get_style_guide(tags=[...])`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN) under `~/src/vc/videoclinic-prod/web/src/main/resources/`
- **Module overrides**: `messages.i18n.js`, `view.i18n.js`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Findings from Analysis that Affect Wireframes

### Layout complexity

- **Consultation details dialog** is the most complex component: 778 lines HTML, 11 tabs, 7 consultation types controlling tab visibility. The detail header row has 8 form elements including autocompletes and action icons. Each type-specific form needs a **separate wireframe**.
- **View template** (`view.mustache`) has 100+ read-only fields across 8 sections with type-conditional visibility. Wireframe should show a representative layout with section annotations.
- **Standard form** has 6 collections/repeaters including **nested prescriptions** (prescription → activeIngredients). This needs careful wireframing of repeater-in-repeater layout.

### State-driven dynamic UI

- **Consultation state machine** (6 states) controls which actions are available and whether the form is editable (only OPEN allows editing).
- **Type-based tab visibility** — 7 consultation types × 11 tabs creates a complex visibility matrix. Wireframe annotations should reference the matrix in doc 02.
- **Incarceration siren animation** — blue-to-red flash on critical fields. Wireframe should annotate with `[SIREN]`.

### Conditional visibility

- `conditionize2` jQuery plugin controls field visibility based on other field values (e.g., preexisting condition textarea shown when `preexistingState === 'OTHER'`).
- `incarceration-hide` CSS class hides specific Standard form elements when in incarceration mode.
- `internalOnly` class gates gender and birthday/age fields.

### Special components requiring detailed wireframing

| Component | Location | Wireframe notes |
|:---|:---|:---|
| ICD-10 search dialog | W2 (details header) | Modal with search input, scrollable results with inclusion/exclusion lists |
| Medication search dialog | W3 (standard form) | Similar to ICD-10 but for prescriptions |
| Nested prescription collection | W3 (standard form) | Repeater with inner activeIngredients repeater, dosage grid (morning/noon/evening/night) |
| Warning categories | W6 (warning form) | 4 category-specific select→insert pattern, shared collection |
| Markdown editor | W7 (review dialog) | Full-height markdown textarea with preview |
| Siren animation | W5 (incarceration) | Annotate with `[SIREN]` indicator |
| Treatment history collection | W6 (treatment form) | Auto-dated entries with content textarea |

### Hardcoded German strings (60+ found)

Wireframes should use **English translations** for all labels. Where hardcoded German was found, use the English translation from the analysis doc and annotate with `[HARDCODED]`.

## Wireframe Inventory

### Phase 1: Core wireframes (critical path)

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `consultation-list.pen` | 01 | Medium | List page with grid, toolbar, filter panel, export template dialog |
| W2 | `consultation-details-header.pen` | 02 | High | Details dialog scaffold: header row, tab bar, content area, buttonset |
| W3 | `consultation-details-standard.pen` | 03 | High | Standard form with 7 blocks, 6 collections (incl. nested prescriptions) |
| W7 | `consultation-view.pen` | 07 | High | Read-only view with 8 sections, type-conditional content |

### Phase 2: Type-specific forms

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W4 | `consultation-details-onboarding.pen` | 04 | Medium | Full onboarding form (50 elements), annotate short-form differences |
| W5 | `consultation-details-incarceration.pen` | 05 | Medium-High | Incarceration form (51 elements, 6 blocks), siren annotations |
| W6 | `consultation-details-treatment-warning.pen` | 06 | Medium | Treatment textareas + warning category CRUD |

### Phase 3: Supporting wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W8 | `consultation-review.pen` | 07 | Low-Medium | Review dialog: 2-column layout, markdown editor, review buttons |
| W9 | `consultation-icd10-search.pen` | 02, 03 | Low | ICD-10 search modal with results list |
| W10 | `consultation-export-template.pen` | 01 | Low | Export template modal with filters |

## Execution Steps

For each wireframe:

1. **Read** the corresponding analysis document(s)
2. **Open** Pencil: `open_document("specs/wireframes/consultation/{name}.pen")`
3. **Get guidelines**: `get_guidelines(topic="web-app")` (first wireframe only)
4. **Get style guide**: Use tags from `get_style_guide_tags` (first wireframe only)
5. **Design** using `batch_design()`:
   - Create frame with appropriate dimensions (desktop 1440px width)
   - Add section headings, form elements, buttons per the spec tables
   - Annotate datamodel paths, permissions, conditions
   - Mark `[HARDCODED]` strings, `[RO]` read-only fields, `*` required fields
   - Mark `[SIREN]` for siren animation fields
   - Show collection rows with `[repeats]` annotation
6. **Validate** with `get_screenshot()` — check layout, spacing, completeness
7. **Iterate** as needed
8. **Export** to PNG: `export_nodes()` to `specs/wireframes/consultation/`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key created |
| `[repeats]` | Collection row template |
| `[PERM: NAME]` | Permission-gated region |
| `[SIREN]` | Siren flash animation |
| `[cond: expr]` | Conditionize2 conditional visibility |
| `[type: X]` | Only shown for consultation type X |
| `data.field.path` | Datamodel binding annotation |
