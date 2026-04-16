---
title: 'Week View'
---

# Analysis: Expert Week View

## Cross-References

### Source Files

| File | Purpose |
|------|---------|
| `web/src/main/webapp/dash/weekView.htmlm` | Page template with table structure, navbar, and slot cells |
| `web/src/main/webapp/dash/weekView.js` | Page-specific behavior: button handlers, load guard, loader initialization |
| `web/src/main/webapp/profile/expertWeek.js` | Core data model: tri-state slot logic, fillDayData, row update events |

### Related Specifications

| File | Relationship |
|------|--------------|
| [appointment-details-scheduling.md](../../planning/appointment/appointment-details-scheduling.md) | Appointment popovers display details from appointment data loaded via `fillDayData` |
| [profile-expert-availability.md](../../user-management/profile/profile-expert-availability.md) | Shared expert availability model; `expertWeek.js` uses same data patterns |
| [shift-dialog.md](./shift-dialog.md) | Shift appointments (`ap.type === 'SHIFT'`) displayed with `fa-user-injured` icon in week view |

---

## 1. Page Layout

The page is a single full-width view composed of three vertical layers:

1. **Sticky navbar** (position: sticky, top: 0) -- rendered from the `navbar.mustache` template with two action buttons.
2. **Sticky table header** (position: sticky, top: 50px, white background) -- sits directly below the navbar and stays visible during vertical scroll.
3. **Table body** -- an hours x days grid for configuring weekly availability.
4. **Site loader overlay** -- the table has `class="siteLoader"` which triggers the generic loader pattern (`initGenericLoader()`).

The table element is `#expertWeekTable` with Bootstrap classes `table table-bordered justify-content-center table-hover`.

---

## 2. HTMLM Header (Template Includes)

| Field                | Method     | Source Path                                  |
|----------------------|------------|----------------------------------------------|
| `actionDetailsView`  | template   | `../dash/actionDetailsView.html`             |
| `appointmentDetails` | template   | `../appointment/details.html`                |
| `siteloader`         | template   | `../_include/siteloader.mustache`            |
| `navBar`             | template   | `../_include/navbar.mustache`                |
| `sendMessage`        | template   | `../notification/sendMessage.mustache`       |
| `nav`                | variable   | (see nav config below)                       |

### Script Includes

| Script                              | Purpose                        |
|--------------------------------------|-------------------------------|
| `/dash/messages.i18n.js`            | Dashboard i18n translations    |
| `/appointment/messages.i18n.js`     | Appointment i18n translations  |
| `/profile/messages.i18n.js`         | Profile i18n translations      |
| `/profile/expertWeek.js`            | Core week data model & logic   |
| `/dash/weekView.js`                 | Page-specific behavior         |

---

## 3. Navbar Actions

The nav variable disables filtering (`filter: false`) and provides two buttons:

| Button ID                   | Label (i18n key) | Icon     | Behavior                                                        |
|-----------------------------|------------------|----------|-----------------------------------------------------------------|
| `saveExpertDaysMenuBtn`     | `action.save`    | `save`   | Triggers `"saveWeek"` event on `#expertWeekTable`, then triggers `"load"` after a 500 ms delay to refresh data. |
| `reloadExpertDaysMenuBtn`   | `action.reload`  | `sync`   | Triggers `"load"` event on `#expertWeekTable` to reload data.   |

### Load Guard

The JS checks `Core.hasLoaded("monthViewLoaded")` at startup; if already loaded, it early-returns to prevent duplicate initialization. Otherwise it calls `initGenericLoader()` and wires up button handlers.

---

## 4. Form Elements

### Week Type Selection (`#weekTypeSelection`)

| Attribute | Value                  |
|-----------|------------------------|
| Element   | `<select>`             |
| ID        | `weekTypeSelection`    |
| Class     | `form-select`          |
| Location  | Top-left cell of table header |

#### Options

| Value       | Display Label (i18n) |
|-------------|----------------------|
| `TREATMENT` | Treatment            |

Currently only one option exists. The select is positioned in the first header cell (row header column).

---

## 5. Grid Structure (Hours x Days Matrix)

### Column Layout

| Column Index | Header Content                | `data-slot` Value | Class                      |
|--------------|-------------------------------|--------------------|----------------------------|
| 0            | `#weekTypeSelection` dropdown | (none)             | (plain `<th>`)             |
| 1            | Monday (i18n `WeekDay.MO`)   | `slotsMo`          | `slotchange clickable`     |
| 2            | Tuesday (i18n `WeekDay.TU`)  | `slotsTu`          | `slotchange clickable`     |
| 3            | Wednesday (i18n `WeekDay.WE`)| `slotsWe`          | `slotchange clickable`     |
| 4            | Thursday (i18n `WeekDay.TH`) | `slotsTh`          | `slotchange clickable`     |
| 5            | Friday (i18n `WeekDay.FR`)   | `slotsFr`          | `slotchange clickable`     |
| 6            | Saturday (i18n `WeekDay.SA`) | `slotsSa`          | `slotchange clickable`     |
| 7            | Sunday (i18n `WeekDay.SU`)   | `slotsSu`          | `slotchange clickable`     |

### Row Structure (Template Row)

The template defines a single `<tr>` row that is presumably cloned per hour slot by `expertWeek.js`. Each row contains:

| Cell | Class              | Content                                   |
|------|--------------------|-------------------------------------------|
| 0    | `hour clickable`   | Hour label (text-align: right). Clickable to toggle entire row. |
| 1-7  | `hourslot`         | One per day column, each with matching `data-slot`. Contains a `changehour` div and an `ap` span. |

### Hourslot Cell Internal Structure

```
<td class="hourslot" data-slot="slots{Day}">
  <div class="changehour">
    <span class="statusNull"><i class="fal fa-circle"></i></span>
    <span class="statusTrue"><i class="fa fa-check"></i></span>
    <span class="statusFalse"><i class="fa fa-times"></i></span>
  </div>
  <span class="ap"></span>
</td>
```

---

## 6. Tri-State Slot Interaction

Each hourslot cell implements a tri-state toggle via the `changehour` div. The three states cycle on click:

| State   | CSS Class     | Icon                        | Visual Meaning          |
|---------|---------------|-----------------------------|-------------------------|
| Null    | `statusNull`  | `fal fa-circle` (outline)   | Not configured / unset  |
| True    | `statusTrue`  | `fa fa-check` (checkmark)   | Available               |
| False   | `statusFalse` | `fa fa-times` (X mark)      | Unavailable             |

### Cycle Order

```
null --> true --> false --> null
```

Only one status span is visible at a time; the others are hidden (controlled by `expertWeek.js`).

### Bulk Toggle Interactions

| Click Target             | Class               | Effect                                    |
|--------------------------|----------------------|-------------------------------------------|
| Day column header (`th`) | `slotchange clickable` | Toggles all hourslot cells in that column (matching `data-slot`) |
| Hour label (`td`)        | `hour clickable`     | Toggles all hourslot cells in that row    |

---

## 7. Appointment Indicator Overlays

The `fillDayData` function populates appointment indicators within hourslot cells. It is registered as `$("#expertWeekTable").data().fillDayData` and called during data loading.

### Appointment Slot Mapping

The function maps each appointment to a slot name based on its `time` and `type` fields:

| `ap.type`  | `ap.time`   | Computed Slot Name         |
|------------|-------------|----------------------------|
| `SHIFT`    | `morning`   | `morning`                  |
| `SHIFT`    | `afternoon` | `afternoon`                |
| Non-SHIFT  | `morning`   | `morningAppointment`       |
| Non-SHIFT  | `afternoon` | `afternoonAppointment`     |

The computed slot is matched against `.dayslot` elements' `data().slot` value within the row.

### Appointment Type Icons

| `ap.type`   | Font Awesome Icon    | Meaning                |
|-------------|----------------------|------------------------|
| `SHIFT`     | `fa-user-injured`    | Shift assignment       |
| `COUNCIL`   | `fa-user-friends`    | Council/group session  |
| (default)   | `fa-user-md`         | Standard appointment   |

### Popover Content

Each appointment indicator is wrapped in a Bootstrap 5 popover (`data-bs-toggle="popover"`, `data-bs-trigger="hover focus"`).

Popover content is formatted as:

```
@{startTime}-{endTime} {title} {stateLabel}
```

Where:
- `startTime` / `endTime` are formatted as `HH:MM` via `Core.asDateTime(...).toISOTime({ suppressSeconds: true }).substring(0,5)`
- `title` is the appointment title
- `stateLabel` is `i18n["action_state_" + ap.state]`

### State-Based Styling

The icon receives a color class from `i18n.assignedState(ap.state).color`, which maps appointment states to Bootstrap/custom color classes.

---

## 8. Status Visualization Summary

| Visual Element           | Representation                             |
|--------------------------|--------------------------------------------|
| Unset slot               | Outline circle icon (`fal fa-circle`)      |
| Available slot           | Solid checkmark icon (`fa fa-check`)       |
| Unavailable slot         | Solid X icon (`fa fa-times`)               |
| Shift appointment        | `fa-user-injured` icon with state color    |
| Council appointment      | `fa-user-friends` icon with state color    |
| Standard appointment     | `fa-user-md` icon with state color         |
| Appointment details      | Bootstrap popover on hover/focus           |

---

## 9. Special Components

### Site Loader Pattern

- The table has `class="siteLoader"` which is consumed by `initGenericLoader()`.
- The `{{> siteloader}}` partial is rendered at the bottom of the page to provide the loading overlay markup.
- Data loading is triggered by firing the `"load"` custom event on `#expertWeekTable`.

### Data Model Integration (`expertWeek.js`)

- The `fillDayData` function is attached to `#expertWeekTable`'s jQuery data store: `$("#expertWeekTable").data().fillDayData`.
- It receives `(info, data, $line)` where:
  - `info` -- an object with at least a `day` property; the function adds an `appointments` array to it.
  - `data` -- server response data with an optional `appointments` array.
  - `$line` -- jQuery reference to the current table row.
- Before populating, it clears any existing `.assigned` elements from the row.
- Appointments are filtered by matching `ap.day === info.day`.

### Row Update Event

An empty `"update"` event handler is bound to each `<tr>` in the tbody:

```js
$("#expertWeekTable tbody tr").on("update", function(){});
```

This is a placeholder/hook for `expertWeek.js` to trigger re-renders.

### Bootstrap Popover Initialization

Popovers are initialized programmatically after each appointment icon is appended:

```js
[newAp].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
```

---

## 10. CSS (Inline Styles)

| Selector          | Styles                                                  |
|-------------------|---------------------------------------------------------|
| `.changehour`     | `width: 100%; text-align: center; display: inline-block; cursor: pointer` |
| `.hourslot .ap`   | `width: 0%; text-align: center`                        |
| Sticky navbar div | `position: sticky; top: 0px`                           |
| Table thead       | `position: sticky; top: 50px; background: white`       |
| Hour cell         | `text-align: right` (inline)                            |

Note: `.hourslot .ap` has `width: 0%` which means appointment icons overflow visually without taking layout space. This is intentional to prevent the appointment indicators from affecting cell sizing.

---

## 11. Translation Keys

| Key                        | English Value     | Context                       |
|----------------------------|-------------------|-------------------------------|
| `i18n.Treatment`           | Treatment         | Week type dropdown option     |
| `i18n.WeekDay.MO`         | Monday            | Column header                 |
| `i18n.WeekDay.TU`         | Tuesday           | Column header                 |
| `i18n.WeekDay.WE`         | Wednesday         | Column header                 |
| `i18n.WeekDay.TH`         | Thursday          | Column header                 |
| `i18n.WeekDay.FR`         | Friday            | Column header                 |
| `i18n.WeekDay.SA`         | Saturday          | Column header                 |
| `i18n.WeekDay.SU`         | Sunday            | Column header                 |
| `action.save`              | Save              | Navbar save button            |
| `action.reload`            | Reload            | Navbar reload button          |
| `i18n.action_state_{state}`| (state-dependent) | Appointment state label in popover |
| `i18n.assignedState(state)`| (returns object)  | Returns `{ color }` for state-based styling |

---

## 12. Event Flow Summary

```
Page Load
  --> Core.hasLoaded("monthViewLoaded") guard
  --> initGenericLoader()
  --> Wire button handlers
  --> Trigger "load" on #expertWeekTable
  --> Generic loader fetches data
  --> fillDayData() populates appointment indicators per row
  --> Bootstrap popovers initialized

Save Button Click
  --> Trigger "saveWeek" on #expertWeekTable
  --> Wait 500ms
  --> Trigger "load" on #expertWeekTable (refresh)

Reload Button Click
  --> Trigger "load" on #expertWeekTable

Slot Click (changehour)
  --> Cycle: null -> true -> false -> null (handled by expertWeek.js)

Column Header Click (slotchange)
  --> Toggle all slots in that day column (handled by expertWeek.js)

Hour Label Click
  --> Toggle all slots in that hour row (handled by expertWeek.js)
