# Wireframe Creation Plan — Accounting Domain

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools with Shadcn registry components.
> Target directory: `specs/wireframes/accounting/`

## Prerequisites

1. All analysis documents in `specs/analysis/accounting/` are complete and reviewed:
   - `specs/analysis/customers/` — Invoice List + Invoice Details analysis
   - `specs/analysis/accounting/worklog/` — Worklog list + weekly assignments matrix analysis
   - `specs/analysis/customers/` — Invoice Receiver CRUD analysis
   - `specs/analysis/administration/` — Job Configuration analysis
   - `specs/analysis/administration/` — Accounting Config modules analysis (storno groups, price lists, products, closed months, expert work monthly)
   - `specs/analysis/system-admin/` — Admin work hour analysis
2. Data dictionary `specs/analysis/accounting/data-dictionary-accounting.md` is complete
3. Pencil MCP server is available and responsive
4. Review the Pencil style guide for design systems: `get_guidelines(topic="design-system")`
5. Enumerate available Shadcn components: `get_project_registries()` then `list_items_in_registries(["@shadcn"])`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN) under `~/src/vc/videoclinic-prod/web/src/main/resources/`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Shadcn Component Mapping

| Legacy Element | Shadcn Component | Notes |
|:--|:--|:--|
| SlickerGrid (data table) | `@shadcn/table` + DataTable pattern | All list views: invoice list, worklog list, job config grid, invoice receiver grid |
| Month/Year selector | `@shadcn/select` + `@shadcn/input` | Invoice list, worklog, expert work monthly filters — dropdown for month, input for year |
| Detail drawer/offcanvas (1100px) | `@shadcn/sheet` or `@shadcn/dialog` | Invoice details drawer (1100px wide) |
| Detail dialog (1200px) | `@shadcn/dialog` | Job configuration detail dialog (1200px wide) |
| Inline collection (positions, products, storno rules, prices, skills, on-call numbers) | `@shadcn/table` inline editing | Repeatable sub-forms with add/delete/sort row actions |
| Autocomplete inputs | `@shadcn/combobox` pattern | Product, customer, location, skill, template, expert lookups |
| Tax type / enum selects | `@shadcn/select` | Tax type, invoice type, consultation type, product type, price list type, storno group |
| Checkbox switches | `@shadcn/switch` | Active toggle, mail/post invoice, flat-rate toggles, worklog export config |
| Price points input | Custom component | Opens sub-dialog for dated price collection (price point dialog) |
| Color picker | `@shadcn/input` + color preview swatch | Job configuration color field |
| File upload | `@shadcn/input[type=file]` + custom drop zone | Invoice attachments, thumbnail upload |
| Currency input | `@shadcn/input` with formatting | Net price, adjusted price, totals — formatted with €, 2 decimal places |
| Percent input | `@shadcn/input` with % suffix | Skonto, discount, storno percentage |
| Human time input | Custom component | Work time display/input (hours:minutes) |
| Tab navigation | `@shadcn/tabs` | Invoice receiver (2 tabs), job config (2 tabs) |
| Filter panel (offcanvas) | `@shadcn/sheet` | Invoice receiver filter, job config filter — side panel with active toggle + max results |
| Async job polling dialog | `@shadcn/dialog` + progress indicator | ZIP download, template export, XLS export status with polling |
| Email dialog | `@shadcn/dialog` | Send invoice email — recipient, subject, body, attachment toggles |
| Print preview | `@shadcn/dialog` (full-width) | Invoice print preview with PDF download/email/paid/storno/remove actions |
| Toolbar buttons | `@shadcn/button` | 12 toolbar actions on invoice list, worklog actions, invoice receiver actions |
| Alert/info banners | `@shadcn/alert` | Validation messages, price list warnings, billing section warnings |
| Badge/status indicator | `@shadcn/badge` | Invoice status, job status, export status |
| Tooltip | `@shadcn/tooltip` | Toolbar button descriptions, field help text |
| Separator | `@shadcn/separator` | Section dividers in detail forms |
| Scroll area | `@shadcn/scroll-area` | Long detail forms, collection tables within drawers |
| Skeleton loader | `@shadcn/skeleton` | Loading states for grids and detail panels |
| Date picker | `@shadcn/calendar` + `@shadcn/popover` | Invoice date, period dates, milestone dates, closed month dates |
| Dropdown menu | `@shadcn/dropdown-menu` | Row-level context actions, multi-action toolbar overflow |

## Findings from Analysis that Affect Wireframes

### Shared Patterns Across Accounting Views

- **Month/Year filter toolbar**: Reused across Invoice List (W1), Worklog (W3), and Expert Work Monthly (W6). Wireframe should establish a consistent filter bar component with `@shadcn/select` for month + `@shadcn/input` for year + navigation arrows.
- **SlickerGrid → DataTable migration**: All list views use the legacy SlickerGrid. Wireframes standardize on the `@shadcn/table` DataTable pattern with column sorting, row selection, and pagination. Annotate with `[DataTable]`.
- **Inline collection editing**: Multiple views use repeatable row collections (invoice positions, product orders, storno rules, prices, skills, on-call numbers). Wireframe establishes a single inline-edit table pattern with add/delete/sort row actions. Annotate with `[repeats]`.

### Conditional Visibility Rules

- **Invoice Receiver — Customer/Location mutual exclusion** (W4, Tab 1): Selecting a customer clears the location field and vice versa. Address fields auto-fill from the selected entity. Annotate with `[cond: customer↔location mutex]`.
- **Job Configuration — Type-conditional sections** (W5, Tab 2):
  - **Shift type**: Shows 4-period × 6-tier pricing matrix with price points sub-dialog. Annotate with `[cond: type=SHIFT]`.
  - **Appointment type**: Shows hourly rates with rounding + storno configuration. Annotate with `[cond: type=APPOINTMENT]`.
  - **Council type**: Shows per-patient pricing + support hourly + rounding. Annotate with `[cond: type=COUNCIL]`.
- **Job Configuration — Billing section** (W5, Tab 1): Billing fields only visible when billing is enabled. Annotate with `[cond: billing.enabled]`.
- **Invoice Details — Storno dialog** (W2): Only available when invoice is not already storno'd. Annotate with `[cond: !invoice.storno]`.
- **Expert Work Monthly — Role-gated visibility** (W6): Certain actions (regenerate, send, download, export ZIP) only visible for admin/accounting roles. Annotate with `[cond: role=ADMIN|ACCOUNTING]`.

### Async / Polling States

- **Invoice List — Job Status dialog** (W1): Template export, multi-template export, and ZIP download trigger background jobs. A polling dialog checks job status at intervals until completion. Wireframe annotates with `[async: poll job status]`.
- **Expert Work Monthly — Export status dialog** (W6): ZIP export and send operations trigger async processing with progress polling. Annotate with `[async: poll export status]`.
- **Invoice Details — Print preview generation** (W2): PDF generation may be async. Annotate with `[async: PDF generation]`.

### Auto-Calculation / Derived Fields

- **Invoice positions** (W2): `total = netPrice × amount + tax`. Totals section auto-recalculates from all position rows. Annotate computed fields with `[calc: netPrice × amount + tax]`.
- **Product order totals** (W4): `total = adjustedPrice × amount`. Annotate with `[calc: adjustedPrice × amount]`.
- **Shift pricing matrix** (W5): 4 periods × 6 tiers = 24 price cells. Each cell value may come from a price points history. Annotate with `[matrix: 4×6]`.

### Multi-Entity Patterns

- **Invoice Details — Multi-invoice switch** (W2): User can navigate between invoices within the drawer without closing it. Annotate with `[multi-entity: invoice switch]`.
- **Invoice Receiver — Create invoice / Create all invoices** (W4): Bulk operations that create invoices for one or all receivers. Annotate with `[bulk: create invoices]`.
- **Closed Months — Batch generation** (W6): Months are batch-generated, no manual add/delete. Annotate with `[batch: generated records]`.

### Component Quirks

- **Worklog weekly assignments matrix** (W3): 21 columns = 7 days × 3 shifts (morning/afternoon/night) per expert row. This is a specialized grid that does not fit standard DataTable patterns. Wireframe uses a custom matrix layout. Annotate with `[matrix: 7d×3shifts]`.
- **Invoice Receiver — 35 payment contact fields** (W4, Tab 1): Exceptionally large form requiring logical grouping into sections (customer/location, address, contact, payment terms, storno, tax, banking, worklog config). Wireframe uses `@shadcn/separator` + section headers.
- **Job Configuration — Nested skill rules** (W5): Skills collection contains nested skill rule sub-collections. Wireframe represents as expandable rows or nested table. Annotate with `[nested: skill → rules]`.
- **Accounting Config — 5 sub-modules in one wireframe** (W6): Frame should use tab or accordion navigation to organize the 5 config CRUDs. Wireframe uses `@shadcn/tabs` at top level.
- **Worklog — Duplicate field bindings** (W3): Legacy code has duplicate field bindings in the monthly list. Wireframe should consolidate to canonical bindings per data dictionary.

## Wireframe Inventory

6 `.pen` files organized by sub-domain:

| # | Frame | Target File | Content | Complexity |
|:--|:------|:------------|:--------|:-----------|
| W1 | Invoice List | `specs/wireframes/administration/invoice-list.pen` | Invoice list with month/year filter toolbar, 11-column DataTable, 12 toolbar action buttons, 4 dialogs: Export Invoice (period selector), Template Export, Multi-Template Export, Job Status (async polling progress) | High |
| W2 | Invoice Details | `specs/wireframes/administration/invoice-details.pen` | Invoice detail drawer (1100px), 4-column header layout (client info, title/description, invoice date/skonto, submission date/period), positions collection table with inline add/delete/sort and auto-recalculation, totals section, attachments with upload, print preview dialog with PDF download/email/paid/storno/remove actions, email dialog, create invoice dialog, storno dialog, appointment work log secondary dialog, multi-invoice switch | Very High |
| W3 | Worklog | `specs/wireframes/administration/worklog.pen` | Monthly worklog list with month/year filter toolbar, 8-column DataTable + 21-column weekly assignments matrix grid (expert × day-of-week × shift: morning/afternoon/night) | Medium |
| W4 | Invoice Receiver | `specs/wireframes/administration/invoice-receiver.pen` | List view with filter panel (active toggle + max results), 2-tab detail form — Tab 1: Payment Contact (35 fields grouped into sections: customer/location mutual exclusion + address auto-fill + contact info + payment terms + storno groups + tax + banking + worklog export config collection), Tab 2: Product Order (5 flat-rate toggles + product collection table with amount/product/dates/description/price/adjusted price/total/delete/sort), actions: create invoice, create all invoices, export XLS | High |
| W5 | Job Configuration | `specs/wireframes/administration/job-configuration.pen` | List view with 8-column DataTable + filter panel, 2-tab detail dialog (1200px) — Tab 1: Info (general fields, consultation type checkboxes, billing section with conditional visibility, skills collection with nested skill rules, on-call numbers collection), Tab 2: Times/Pricing (type-conditional: Shift pricing matrix 4-periods×6-tiers with pricePoints sub-dialog, Appointment hourly rates with rounding + storno, Council per-patient pricing + support hourly + rounding), sub-dialogs: Price Point Dialog (collection of dated prices), Skill Select Dialog (autocomplete) | Very High |
| W6 | Accounting Config | `specs/wireframes/administration/accounting-config.pen` | 5 config CRUD modules as top-level tabs: (1) Storno Groups — master list + detail with nested storno rules collection, (2) Job Price Lists — master list + detail with nested prices collection and conditional fields by job type, (3) Products — 8 fields with 2 enum selects, (4) Closed Months — batch-generated list with 3 date milestones (no add/delete), (5) Expert Work Monthly — role-gated visibility, year/month filter, nested worklog collection, regenerate/send/download/export ZIP actions, export status dialog with progress polling | High |

### Exported Artifacts per Wireframe

Each `.pen` file produces:
- Exported PNGs for each major state/frame (e.g., `invoice-list.png`, `invoice-list-export-dialog.png`)
- PNG naming convention: `{view-name}[-{state}].png` in the same directory as the `.pen` file

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only / computed field |
| `[HARDCODED]` | Needs i18n key created (hardcoded German string found in legacy) |
| `[repeats]` | Collection row template (inline add/delete/sort) |
| `[cond: expr]` | Dynamic visibility condition |
| `[async: description]` | Async operation / polling state |
| `[calc: formula]` | Auto-calculated / derived field |
| `[matrix: dims]` | Grid/matrix layout with specified dimensions |
| `[multi-entity: type]` | Multi-entity navigation within same view |
| `[bulk: action]` | Bulk operation affecting multiple records |
| `[batch: description]` | Batch-generated records (no manual CRUD) |
| `[nested: parent → child]` | Nested sub-collection within a collection |
| `[DataTable]` | Migrated from SlickerGrid to Shadcn DataTable pattern |
| `data.field.path` | Datamodel binding annotation (per data dictionary) |
| `@shadcn/component` | Shadcn component mapping reference |

## Dialog & Sub-Dialog Inventory

Dialogs are annotated within their parent wireframe. This cross-reference lists all dialogs across the domain:

| Parent Wireframe | Dialog | Trigger | Content |
|:--|:--|:--|:--|
| W1 Invoice List | Export Invoice Dialog | Toolbar "Export" button | Period selector (from/to month/year), format options |
| W1 Invoice List | Template Export Dialog | Toolbar "Template Export" button | Template selector, export options |
| W1 Invoice List | Multi-Template Export Dialog | Toolbar "Multi-Template Export" button | Multiple template selection, batch export |
| W1 Invoice List | Job Status Dialog | Triggered after async export | `[async: poll job status]` — progress bar, status text, cancel/close |
| W2 Invoice Details | Print Preview Dialog | "Print" action button | Full-width dialog with PDF preview iframe + action bar: download PDF, email, mark paid, storno, remove |
| W2 Invoice Details | Email Dialog | "Email" action button or print preview "Email" | Recipient, subject, body, attachment toggles, send/cancel |
| W2 Invoice Details | Create Invoice Dialog | "Create Invoice" action | Invoice creation form with pre-filled receiver data |
| W2 Invoice Details | Storno Dialog | "Storno" action `[cond: !invoice.storno]` | Confirmation with storno reason, percentage input |
| W2 Invoice Details | Appointment Work Log Dialog | Secondary action | Work log entries for linked appointment |
| W5 Job Configuration | Price Point Dialog | Click on price cell in shift matrix | Collection of dated prices: date, price, add/delete rows |
| W5 Job Configuration | Skill Select Dialog | "Add Skill" in skills collection | Autocomplete search for skill, confirm selection |
| W6 Accounting Config | Export Status Dialog | After ZIP export / send in Expert Work Monthly | `[async: poll export status]` — progress indicator, status, file count, close |

---

## Wireframe Execution Order

Recommended creation order based on complexity and dependency:

1. **W3 — Worklog** (Medium) — Establishes month/year filter pattern and matrix grid pattern
2. **W1 — Invoice List** (High) — Reuses month/year filter, establishes toolbar pattern and async dialog pattern
3. **W4 — Invoice Receiver** (High) — Establishes large form pattern, filter panel, inline collection editing
4. **W6 — Accounting Config** (High) — Establishes multi-module tab layout, nested collection patterns
5. **W2 — Invoice Details** (Very High) — Reuses inline collection from W4, drawer pattern, multi-dialog composition
6. **W5 — Job Configuration** (Very High) — Most complex: type-conditional sections, nested collections, pricing matrix, multiple sub-dialogs

---

## Wireframe Screenshots

See [`specs/wireframes/accounting/workflows.md`](../../wireframes/accounting/workflows.md#wireframe-screenshots) — screenshots are embedded alongside the workflow diagrams for a unified reference.
