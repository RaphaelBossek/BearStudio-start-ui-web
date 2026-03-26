# Wireframe Creation Plan — Profile Module (Expanded)

> Target directory: `specs/wireframes/user-management/profile/`
> Workflows: `specs/wireframes/user-management/workflows.md`

## Prerequisites

1. All 4 analysis documents in `specs/analysis/user-management/profile/` are reviewed
2. Data dictionary: `specs/analysis/user-management/data-dictionary-user-management.md`
3. Pencil MCP server available
4. Design system reference from Batch 1 (variables, fonts, dialog conventions)

## Findings that Affect Wireframes

### Layout complexity

- **User profile form** is 1014 lines with 8 tabs, 60+ fields -- the most field-dense form after consultation. Wireframe must show tab structure with representative fields per section.
- **Staff list** has A-Z quickFilter + 10-column grid + inline profile detail -- three visual layers.
- **Expert search dialog** has two insert-and-delete collections (skills, exclusion criteria) plus results table with nested collections.
- **Expert availability grids** have day x slot cell interaction -- need specialized wireframing.

### Permission gating

- Profile form has 4 employee-visible tabs + 4 admin-only tabs
- Multiple inline sections gated by `isAdmin` within visible tabs
- Staff list toolbar has 9 buttons with various enable/disable states

---

## Shadcn Component Mapping

| Legacy UI Pattern | Shadcn Component | Notes |
|:---|:---|:---|
| Bootstrap Nav Tabs (8 icon-only tabs) | `@shadcn/tabs` | Vertical tab list with icons + labels |
| Text inputs (60+ fields) | `@shadcn/input` + `@shadcn/label` | With form validation via react-hook-form |
| Select dropdowns (salutation, state, type) | `@shadcn/select` | Enum-driven options |
| Checkbox (single boolean) | `@shadcn/checkbox` | notificationPerMail, requireTotp, mailInvoice |
| Checkbox list (20 notification events) | `@shadcn/checkbox` (grid) | 4-column checkbox matrix |
| Date inputs | `@shadcn/input` type="date" or `@shadcn/calendar` + `@shadcn/popover` | DatePicker pattern |
| File upload (profile picture, cert, doc) | `@shadcn/button` + hidden `<input type="file">` | Custom FileUpload component |
| Textarea (inactive reason, descriptions) | `@shadcn/textarea` | Standard textarea |
| Password with show/hide toggle | `@shadcn/input` + eye icon `@shadcn/button` | Toggle visibility |
| Progress bar (password strength) | `@shadcn/progress` | Dynamic color: danger -> success |
| Autocomplete (skills, products, countries) | `@shadcn/command` + `@shadcn/popover` | Combobox pattern |
| Collection repeater (addresses, skills, products) | Custom repeater with `@shadcn/button` add/delete | Inline CRUD rows |
| SlickGrid (10-column staff list) | `@shadcn/table` + TanStack Table | Sortable columns, row selection |
| A-Z QuickFilter | Custom alpha-bar component | Letter buttons + search input |
| Modal dialog (password, signature, assignment) | `@shadcn/dialog` | Controlled open state |
| Side panel (filter panel) | `@shadcn/sheet` | Right-side slide overlay |
| Inline detail panel (staff list) | `@shadcn/sheet` or `ResizablePanel` | Inline expand on row select |
| Canvas signature pad | SignaturePad library + `@shadcn/dialog` | External lib with React ref |
| Tri-state toggle (null/true/false) | Custom `TriStateButton` component | Circle -> Check -> X cycle |
| Binary toggle (null/true) | Custom `BinaryToggle` component | X -> Check cycle |
| Availability grid (month: 31 rows x 6 cols) | Custom `AvailabilityGrid` component | `@shadcn/table` base |
| Availability grid (week: 24 rows x 7 cols) | Custom `WeekGrid` component | `@shadcn/table` base |
| Bootstrap alert | `@shadcn/alert` | Info, warning, danger variants |
| Tooltip (tab icons) | `@shadcn/tooltip` | Tab label on hover |
| Confirm dialog (accept/reject) | `@shadcn/alert-dialog` | Destructive action confirmation |
| Toast notifications (save success/error) | `@shadcn/sonner` | Replace alert() calls |

---

## Wireframe Inventory

### Phase 1: Core wireframes

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `profile-form.pen` | 01-profile-form.md | High | Shared profile form: 8 tabs (4 employee + 4 admin), role-gated sections, 60+ fields, skill checkboxes, collections. Show 2 representative tabs in detail + tab bar overview. |
| W2 | `profile-staff-list.pen` | 02-profile-staff.md | High | Staff list: A-Z quickFilter, 10-column grid with formatters, inline detail panel, filter panel, 9 toolbar buttons with enable/disable states |

### Phase 2: Dialogs and specialized views

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W3 | `profile-expert-search.pen` | 02-profile-staff.md | Medium | Expert search dialog: job autocomplete filter, skills collection (insert+delete), exclusion criteria collection, results table with nested skill/criteria display, qualification level |
| W4 | `profile-assignment-dialog.pen` | 02-profile-staff.md | Medium | Assignment requests dialog: year/month filter, user display name, appointment list collection with type/status/time, accept/reject action buttons per row, export icon |
| W5 | `profile-password-dialog.pen` | 03-profile-dialogs.md | Low | Password change dialog: 3 password fields with show/hide toggle, progress bar strength meter, 4 validation rules with real-time icons, submit/cancel buttons |
| W6 | `profile-signature-pad.pen` | 03-profile-dialogs.md | Low | Signature pad dialog: HTML5 canvas area with decorative signing line, Sign + Clear buttons, hint text for dimensions |
| W7 | `profile-expert-availability.pen` | 04-profile-expert-availability.md | Medium-High | Month grid (31 rows x 6 slot columns with tri-state cells, summary counters, appointment overlay icons) + Week grid (24 rows x 7 day columns with binary cells). Show both grids. |

---

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only |
| `[PERM: EMPLOYEE]` | Visible to EMPLOYEE authority |
| `[PERM: ADMIN]` | Visible to ADMIN only |
| `[PERM: USERS_UPDATE]` | Visible to USERS_UPDATE authority |
| `[repeats]` | Collection row (repeater) |
| `[checkbox-grid]` | Skill/notification checkbox matrix |
| `[tri-state]` | null -> true -> false -> null cycle |
| `[binary]` | null -> true -> null cycle |
| `[HARDCODED]` | Needs i18n key |
| `[async: debounce]` | Autocomplete with debounced query |
| `[cond: isAdmin]` | Conditional visibility based on admin role |
| `[cond: isAnEmployee]` | Conditional mandatory based on employee status |
| `@shadcn/component` | Target Shadcn UI component |
| `data.path.field` | Data model binding |

---

## Execution Steps

### Step 1: Load design system

```
pencil_get_guidelines(topic="design-system")
Shadcn_list_items_in_registries(["@shadcn"])
```

### Step 2: Study reference template

```
pencil_batch_get(filePath="specs/wireframes/interfaces/dashboard/basisweb-wizard.pen", nodeIds=["QMGzX"], readDepth=3)
```

### Step 3: Create wireframes in order

1. **W1 profile-form.pen** (High priority -- core form)
   - Frame 1: Tab bar overview (8 tabs with icons, permission badges)
   - Frame 2: Personal Data tab (employee view) -- profile picture card + personal fields + securebox
   - Frame 3: Personal Data tab (admin view) -- adds notification exclusions checkbox grid
   - Frame 4: Business Data tab (2-column layout, admin sections highlighted)
   - Frame 5: Address tab (primary + additional addresses collection)
   - Frame 6: Education tab (skills autocomplete + collection, exclusion criteria)
   - Frame 7: Documents tab (admin only -- file table with upload)
   - Frame 8: Products tab (admin only -- product collection with totals)

2. **W2 profile-staff-list.pen**
   - Frame 1: Full page view -- A-Z bar, toolbar, 10-col grid
   - Frame 2: Inline detail panel open (profile form embedded)
   - Frame 3: Filter panel (sheet, right side)

3. **W3-W7** in Phase 2 order

### Step 4: Export and document

```
pencil_export_nodes() -> PNG files
```

Embed screenshots into `specs/wireframes/user-management/workflows.md` with headings and descriptions.

---

## Dependency Notes

- W1 (profile form) is the core component used by W2 (staff list inline detail)
- W7 (expert availability) is also used in the Planning dashboard (Batch 4) -- already wireframed there as `planning/dashboard/expert-availability.pen`. The profile version is the same grid but embedded in the profile form's admin tabs.
- W5 (password dialog) is included in both personal profile page and staff page
- W6 (signature pad) is included in both personal profile page and staff page
