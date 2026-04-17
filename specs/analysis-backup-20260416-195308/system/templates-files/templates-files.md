---
title: 'Templates Files'
---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `utility/worklog-templates-files.md` | [User Video History](../../../academy/video-history/user-video-history.md) | Section 5 extracted to sibling |

---

## 2. Export Template (`exportTemplate/`)

### 2.1 Overview

CRUD management for export templates (file-based templates used for generating exports). Service: `ExportTemplateService`.

### 2.2 Grid Columns

| # | Field | Name | Sortable | Width | Formatter | Notes |
|---|---|---|---|---|---|---|
| 1 | `id` | `{{i18n.label.id}}` | Yes | 60 | -- | |
| 2 | `name` | `{{i18n.label.name}}` | Yes | 180 | -- | |
| 3 | `description` | `{{i18n.label.description}}` | Yes | 280 | -- | |
| 4 | `type` | `{{i18n.label.type}}` | Yes | 180 | `options` (enum) | Java enum: `ExportTemplateType` |
| 5 | `active` | `{{i18n.label.active}}` | Yes | 70 | `Formatter.bool` | |

### 2.3 Form Elements (Detail Panel)

| # | Field Name | Label | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | `data.name` | `{{i18n.label.name}}` | text input | mandatory | |
| 2 | `data.type` | `{{i18n.label.type}}` | select (enum) | mandatory | `ExportTemplateType` enum options |
| 3 | `data.prio` | `{{i18n.label.priority}}` | number input | -- | Priority ordering |
| 4 | `data.active` | `{{i18n.label.active}}` | checkbox switch | -- | |
| 5 | `data.filename` | Dateiname | text input | -- | Filename with placeholders `{{date}}`, `{{time}}` |
| 6 | `data.description` | `{{i18n.label.description}}` | textarea | -- | |
| 7 | File upload | `{{i18n.label.file}}` | file upload | -- | Conditional: shown only when `data.id` exists |

### 2.4 Click Actions

| # | Action ID | Symbol | Title | English | Notes |
|---|---|---|---|---|---|
| 1 | `addMenuBtn` | `plus-square` | `action.add` | Add | Create new template |
| 2 | `editMenuBtn` | `pencil` | `action.change` | Edit | Initially disabled |
| 3 | `deleteMenuBtn` | `trash` | `action.delete` | Delete | Initially disabled |

### 2.5 Special Components

| Component | Description | Implementation |
|---|---|---|
| File Upload | Upload template file to `ExportTemplateService.upload` | `jsfileupload` widget; result sets `data.template` |
| File Download | Download attached template file | Link: `/get/ExportTemplateService/attachment/{id}/{templateId}` |
| Enum Dropdown | `ExportTemplateType` Java enum | Server-side rendered as `<option>` elements |

### 2.6 Translation Table

| Text-Reference | German | English | Notes |
|---|---|---|---|
| `i18n.label.id` | ID | ID | Shared label |
| `i18n.label.name` | Name | Name | Shared label |
| `i18n.label.description` | Beschreibung | Description | Shared label |
| `i18n.label.type` | Typ | Type | Shared label |
| `i18n.label.active` | Aktiv | Active | Shared label |
| `i18n.label.priority` | Prioritaet | Priority | Shared label |
| `i18n.label.file` | Datei | File | Shared label |
| `i18n.label.uploadFile` | Datei hochladen | Upload File | Shared label |
| `i18n.exportTemplate` | Export-Vorlage | Export Template | Page/panel title |
| "Dateiname" | Dateiname | Filename | HARDCODED in HTML (input-group-text) |
| "Dateiname Platzhalter:" | Dateiname Platzhalter: | Filename Placeholders: | HARDCODED |
| "aktuelles Datum (yyyyMMdd)" | aktuelles Datum (yyyyMMdd) | Current Date (yyyyMMdd) | HARDCODED help text |
| "aktuelles Zeit (hhmm)" | aktuelles Zeit (hhmm) | Current Time (hhmm) | HARDCODED help text |
| "Dateinamen wird normalisiert..." | Dateinamen wird normalisiert (also sonderzeichen zu _). | Filenames are normalized (special chars become _). | HARDCODED |

---

## 3. Notification Template (`notificationTemplate/`)

### 3.1 Overview

CRUD management for notification email/message templates. Service: `NotificationTemplateService`. Includes a live Markdown preview using `marked.js`.

### 3.2 Grid Columns

| # | Field | Name | Sortable | Width | Formatter | Notes |
|---|---|---|---|---|---|---|
| 1 | `id` | `{{i18n.label.id}}` | Yes | 40 | -- | |
| 2 | `event` | `{{i18n.notificationTemplate.event}}` | Yes | 210 | `options` (enum) | `NotificationEvent` enum; formatted display |
| 3 | `event` | `{{i18n.notificationTemplate.event}}` | Yes | 250 | -- | Same field, raw value (duplicate column) |
| 4 | `subject` | `{{i18n.notificationTemplate.subject}}` | Yes | 300 | -- | Email subject |
| 5 | `message` | `{{i18n.notificationTemplate.textMessage}}` | Yes | 600 | -- | Message body |

### 3.3 Form Elements (Detail Panel)

| # | Field Name | Label | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | `data.subject` | `{{i18n.notificationTemplate.subject}}` | text input | -- | Email subject line |
| 2 | `data.event` | `{{i18n.notificationTemplate.event}}` | select (enum) | -- | `NotificationEvent` Java enum |
| 3 | `data.message` | `{{i18n.notificationTemplate.message}}` | textarea (40 rows) | -- | Markdown content; ID=`markdown` |

### 3.4 Click Actions

| # | Action ID | Symbol | Title | English | Notes |
|---|---|---|---|---|---|
| 1 | `editMenuBtn` | `pencil` | `action.change` | Edit | Initially disabled |
| 2 | `deleteMenuBtn` | `trash` | `action.delete` | Delete | Initially disabled |
| 3 | `someActionBtn` | `lock-alt` | Action | Action | Initially disabled; purpose unclear |

**NOTE**: No "Add" button -- notification templates may be system-managed (only edit/delete existing).

### 3.5 Special Components

| Component | Description | Implementation |
|---|---|---|
| Markdown Preview | Live preview of message body | `marked.parse()` on keyup/change; renders to `#preview` div |
| Preview Container | Fixed-height scrollable preview | CSS: `.templatePreview { height: 480px; overflow: hidden; }` |
| Enum Dropdown | `NotificationEvent` Java enum | Server-side rendered as `<option>` elements |

### 3.6 Translation Table

| Text-Reference | German | English | Notes |
|---|---|---|---|
| `i18n.notificationTemplate` | Benachrichtigungsvorlage | Notification Template | Panel title |
| `i18n.notificationTemplate.event` | Ereignis | Event | |
| `i18n.notificationTemplate.subject` | Betreff | Subject | |
| `i18n.notificationTemplate.textMessage` | Textnachricht | Text Message | Grid column |
| `i18n.notificationTemplate.message` | Nachricht | Message | Form label |
| `i18n.notificationTemplate.preview` | Vorschau | Preview | Preview label |
| `i18n.NotificationEvent_*` | (enum values) | (enum values) | Dynamic enum-based i18n keys |

---

## 4. User File (`userFile/`)

### 4.1 Overview

CRUD management for user-uploaded files (documents, certificates, contracts). Service: `UserFileService`. Includes quick filter.

### 4.2 Grid Columns

| # | Field | Name | Sortable | Width | Formatter | Notes |
|---|---|---|---|---|---|---|
| 1 | `id` | `{{i18n.label.id}}` | Yes | 80 | -- | |
| 2 | `data` | `{{i18n.userFile.data}}` | Yes | 80 | -- | File data reference |
| 3 | `type` | `{{i18n.userFile.type}}` | Yes | 80 | -- | File type enum |
| 4 | `foreignId` | `{{i18n.userFile.foreignId}}` | Yes | 80 | -- | Linked entity ID |
| 5 | `parentId` | `{{i18n.userFile.parentId}}` | Yes | 80 | -- | Hierarchical parent |
| 6 | `date` | `{{i18n.userFile.date}}` | Yes | 80 | `Formatter.dateTime` | Upload date |
| 7 | `dateVerified` | `{{i18n.userFile.dateVerified}}` | Yes | 80 | `Formatter.dateTime` | Verification date |
| 8 | `verifiedBy` | `{{i18n.userFile.verifiedBy}}` | Yes | 80 | -- | Verifier ID |
| 9 | `active` | `{{i18n.userFile.active}}` | Yes | 80 | `Formatter.bool` | |
| 10 | `ownerId` | `{{i18n.userFile.ownerId}}` | Yes | 80 | -- | Owner user ID |

### 4.3 Form Elements (Detail Panel)

| # | Field Name | Label | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | `data.id` | `{{i18n.label.id}}` | read-only span | -- | Display only |
| 2 | `data.data` | `{{i18n.userFile.data}}` | autocomplete object | -- | `FileEntryService.autocomplete`; displays `name` |
| 3 | `data.type` | `{{i18n.label.type}}` | select | -- | `UserFileType` enum (10 options) |
| 4 | `data.foreignId` | `{{i18n.userFile.foreignId}}` | number input | -- | Tooltip: "allows linking the file to a special foreign id (i.e. skill)" |
| 5 | `data.parentId` | `{{i18n.userFile.parentId}}` | number input | -- | Tooltip: "allows for hierarchical structures" |
| 6 | `data.date` | `{{i18n.label.date}}` | date input | -- | |
| 7 | `data.dateVerified` | `{{i18n.userFile.dateVerified}}` | date input | -- | |
| 8 | `data.verifiedBy` | `{{i18n.userFile.verifiedBy}}` | number input | -- | |
| 9 | `data.active` | `{{i18n.label.active}}` | checkbox switch | -- | |
| 10 | `data.ownerId` | `{{i18n.userFile.ownerId}}` | number input | -- | |

### 4.4 UserFileType Enum Values

| Enum Value | i18n Key | German | English |
|---|---|---|---|
| `APPROBIATION` | `i18n.UserFileType.APPROBIATION` | Approbation | Medical License |
| `AUTHENTICATED_MEDICAL_SPECIALIST_CERTIFICATE` | `i18n.UserFileType.AUTHENTICATED_MEDICAL_SPECIALIST_CERTIFICATE` | Beglaubigte Facharztanerkennung | Authenticated Medical Specialist Certificate |
| `LOAN_AGREEMENT` | `i18n.UserFileType.LOAN_AGREEMENT` | Leihvertrag | Loan Agreement |
| `DATA_PROTECTION_CONTRACT` | `i18n.UserFileType.DATA_PROTECTION_CONTRACT` | Datenschutzvertrag | Data Protection Contract |
| `BASIC_RULES_CONTRACT` | `i18n.UserFileType.BASIC_RULES_CONTRACT` | Grundregelvertrag | Basic Rules Contract |
| `BAVARIA_LAWS_CONTRACT` | `i18n.UserFileType.BAVARIA_LAWS_CONTRACT` | Bayern-Gesetze-Vertrag | Bavaria Laws Contract |
| `SOCIAL_SECURITY_CHECKLIST` | `i18n.UserFileType.SOCIAL_SECURITY_CHECKLIST` | Sozialversicherungs-Checkliste | Social Security Checklist |
| `PROFESSIONAL_LIABILITY_INSURANCE` | `i18n.UserFileType.PROFESSIONAL_LIABILITY_INSURANCE` | Berufshaftpflichtversicherung | Professional Liability Insurance |
| `CURRICULUM_VITAE` | `i18n.UserFileType.CURRICULUM_VITAE` | Lebenslauf | Curriculum Vitae |
| `SERVICE_CONTRACT` | `i18n.UserFileType.SERVICE_CONTRACT` | Dienstvertrag | Service Contract |

### 4.5 Click Actions

| # | Action ID | Symbol | Title | English | Notes |
|---|---|---|---|---|---|
| 1 | `addMenuBtn` | `plus-square` | `action.add` | Add | |
| 2 | `editMenuBtn` | `pencil` | `action.change` | Edit | Initially disabled |
| 3 | `deleteMenuBtn` | `trash` | `action.delete` | Delete | Initially disabled |
| 4 | `someActionBtn` | `lock-alt` | Action | Action | Initially disabled; purpose unclear |

### 4.6 Translation Table

| Text-Reference | German | English | Notes |
|---|---|---|---|
| `i18n.userFile` | Benutzerdatei | User File | Panel title |
| `i18n.userFile.data` | Daten | Data | File data field |
| `i18n.userFile.type` | Typ | Type | |
| `i18n.userFile.foreignId` | Fremd-ID | Foreign ID | |
| `i18n.userFile.parentId` | Eltern-ID | Parent ID | |
| `i18n.userFile.date` | Datum | Date | |
| `i18n.userFile.dateVerified` | Verifiziert am | Date Verified | |
| `i18n.userFile.verifiedBy` | Verifiziert von | Verified By | |
| `i18n.userFile.active` | Aktiv | Active | |
| `i18n.userFile.ownerId` | Besitzer-ID | Owner ID | |

---

## 7. Summary of Cross-Module Dependencies (Templates & Files)

```
exportTemplate
    |-- ExportTemplateService        (CRUD + file upload/download)
    |-- FileEntryService             (not directly, but template file management)

notificationTemplate
    |-- marked.js                    (Markdown rendering)
    |-- NotificationTemplateService  (CRUD)

userFile
    |-- UserFileService              (CRUD)
    |-- FileEntryService             (autocomplete for file data)
```

## 8. Shared Patterns Across All Modules

| Pattern | Description | Used In |
|---|---|---|
| `Core.initCrud` | Standard CRUD initialization (grid + detail + service) | All 6 modules |
| `slickerGrid` | jQuery grid plugin with data service binding | All 6 modules |
| `Core.hasLoaded` | Guard against duplicate initialization | All 6 modules |
| `saveSettings` | Persist grid column settings via `UserService.saveSetting` | All 6 modules |
| `data-formatter` | Declarative column formatting in HTML grid definitions | All 6 modules |
| `Formatter.name` | Display `.name` property of object fields | worklog, userVideoHistory, invoiceReceiver |
| `Formatter.dateTime` | Date/time formatting | userFile, userVideoHistory, invoiceReceiver |
| `Formatter.bool` | Boolean display (checkmark/cross) | exportTemplate, userFile |
| `Formatter.currency` | Currency formatting | worklog |
| `jsForm` | jQuery form data binding (fill/getData) | exportTemplate, invoiceReceiver |
| `Dialog.init` / `Dialog.open` | Modal dialog management | worklog, invoiceReceiver, userVideoHistory |
