---
title: 'Consultation Template'
---

---
---

# 07 - Consultation Template Dialogs

## Dialog Navigation Diagram

```
[consultationWithTemplateBtn click]
        |
        v
expertConsultationTemplateDlg (list)
        |
        +-- [Create button] --> expertConsultationTemplateCreateDlg (modal form)
        |                              |
        |                              +-- [Save] --> ExpertConsultationTemplateService.save
        |                                                |
        |                                                +-- refreshes list
        |                                                +-- opens ConsultationDetails (template=true)
        |
        +-- [Edit button]  --> ExpertConsultationTemplateService.get
        |                              |
        |                              +-- opens ConsultationDetails (template=true)
        |
        +-- [Remove button] --> confirm() --> ExpertConsultationTemplateService.remove
                                                |
                                                +-- refreshes list
```

---

## expertConsultationTemplateDlg

### Visualization Attributes

| Attribute     | Value                     |
|---------------|---------------------------|
| `id`          | `expertConsultationTemplateDlg` |
| `data-target` | `secondary`               |
| `data-width`  | `400`                     |
| `data-icon`   | `far fa-books-medical`    |
| `data-color`  | `bg-color-consultation`   |
| `title`       | `{{i18n.consultationTemplate.yourTemplates}}` |

### Toolbar Elements

| Element              | Type          | Details                                                        |
|----------------------|---------------|----------------------------------------------------------------|
| Text filter          | `<input>`     | `id="consultationTemplateFilter"`, placeholder `{{i18n.consultationTemplate}}`, wrapped in input-group with search icon (`far fa-search`) |
| Create button        | `<button>`    | `id="addConsultationBtn"`, `btn btn-secondary btn-sm`, label `{{i18n.button.create}}` + plus icon (`far fa-plus`), `title="{{i18n.button.add}}"` |

### Table: Templates List

- **Collection source**: `data.templates` (via jsForm `fill`)
- **Container**: `<tbody id="consultationTemplates" class="collection" data-field="data.templates">`
- **Data loaded on**: `refresh` event, calling `ExpertConsultationTemplateService.getAll([])`

| Column          | Content                                       | Style          |
|-----------------|-----------------------------------------------|----------------|
| Name            | `templates.name`                              | `font-weight: bold` |
| Description     | `templates.description`                       | (default)      |
| Actions         | Edit button + Remove button                   | —              |

### Row Action Buttons

| Button   | CSS Classes                  | Icon              | Title                   |
|----------|------------------------------|-------------------|-------------------------|
| Edit     | `btn btn-primary btn-sm edit`    | `fas fa-pencil`   | `{{i18n.button.edit}}`  |
| Remove   | `btn btn-secondary btn-sm remove`| `fas fa-trash`    | `{{i18n.button.remove}}`|

### Click Actions

| Trigger                         | Action                                                                                     |
|---------------------------------|--------------------------------------------------------------------------------------------|
| `#consultationWithTemplateBtn`  | Opens `expertConsultationTemplateDlg`, triggers `refresh` event                            |
| `refresh` event                 | Calls `ExpertConsultationTemplateService.getAll([])`, fills form with `{templates: data}`  |
| `.edit` button (per row)        | Calls `ExpertConsultationTemplateService.get([pojo.id])`, then `ConsultationDetails.open(data, ()=>{}, true)` (template flag = `true`) |
| `.remove` button (per row)      | Shows `confirm(i18n.dialog_delete_confirm)`; on OK calls `ExpertConsultationTemplateService.remove([pojo.id])`, then triggers `refresh` |
| `#addConsultationBtn`           | Opens `expertConsultationTemplateCreateDlg` as modal                                       |

### Client-Side Text Filter

- **Element**: `#consultationTemplateFilter`
- **Event**: `keyup`
- **Logic**: Iterates over `#consultationTemplates tr`, reads `$(this).data().pojo`, toggles row visibility based on `pojo.name.toLowerCase().startsWith(value)` (case-insensitive prefix match against filter value)
- **Note**: The filter condition is duplicated in source (`pojo.name.toLowerCase().startsWith(value)` appears twice with `||`), but this has no functional effect

---

## expertConsultationTemplateCreateDlg

### Visualization Attributes

| Attribute     | Value                     |
|---------------|---------------------------|
| `id`          | `expertConsultationTemplateCreateDlg` |
| `data-target` | `modal`                   |
| `data-icon`   | `far fa-books-medical`    |
| `data-color`  | `bg-color-consultation`   |
| `title`       | `{{i18n.consultationTemplate}}` |
| `data-width`  | (not set)                 |

### Form Elements

| Field       | Element       | `name` attribute   | Attributes / Notes                          |
|-------------|---------------|--------------------|---------------------------------------------|
| Name        | `<input>`     | `data.name`        | `class="form-control mandatory"`, label via `input-group-text` showing `{{i18n.label.name}}` |
| Description | `<textarea>`  | `data.description` | `class="form-control"`, `placeholder="{{i18n.label.description}}"` |

### Layout

- Wrapped in `<div class="container">` > `<div class="row gy-2">`
- Name field uses `input-group` with prepended text label
- Description is a standalone textarea below

### Click Actions (Dialog Callback)

| Trigger                   | Action                                                                                              |
|---------------------------|-----------------------------------------------------------------------------------------------------|
| Dialog save/confirm       | Calls `ExpertConsultationTemplateService.save([data])` with form data                              |
|                           | On success: triggers `refresh` on `expertConsultationTemplateDlg`, then opens `ConsultationDetails.open(data, ()=>{}, true)` (template flag = `true`) |

---

## Service Calls Summary

| Service                              | Method    | Arguments     | Called From                       |
|--------------------------------------|-----------|---------------|-----------------------------------|
| `ExpertConsultationTemplateService`  | `getAll`  | `[]`          | `refresh` event on list dialog    |
| `ExpertConsultationTemplateService`  | `get`     | `[pojo.id]`   | Edit button click                 |
| `ExpertConsultationTemplateService`  | `save`    | `[data]`      | Create dialog save callback       |
| `ExpertConsultationTemplateService`  | `remove`  | `[pojo.id]`   | Remove button click (after confirm)|

---

## Translation Keys

| Key                                    | English Value            | Used In                                  |
|----------------------------------------|--------------------------|------------------------------------------|
| `consultationTemplate.yourTemplates`   | Your templates           | List dialog title                        |
| `consultationTemplate`                 | Consultation template    | Filter placeholder, create dialog title  |
| `label.name`                           | Name                     | Table header, create form label          |
| `label.description`                    | Description              | Table header, create form placeholder    |
| `button.add`                           | Add                      | Create button title attribute            |
| `button.create`                        | Create                   | Create button label text                 |
| `button.edit`                          | Edit                     | Edit button title attribute              |
| `button.remove`                        | Remove                   | Remove button title attribute            |
| `dialog_delete_confirm`               | *(framework confirm)*    | Remove confirmation prompt               |
