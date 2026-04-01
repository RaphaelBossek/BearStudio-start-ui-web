# Wireframe Creation Plan — Customer Domain

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools with Shadcn registry components.
> Target directory: `specs/wireframes/customer/`

## Prerequisites

1. All analysis documents in `specs/analysis/customer/` are complete and reviewed:
   - `specs/analysis/customers/` — Customer list + detail analysis
   - `specs/analysis/customers/` — Location management analysis
   - `specs/analysis/customer/contact/` — Contact management analysis
   - `specs/analysis/customers/` — Room management analysis
   - `specs/analysis/customers/` — Equipment management analysis
2. Data dictionary `specs/analysis/customer/data-dictionary-customer.md` is complete
3. Pencil MCP server is available and responsive
4. Review the Pencil style guide for design systems: `get_guidelines(topic="design-system")`
5. Enumerate available Shadcn components: `get_project_registries()` then `list_items_in_registries(["@shadcn"])`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN) under `~/src/vc/videoclinic-prod/web/src/main/resources/`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Shadcn Component Mapping

| Legacy UI Element               | Shadcn Component                        | Notes                                                                 |
| :------------------------------ | :-------------------------------------- | :-------------------------------------------------------------------- |
| SlickerGrid                     | `@shadcn/table` + DataTable             | All list views (W1–W5)                                                |
| Detail drawer (900px)           | `@shadcn/sheet` or `@shadcn/dialog`     | All detail dialogs; 900px width                                       |
| Tab navigation                  | `@shadcn/tabs`                          | 2–4 tabs per detail view                                              |
| Object autocomplete             | `@shadcn/combobox`                      | Location, customer, company, skill, equipment, job, product           |
| Zip code autocomplete           | `@shadcn/combobox` + auto-fill          | Auto-populates city/state/country via ZipCodeService                  |
| A-Z Quick Filter                | Custom component                        | Contact only (W3): letter buttons + range groupings (A-C, D-F, etc.) |
| Collection tables               | `@shadcn/table` inline                  | Price lists, discounts, SIP accounts, rooms, equipment, plans         |
| Checkbox / switch               | `@shadcn/switch`                        | Available, active, notification toggles                               |
| Enum selects                    | `@shadcn/select`                        | PatientDataType, MedicationType, EquipmentStatus, Role                |
| Cascading filter                | Controlled `@shadcn/combobox`           | Equipment (W5): Location -> Room dependency                           |
| Filter panel (offcanvas)        | `@shadcn/sheet`                         | Location (W2), Contact (W3), Equipment (W5) filters                   |
| FullCalendar                    | `@fullcalendar/react`                   | Room planning (W4): month/week/day views with slots + appointments    |
| Room plan sub-dialog            | `@shadcn/dialog` (secondary)            | Weekday checkboxes, time pickers, nested inside Room detail           |
| Tag-it multi-tag                | Custom tag input                        | Contact categories (W3)                                               |
| QR code display                 | QR library (`qrcode.react`)             | Contact detail (W3)                                                   |
| Map component                   | Leaflet + Mapbox tiles                  | Location geocoding + reverse geocoding (W2)                           |
| File upload / import            | `@shadcn/input[type=file]` + dialog     | Contact import with force-update checkbox (W3)                        |
| Conditional field visibility    | React conditional rendering             | patientDataType -> preconfigured SFTP/connection fields (W2)          |
| Color picker (calendar)         | CSS class / color prop                  | Appointment state colors in room calendar (W4)                        |
| Toolbar (Add/Edit/Delete)       | `@shadcn/button` group                  | Standard toolbar across all list views                                |
| Info/warning alerts             | `@shadcn/alert`                         | Validation messages, connection test results (W2)                     |
| Date/time pickers               | `@shadcn/date-picker` / time input      | Room plan start/end time, equipment dates (W4, W5)                    |
| Textarea                        | `@shadcn/textarea`                      | Description fields, comments (W1, W4, W5)                             |

## Findings from Analysis that Affect Wireframes

### Conditional Visibility — Location Detail (W2)

- **`patientDataType` enum controls field visibility** in Location Tab 1: When the location type is set to a preconfigured value (e.g., SFTP, HL7), additional connection-specific fields (host, port, path, credentials) become visible. Wireframe annotates these fields with `[cond: patientDataType == PRECONFIGURED]`.
- **checkConnection / testUpload / backupTest buttons** appear contextually based on patientDataType selection. Annotate with `[cond: patientDataType]`.

### Cascading Filters — Equipment (W5)

- **Location -> Room dependency**: The Room combobox is disabled/locked until a Location is selected. Once a Location is chosen, Room options are filtered to only rooms belonging to that location. Wireframe annotates with `[cascade: location -> room]`.
- This pattern applies in both the **filter panel** and the **detail dialog** (Tab 1).

### A-Z Quick Filter — Contact (W3)

- A **unique UI component** not found elsewhere in the application: a horizontal bar of letter buttons (A, B, C, ... Z) plus grouped ranges. Clicking a letter filters the contact grid by last name initial.
- Must be wireframed as a custom component above the grid. Annotate with `[custom: AZFilterBar]`.

### Collection Tables (Inline Editing)

- **Customer billing tab** (W1, Tab 3): Two inline collection tables — price lists (with JobPriceListService autocomplete) and discounts (with job select). Admin-only visibility: `[cond: role == ADMIN]`.
- **Location SIP accounts** (W2, Tab 1): Inline collection for SIP account entries.
- **Room equipment** (W4, Tab 3): Autocomplete insert row + equipment collection table.
- **Room plans** (W4, Tab 2): Plan list sidebar with CRUD operations + sub-dialog for plan details.
- All collection tables use `[repeats]` annotation for row templates.

### Map Integration — Location (W2)

- **Tab 2 (Address)** includes a Leaflet/Mapbox map component displaying location coordinates.
- Lat/Lng fields support **reverse geocoding**: entering an address auto-fills coordinates, and placing a pin on the map auto-fills the address.
- Wireframe annotates with `[integration: Leaflet/Mapbox]` and `[async: reverseGeocode]`.

### Calendar Integration — Room (W4)

- **Tab 2 (Planning)** embeds a FullCalendar component with month/week/day view switcher.
- Room availability slots are displayed as foreground events; appointment background events provide context.
- A plan list sidebar allows selecting which plan's slots are shown.
- Wireframe annotates calendar with `[integration: @fullcalendar/react]`.

### Import Dialog — Contact (W3)

- A secondary dialog for CSV/file import with a **force-update checkbox** that controls whether existing contacts are overwritten.
- Additional actions: **Download export** button and **Send Password** button in the toolbar area.

### Comments / Status Change Pattern — Equipment (W5)

- **Tab 2** implements a status-change-via-comment pattern: selecting a new status + entering a comment + clicking save creates a timestamped status change record.
- The comments collection displays user, timestamp, old/new status, and comment text.
- Status field in Tab 1 is `[RO]` — only changeable through the Tab 2 workflow.

### Admin-Only Sections

- **Customer billing tab** (W1, Tab 3): Entire tab is visible only to admin users. Annotate with `[cond: role == ADMIN]`.

### Auto-Fill Patterns

- **Zip code -> city/state/country** (W1 Tab 2, W2 Tab 2, W3 Tabs 2-3): ZipCodeService lookup auto-populates related address fields. Annotate with `[autofill: ZipCodeService]`.
- **Location autocomplete -> cascading room list** (W5): Selecting a location auto-populates the available room options. Annotate with `[cascade: location -> room]`.

## Wireframe Inventory

Five `.pen` files covering the full Customer domain:

| #  | Frame                                           | Content                                                                                                    | Complexity  |
| :- | :---------------------------------------------- | :--------------------------------------------------------------------------------------------------------- | :---------- |
| W1 | `customer/customer-core/customer-list.pen`      | Customer list (7-col grid) + 3-tab detail dialog (contact, address with zip auto-fill, admin-only billing with price list + discount collections). Standard Add/Edit/Delete toolbar. No filter panel. | Medium      |
| W2 | `customer/customer-core/location-management.pen`| Location list (12-col grid with formatters) + filter panel (name, address, phone) + 3-tab detail dialog (~31 fields: location type autocomplete, conditional SFTP/connection fields, SIP accounts collection, banking, medical contact) + address tab with Leaflet/Mapbox map + rooms read-only tab. checkConnection/testUpload/backupTest action buttons. | High        |
| W3 | `customer/contact/contact-management.pen`       | A-Z quick filter bar + contact list (13-col grid) + offcanvas filter panel (name, email, max results) + 4-tab detail dialog (contact info with categories multi-tag + QR code, private address, work address, custom fields + notes). Import dialog with force-update. Download export + Send Password actions. | Medium-High |
| W4 | `customer/room/room-management.pen`             | Room list (5-col grid with client-side search) + 3-tab detail dialog (room info with location autocomplete + available toggle, planning tab with FullCalendar month/week/day + plan list sidebar + Room Plan sub-dialog with weekday checkboxes + time pickers, equipment tab with autocomplete insert + collection table). | High        |
| W5 | `customer/equipment/equipment-management.pen`   | Equipment list (9-col grid with status formatter) + offcanvas filter panel with cascading Location->Room filters + 2-tab detail dialog (15 equipment fields with cascading location->room autocompletes, comments/status change tab with status select + comment + timestamped history collection). | Medium      |

Target directory: `specs/wireframes/customer/`
Exported PNGs: `specs/wireframes/customer/<subfolder>/W*-*.png`

## Annotation Legend

| Annotation                  | Meaning                                                    |
| :-------------------------- | :--------------------------------------------------------- |
| `*`                         | Required field                                             |
| `[RO]`                      | Read-only field                                            |
| `[HARDCODED]`               | Needs i18n key created                                     |
| `[repeats]`                 | Collection row template                                    |
| `[cond: expr]`              | Dynamic visibility condition                               |
| `[cascade: a -> b]`         | Cascading dependency between fields                        |
| `[autofill: ServiceName]`   | Auto-fill from service lookup (e.g., ZipCodeService)       |
| `[async: operation]`        | Async operation (reverse geocode, connection test, etc.)   |
| `[integration: lib]`        | Third-party integration (FullCalendar, Leaflet, QR, etc.) |
| `[custom: ComponentName]`   | Custom component not from Shadcn registry                  |
| `[admin-only]`              | Visible only to admin role                                 |
| `data.field.path`           | Datamodel binding annotation                               |
| `@shadcn/component`         | Shadcn component mapping reference                         |
| `Tab N: Label`              | Tab identification within detail dialog                    |
| `900px`                     | Dialog width specification                                 |

---

## Wireframe Screenshots

See [`specs/wireframes/customer/workflows.md`](../../wireframes/customer/workflows.md#wireframe-screenshots) — screenshots are embedded alongside the workflow diagrams for a unified reference.
