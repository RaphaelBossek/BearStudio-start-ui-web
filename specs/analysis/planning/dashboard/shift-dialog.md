---
title: 'Shift Dialog'
---

---
---

# 08 - Shift Dialog & Request Action Dialog

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Included by** | `{{> shiftDlg}}` + `{{> actionDetailsView}}` | [Month View](month-view.md) | Shift detail and action request dialogs in month dashboard |
| include | **Included by** | `{{> shiftDlg}}` + `{{> actionDetailsView}}` | [Week View](week-view.md) | Shift detail and action request dialogs in week dashboard |
| include | **Included by** | `{{> actionDetailsView}}` | [Calendar View](calendar-view.md) | Action details partial in calendar dashboard |
| include | **Included by** | `{{> shiftDlg}}` | [Calendar View](calendar-view.md) | Shift detail dialog (included but not wired from calendar) |

> **Include context:** `shiftDlg.mustache` and `actionDetailsView.html` are embedded as Mustache partials in [Month View](month-view.md), [Week View](week-view.md), and [Calendar View](calendar-view.md). The shift dialog shows appointment/shift details with a Leaflet map; the action details view is a shared partial for the request action sub-dialog. Both partials are included in calendar view but not actively wired to calendar events.

---

## Dialog Navigation Diagram

```
shiftDlg (#shiftDlg)
  |
  |-- [Request] button per action row
  |       |
  |       v
  requestActionDlg (#requestActionDlg)
        |
        |-- on OK callback: ActionService.apply(data.id)
        |       sends request, shows German alert:
        |       "Die Anfrage wurde abgesendet und wird von uns bearbeitet."
        |
        |-- [sendUserMessage] action on internal contact icon
```

---

## 1. Shift Dialog (`#shiftDlg`)

### Visualization Attributes

| Attribute    | Value                  |
|--------------|------------------------|
| `data-width` | `600`                  |
| `data-icon`  | `fa fa-shift-diagram`  |
| `data-color` | `bg-color-shift`       |
| `title`      | `{{i18n.shift}}` ("Shift") |

### Card Header Fields

The card header (`<h5 class="card-header">`) displays a composite label built from four inline fields:

| Field                  | Class          | Format   | Notes                         |
|------------------------|----------------|----------|-------------------------------|
| `data.name`            | `field`        | text     | Shift name                    |
| `data.location.name`   | `field`        | text     | Location name                 |
| `data.dateStart`       | `field date`   | date     | Shift start date              |
| `data.customer.name`   | `field`        | text     | Wrapped in parentheses `(...)` |

### Leaflet Map

| Property          | Value / Binding                         |
|-------------------|-----------------------------------------|
| Element ID        | `#shiftMap`                             |
| Height            | `200px` (inline style)                  |
| Latitude binding  | `data.location.latitude`                |
| Longitude binding | `data.location.longitude`               |
| Zoom              | `20` (passed as third array element)    |
| Marker visibility | Opacity `1` when coordinates exist, `0` otherwise |
| Resize fix        | `myMap.invalidateSize()` called via `setTimeout(0)` on `dialogopen` |

### Actions Collection / Repeater

| Property       | Value               |
|----------------|---------------------|
| Element ID     | `#actionList`       |
| Container      | `<tbody>`           |
| CSS class      | `collection`        |
| `data-field`   | `data.actions`      |
| Event          | `postAddCollection` |

### Actions Table Columns

| # | Header (i18n key)   | English Label | Field Binding               | Class          | Format   |
|---|---------------------|---------------|-----------------------------|----------------|----------|
| 1 | `jobId`             | Job-Id        | `actions.jobId.description`  | `field`        | text     |
| 2 | `action.dateStart`  | Start Date    | `actions.dateStart`          | `field dateTime` | dateTime |
| 3 | `action.dateEnd`    | End Date      | `actions.dateEnd`            | `field time`   | time     |
| 4 | _(no header)_       | —             | _(button)_                   | —              | —        |

### Click Actions

| Element                               | CSS Class | Action                                                                                     |
|---------------------------------------|-----------|--------------------------------------------------------------------------------------------|
| Request button (`<button>`)           | `request btn btn-primary` | Opens `#requestActionDlg` with the current action `pojo`. On OK callback calls `ActionService.apply(data.id)`. |

The Request button label comes from `{{i18n.AppointmentState.REQUESTED.action}}` = **"Request"**.

---

## 2. Request Action Dialog (`#requestActionDlg`)

### Visualization Attributes

| Attribute    | Value                  |
|--------------|------------------------|
| `data-width` | `600`                  |
| `data-icon`  | `fa fa-shift-diagram`  |
| `data-color` | `bg-color-shift`       |
| `title`      | `{{i18n.action}}` ("Action") |

### Content

The dialog body is the `{{>actionDetailsView}}` partial (see below). No additional controls are defined in the dialog wrapper itself.

### OK Callback Behavior

When the dialog is confirmed:

1. Calls `Core.conn.execute("ActionService", "apply", [data.id])`
2. On success, displays a German-language alert: _"Die Anfrage wurde abgesendet und wird von uns bearbeitet."_

---

## 3. Action Details View (`actionDetailsView.html`)

This is a shared partial template included via `{{>actionDetailsView}}`.

### Row 1 — Date/Time Fields

| Column Width | Label (i18n key)    | English Label | Field Binding    | Class        | Format |
|--------------|---------------------|---------------|------------------|--------------|--------|
| `col-md-3`   | `action.date`       | Date          | `data.dateStart` | `field date` | date   |
| `col-md-3`   | `action.dateStart`  | Start Date    | `data.timeStart` | `field`      | text   |
| `col-md-3`   | `action.dateEnd`    | End Date      | `data.timeEnd`   | `field`      | text   |

### Row 2 — Job & Contact Fields

| Column Width | Label (i18n key)          | English Label     | Field Binding                         | Class / Notes                                |
|--------------|---------------------------|-------------------|---------------------------------------|----------------------------------------------|
| `col-md-4`   | `action.jobTitle`         | Job title         | `data.jobId.description`              | `field` (text)                               |
| `col-md-4`   | `action.internalContact`  | Internal Contact  | _(object binding, see below)_         | `field setObj` with `data-field="data.internalContact"` |

### Internal Contact Object Binding (`setObj`)

The internal contact section uses `class="field setObj"` with `data-field="data.internalContact"`, binding the following sub-fields:

| Sub-field                              | Class / Element        | Format / Behavior                      |
|----------------------------------------|------------------------|----------------------------------------|
| `data.internalContact.displayName`     | `<span class="field">` | Display name (text)                    |
| `data.internalContact.cellularNumber`  | `<a>` with `data-prefix="tel:"` | Phone link; `href` is prefixed with `tel:` at render time |
| `data.internalContact.cellularNumber`  | `<span class="field">` inside `<a>` | Visible phone number text              |

### Click Actions (Action Details View)

| Element                                  | CSS Class              | Icon                  | Action              |
|------------------------------------------|------------------------|-----------------------|---------------------|
| Send message icon (`<i>`)               | `action sendUserMessage` | `fa fa-comment-dots` | Triggers `sendUserMessage` action on the internal contact |
| Phone link (`<a>`)                       | `field`                | `fa fa-phone`        | Opens native phone dialer via `tel:` href |

---

## Special Components

| Component    | Element ID   | Library  | Data Bindings                                                | Initialization                                           |
|--------------|-------------|----------|--------------------------------------------------------------|----------------------------------------------------------|
| Leaflet Map  | `#shiftMap` | Leaflet  | lat: `data.location.latitude`, lng: `data.location.longitude` | On `dialogopen` event; sets marker + view; calls `invalidateSize()` |

---

## Translation Table

| i18n Key                              | English Value     | Usage Context                        |
|---------------------------------------|-------------------|--------------------------------------|
| `shift`                               | Shift             | shiftDlg title                       |
| `action`                              | Action            | requestActionDlg title               |
| `jobId`                               | Job-Id            | Actions table header (column 1)      |
| `action.dateStart`                    | Start Date        | Actions table header (column 2), action details row 1 label |
| `action.dateEnd`                      | End Date          | Actions table header (column 3), action details row 1 label |
| `action.date`                         | Date              | Action details row 1 label           |
| `action.jobTitle`                     | Job title         | Action details row 2 label           |
| `action.internalContact`             | Internal Contact  | Action details row 2 label           |
| `AppointmentState.REQUESTED.action`  | Request           | Request button label in actions table |

---

## Data Shape Summary

```
Shift (shiftDlg data):
  name: string
  dateStart: date
  location:
    name: string
    latitude: number
    longitude: number
  customer:
    name: string
  actions[]:               # collection
    id: string
    jobId:
      description: string
    dateStart: dateTime
    dateEnd: time
    timeStart: string      # used in actionDetailsView
    timeEnd: string        # used in actionDetailsView
    internalContact:
      displayName: string
      cellularNumber: string
```
