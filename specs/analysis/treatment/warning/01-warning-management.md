# Warning / Allergy Management -- Legacy Analysis

> **Source**: `webapp/warning/index.htmlm` (87 lines), `webapp/warning/index.js` (71 lines), `webapp/warning/messages.i18n.js` (45 lines)
> **Pattern**: Standard `tableView` + `grid` + `detail` CRUD
> **Backend service**: `WarningService` (methods: `get`, `getAll`)
> **Data limit**: 100 rows (client-side `data-limit="100"`)

---

## 1. Page Header / Toolbar

| HTMLM Variable | Value |
|---|---|
| `usePanel` | `true` |
| `navBar` | Template `../_include/navbar.mustache` |
| `search` | `true` (enables `#siteSearch` input for client-side filtering) |

---

## 2. Toolbar Actions

| Action ID | Icon | Label (i18n key) | English | German | Initial State | Notes |
|---|---|---|---|---|---|---|
| `addMenuBtn` | `plus-square` | `action.add` | Add | Neu | Enabled | Opens detail dialog in create mode |
| `editMenuBtn` | `pencil` | `action.change` | Change | Editieren | Disabled | Enabled on row selection |
| `deleteMenuBtn` | `trash` | `action.delete` | Delete | Loeschen | Disabled | Enabled on row selection |
| `someActionBtn` | `lock-alt` | `"Action"` (HARDCODED) | Action | Action | Disabled | **Dead code** -- no handler bound in `index.js`, placeholder only. Has a spacer before it. |

---

## 3. Grid Columns

| # | Field | Name (i18n key) | English | German | Sortable | Resizable | Width | Formatter |
|---|---|---|---|---|---|---|---|---|
| 1 | `id` | `label.id` | ID | ID | Yes | Yes | auto | -- |
| 2 | `name` | `label.name` | Name | Name | Yes | Yes | 180 | -- |
| 3 | `type` | `WarningType` | Warning Type | Warnung | Yes | Yes | 180 | `Formatter.warningType` (enum lookup) |
| 4 | `entryRequirement` | `warning.entryRequirement` | Entry Requirement | Nur bei langer Zugangsuntersuchung angezeigt | Yes | Yes | 180 | `Formatter.bool` |
| 5 | `documentationRequirement` | `warning.documentationRequirement` | Documentation Requirement | Kommentar verpflichtend | Yes | Yes | 180 | `Formatter.bool` |
| 6 | `description` | `label.description` | Description | Beschreibung | Yes | Yes | 180 | -- |

### Client-Side Search / Filter

The grid implements a client-side full-text filter on `name` and `type` (resolved via `i18n["WarningType_" + item.type]`). The `#siteSearch` input triggers filtering on `keyup`/`change`, with `Escape` clearing the search.

---

## 4. Detail Dialog (Create / Edit)

Dialog metadata:
- Icon: `fa fa-exclamation-triangle`
- Color: `bg-color-warning`
- Title: `{{i18n.WarningType}}` ("Warning Type" / "Warnung")

### Form Elements

| # | Field (`data.*`) | Label / Placeholder (i18n key) | English | German | Type | Options | Default | Required | Read-only | Layout | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `name` | `label.name` (placeholder) | Name | Name | `input[text]` | -- | -- | No (no `mandatory` class) | No | `col-md-6` | -- |
| 2 | `type` | -- (select, no label) | -- | -- | `select` | ALLERGY, CONSPICIOUS, INFECTION, OTHER | ALLERGY (first option) | Yes (`mandatory` class) | No | `col-md-6` | See spelling note below |
| 3 | `entryRequirement` | `warning.entryRequirement` | Entry Requirement | Nur bei langer Zugangsuntersuchung angezeigt | `checkbox` (switch) | `true` | unchecked | No | No | `col-md-4` | Boolean switch |
| 4 | `documentationRequirement` | `warning.documentationRequirement` | Documentation Requirement | Kommentar verpflichtend | `checkbox` (switch) | `true` | unchecked | No | No | `col-md-4` | Boolean switch |
| 5 | `priority` | `warning.priority` (input-group prefix) | Priority | Prioritaet | `input[number]` | -- | -- | No | No | `col-md-3` | Number input with label prefix in input-group |
| 6 | `description` | `description` (placeholder) | Description | Beschreibung | `textarea` | -- | -- | No | No | `col-md-12` | Full-width; placeholder key is `description` (not `label.description`) |

### Select Options for `type`

| Value | i18n Key | English | German |
|---|---|---|---|
| `ALLERGY` | `WarningType.ALLERGY` | Allergy | Allergie |
| `CONSPICIOUS` | `WarningType.CONSPICIOUS` | Conspicuous | Auffaelligkeit |
| `INFECTION` | `WarningType.INFECTION` | Infection | Infektiositaet |
| `OTHER` | `WarningType.OTHER` | Other | Sonstige |

---

## 5. Full Translation Table

| Text-Reference | German | English | Notes |
|---|---|---|---|
| `WarningType` | Warnung | WarningType | Grid column header for type |
| `WarningType.ALLERGY` | Allergie | ALLERGY | EN value appears untranslated in legacy (raw enum echo) |
| `WarningType.CONSPICIOUS` | Auffaelligkeit | CONSPICIOUS | Misspelled -- see section 7 |
| `WarningType.INFECTION` | Infektiositaet | INFECTION | EN value appears untranslated in legacy |
| `WarningType.OTHER` | Sonstige | .OTHER | EN has leading dot (likely a typo in properties file) |
| `warning` | Warnung | Warning | -- |
| `warning.entryRequirement` | Nur bei langer Zugangsuntersuchung angezeigt | Entry Requirement | German is much longer descriptive text |
| `warning.documentationRequirement` | Kommentar verpflichtend | Documentation Requirement | -- |
| `warning.priority` | Prioritaet | Priority | -- |
| `label.id` | (not found in properties) | ID | Likely resolved by framework convention |
| `label.name` | (not found in properties) | Name | Likely resolved by framework convention |
| `label.description` | (not found in properties) | Description | Likely resolved by framework convention |
| `description` | (not found in properties) | Description | Used as textarea placeholder |
| `action.add` | Neu | Add | Shared key |
| `action.change` | Editieren | Change | Shared key |
| `action.delete` | Loeschen | Delete | Shared key |

---

## 6. Cross-Module References

The `warning/messages.i18n.js` file (which defines `Formatter.warningType` and `i18n.warningType()`) is imported by other modules:

| Module | File | Purpose |
|---|---|---|
| Consultation Review | `consultation/reviewDetails.html` (line 14) | Display warning type labels in review view |
| Consultation View | `consultation/viewDetails.html` (line 14) | Display warning type labels in detail view |
| Warning Management | `warning/index.htmlm` (line 20) | Self -- grid formatter + i18n |

This means the warning type enum and its formatter are shared dependencies used by the consultation feature to render patient warning/allergy information.

---

## 7. Spelling Issue: CONSPICIOUS

The enum value `CONSPICIOUS` is misspelled throughout the legacy codebase. The correct English spelling is **CONSPICUOUS**.

| Location | Current Value | Correct Value |
|---|---|---|
| `index.htmlm` line 45 (select option value) | `CONSPICIOUS` | `CONSPICUOUS` |
| `index.htmlm` line 45 (i18n key) | `WarningType.CONSPICIOUS` | `WarningType.CONSPICUOUS` |
| `messages.i18n.js` line 9 | `WarningType_CONSPICIOUS` | `WarningType_CONSPICUOUS` |
| `ApplicationResources.properties` | `WarningType.CONSPICIOUS` | `WarningType.CONSPICUOUS` |
| `ApplicationResources_en.properties` | `WarningType.CONSPICIOUS` | `WarningType.CONSPICUOUS` |
| Database enum values (presumed) | `CONSPICIOUS` | needs migration |

**Rebuild recommendation**: Normalize to `CONSPICUOUS` in the new codebase. If the database still contains `CONSPICIOUS` values, add a migration or mapping layer to translate the old enum value.

---

## 8. Dead Code

| Element | Details |
|---|---|
| `someActionBtn` | Toolbar button with icon `lock-alt`, hardcoded label "Action", always disabled. No click handler or event binding exists in `index.js`. This is a placeholder that was never implemented. **Do not carry forward to rebuild.** |

---

## 9. Data Model (Inferred)

```
Warning {
  id:                        number (auto, PK)
  name:                      string
  type:                      enum WarningType { ALLERGY, CONSPICUOUS, INFECTION, OTHER }
  entryRequirement:          boolean
  documentationRequirement:  boolean
  priority:                  number
  description:               string (text)
}
```

---

## 10. Rebuild Notes

1. **Simple CRUD**: This is a straightforward reference-data management page (no complex workflows, no nested entities).
2. **Enum normalization**: Fix `CONSPICIOUS` to `CONSPICUOUS` in the new schema and provide backward-compatible mapping if reading legacy data.
3. **English translations**: The legacy EN translations for `WarningType.*` values are broken (they echo the raw enum key, e.g., "ALLERGY" instead of "Allergy"). The rebuild should provide proper human-readable EN translations.
4. **Search**: The legacy search is client-side only (filtering loaded rows). The rebuild should implement server-side search/filtering via oRPC.
5. **Shared formatter**: The `warningType` formatter is consumed by consultation views. In the rebuild, expose a shared utility or component (e.g., `WarningTypeBadge`) from the warning feature for use in consultation detail views.
6. **Priority field**: Present in the detail form but absent from the grid. Consider whether priority should be a visible grid column in the rebuild.
7. **German label discrepancy**: `warning.entryRequirement` in German is a full sentence ("Nur bei langer Zugangsuntersuchung angezeigt") while EN is a short label. Verify intended UX with stakeholders.
