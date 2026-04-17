---
title: 'Location And Users'
---

---
---

# Customer Location & User Management Pages — Legacy UI Analysis

## Cross-References

### Source Files

| File | Purpose |
|------|---------|
| `web/src/main/webapp/customer/location.htmlm` | Location list page |
| `web/src/main/webapp/customer/location.js` | Location page behavior |
| `web/src/main/webapp/customer/locationCreate.mustache` | Location create/edit dialog template |
| `web/src/main/webapp/customer/locationCreate.js` | Location dialog behavior |
| `web/src/main/webapp/customer/user.htmlm` | Customer user list page |
| `web/src/main/webapp/customer/user.js` | Customer user page behavior |
| `web/src/main/webapp/customer/zipCodeLookup.js` | Zip code auto-fill logic |
| `web/src/main/webapp/admin/password.mustache` | Password reset dialog |
| `web/src/main/webapp/admin/password.js` | Password dialog behavior |
| `web/src/main/webapp/customer/messages.i18n.js` | Customer/location translations |
| `web/src/main/webapp/profile/profile.js` | Shared profile form logic |

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Includes** | `{{> locationDlg}}` | (same file — locationCreate.mustache) | Location create/edit dialog |
| include | **Includes** | `{{> passwordDlg}}` | [Profile Dialogs](_shared-components/profile-dialogs.md#cross-references) | Password reset dialog |
| include | **Included by** | `<script src="/profile/profile.js">` | [Profile Form](_shared-components/profile-form.md#cross-references) | Profile form logic (SSN validation, file upload) |
| include | **Included by** | `<script src="/customer/messages.i18n.js">` | (same file — shared i18n) | Customer/location/role translations |
| include | **Included by** | `<script src="/customer/zipCodeLookup.js">` | [Customer List Detail](./customer-list-detail.md) | Zip-to-city auto-fill |
| include | **Includes** | `{{> navbar}}` | (navbar — no analysis file) | Navigation bar |

### Service Calls

| Service | Method | Parameters | Linked Document | Context |
|---------|--------|------------|-----------------|---------|
| `LocationService` | `get` | `[id]` | — | Load location for edit |
| `LocationService` | `getAll` | `[filter, max]` | — | Grid data source |
| `LocationService` | `getFolders` | `[locationId]` | — | Populate URL path autocomplete |
| `LocationService` | `getBackupFolders` | `[locationId]` | — | Populate backup URL autocomplete |
| `LocationService` | `testUpload` | `[locationId, path]` | — | Test file upload |
| `UserService` | `get` | `[id]` | — | Load user for edit |
| `UserService` | `getAll` | `[filter, max]` | — | Grid data source |
| `UserService` | `saveSetting` | `[key, value]` | — | Grid settings persistence |
| `LocationTypeService` | `autocomplete` | `[query]` | — | Location type selector |
| `CustomerService` | `autocomplete` | `[query]` | — | Customer selector (location + user) |
| `ZipCodeService` | `get` | `[term]` | — | Zip code auto-fill |
| `CountryService` | `autocomplete` | `[query]` | — | Country selector |

> **Include context:** `location.htmlm` embeds `locationCreate.mustache` as a Mustache partial for the location dialog. `user.htmlm` embeds `admin/password.mustache` (also documented in [Profile Dialogs](_shared-components/profile-dialogs.md)) and loads `profile/profile.js` (documented in [Profile Form](_shared-components/profile-form.md)). Both pages share `zipCodeLookup.js` for zip code auto-fill and `messages.i18n.js` for translations.
>
> **Service context:** Location page uses `LocationService` for CRUD + folder operations; User page uses `UserService`. Both use `CustomerService` for customer selection. Address fields on both pages use `ZipCodeService` via `zipCodeLookup.js`.

---

## Part A: Location Management Page (`location.htmlm`)

---

### A1. Block Title & Visualization

| Attribute | Value |
|-----------|-------|
| Block ID | `location` |
| CSS class | `tableView` |
| Icon | — (no `data-icon` on main block) |
| Color | — (no `data-color` on main block) |
| CRUD config | `Core.initCrud` with `serviceName: "LocationService"`, `getMethod: "get"` |
| Grid mode | `fullscreen: true` via `slickerGrid` |

---

### A2. HTMLM Header Metadata

#### Variables

| Field | Method | Value |
|-------|--------|-------|
| `usePanel` | `variable` | `true` |
| `nav` | `variable` | Filter enabled, toolbar buttons (see A3) |

#### Template Includes

| Field | Method | Template Path |
|-------|--------|---------------|
| `navBar` | `template` | `../_include/navbar.mustache` |
| `locationDlg` | `template` | `../customer/locationCreate.mustache` |

#### Script Includes

| Script |
|--------|
| `/customer/messages.i18n.js` |
| `/contact/messages.i18n.js` |
| `/customer/location.js` |
| `/customer/zipCodeLookup.js` |

---

### A3. Toolbar (Nav Buttons)

| # | ID | Name (i18n key) | Icon | Disabled (initial) | Auth / Role Gate | Purpose (from JS) |
|---|-----|-----------------|------|---------------------|------------------|--------------------|
| 1 | `addMenuBtn` | `action.add` | `plus-square` | `false` | — | Add new location |
| 2 | `editMenuBtn` | `action.change` | `pencil` | `true` | — | Edit selected location |
| 3 | `deleteMenuBtn` | `action.delete` | `trash` | `true` | — | Delete selected location |
| — | *(spacer)* | — | — | — | — | — |

**Filter toggle**: `filter: true` in nav config enables the offcanvas filter panel toggle.

---

### A4. Grid / Table Columns

Defined in `<div class="grid">` inside `#location`.

| # | `data-field` | `data-name` (i18n key) | `data-sortable` | `data-width` | `data-formatter` | Notes |
|---|-------------|------------------------|-----------------|-------------|------------------|-------|
| 1 | `foreignId` | `{{i18n.label.id}}` | `true` | 30 | `Formatter.id` | Also has `data-id="foreignId"` (row identity column) |
| 2 | `name` | `{{i18n.label.name}}` | `true` | 200 | — | Plain text |
| 3 | `typeName` | `{{i18n.contact.type}}` | `true` | 50 | — | Location type name |
| 4 | `customerName` | `{{i18n.customer}}` | `true` | 300 | — | Customer name (denormalized) |
| 5 | `patientDataType` | `{{i18n.patientDataType}}` | `true` | 110 | `Formatter.patientDataType` | Enum to i18n label |
| 6 | `patientDataAccess` | `{{i18n.patientDataAccess}}` | `true` | 150 | `Formatter.patientDataAccess` | Icon-based display (folder/envelope + check) |
| 7 | `state` | `{{i18n.contact.state}}` | `true` | 130 | — | Plain text |
| 8 | `email` | `{{i18n.contact.primaryemail}}` | `true` | 110 | — | Plain text |
| 9 | `address` | `{{i18n.location.address}}` | `true` | 180 | — | Plain text |
| 10 | `zip` | `{{i18n.location.zip}}` | `true` | 60 | — | Plain text |
| 11 | `city` | `{{i18n.location.city}}` | `true` | 120 | — | Plain text |
| 12 | `country` | `{{i18n.location.country}}` | `true` | 80 | — | Plain text |

**Grid data source** (from JS):
- Service: `LocationService`
- Method: `getAll`
- Params: `[filter, 100]` (filter object + max 100 results)
- Data processing: none (passthrough)
- Settings persistence: `UserService.saveSetting` keyed by `#gridSetting` `data-code`

#### Formatter Details

| Formatter | Behavior |
|-----------|----------|
| `Formatter.id` | Standard ID formatter (renders row identity) |
| `Formatter.patientDataType` | Maps enum value (e.g. `INTERNAL_SECUREBOX`) to `i18n.patientDataType_{VALUE}` |
| `Formatter.patientDataAccess` | Icon-based: shows `fa-folder-open` if `backupUrl` set, else `fa-envelope-open-text`; appends `fa-check` if `active === true` |

---

### A5. Filter Panel

Offcanvas side panel (`#filter`), right-aligned.

| # | Field name | Placeholder (i18n key) | Type | Icon | Notes |
|---|------------|----------------------|------|------|-------|
| 1 | `data.name` | `{{i18n.label.name}}` | `<input>` text | — | Name search |
| 2 | `data.address` | `{{i18n.location.address}}` | `<input>` text | `fa-compass` | Address search |
| 3 | `data.phone` | `{{i18n.location.phone}}` | `<input>` text | `fa-phone` | Phone search |

**Controls:**
- Apply button: `{{i18n.button.apply}}`
- Max results select: options `-1` (default/all), `150`, `200`, `300`, `500`
- Reset button: `{{i18n.button.reset}}`

---

### A6. Location Create/Edit Dialog (`locationCreate.mustache`)

#### Dialog Meta

| Attribute | Value |
|-----------|-------|
| Dialog ID | `locationCreateDlg` |
| CSS class | `detail` |
| Width | `900` px |
| Icon | `fa fa-fw fa-clinic-medical` |
| Color | `bg-color3` |
| Title | `{{i18n.location}}` |

#### Tab Structure

| Tab # | Tab ID | Title (i18n) | Icon | Description |
|-------|--------|-------------|------|-------------|
| 1 | `tabContact` | `{{i18n.contact}}` | `fas fa-address-card` | Main contact info & patient data configuration |
| 2 | `tabAdditional` | `{{i18n.contact.private}}` | `far fa-home` | Address, geo-coordinates, map |
| 3 | `tabRooms` | `{{i18n.room}}` | `far fa-building` | Room collection table |

---

#### A6.1 Tab 1: Contact (`#tabContact`)

##### Form Elements

| # | Name | Placeholder / Label | Datamodel | Type | Options | Required | Read-only | Condition | Notes |
|---|------|-------------------|-----------|------|---------|----------|-----------|-----------|-------|
| 1 | `data.type` | `{{i18n.location}}` | `type` (object) | Autocomplete (object) | `LocationTypeService.autocomplete`, display=`name`, minlength=0 | No | No | — | Location type selector |
| 2 | `data.name` | `{{i18n.label.name}}` | `name` | Text | — | **Yes** (`mandatory`) | No | — | — |
| 3 | `data.foreignId` | `{{i18n.label.id}}` | `foreignId` | Text | — | No | No | — | External reference ID |
| 4 | `data.externalId` | `{{i18n.location.externalId}}` | `externalId` | Text | — | No | No | — | — |
| 5 | `data.customer` | `{{i18n.customer}}` | `customer` (object) | Autocomplete (object) | `CustomerService.autocomplete`, display=`name` | **Yes** (`mandatory`) | No | — | Icon: `fa-building` |
| 6 | `data.patientDataType` | `{{i18n.patientDataType}}` | `patientDataType` | Select | See enum values below | No | No | — | Controls visibility of `preconfigured` fields |
| 7 | `data.booknumberMask` | `{{i18n.book.number}}` | `booknumberMask` | Text | — | No | No | — | Book number mask |
| 8 | `data.patientDataAccess.email` | **"E-Mail"** HARDCODED | `patientDataAccess.email` | Text | — | No | No | — | — |
| 9 | `data.patientDataAccess.subject` | **"Subject"** HARDCODED | `patientDataAccess.subject` | Text | — | No | No | — | — |
| 10 | `data.patientDataAccess.host` | **"Host/Url"** HARDCODED | `patientDataAccess.host` | Text | — | No | No | Hidden when `patientDataType` is preconfigured | CSS class `preconfigured` |
| 11 | `data.patientDataAccess.user` | `{{i18n.label.name}}` | `patientDataAccess.user` | Text | — | No | No | Hidden when `patientDataType` is preconfigured | CSS class `preconfigured` |
| 12 | `data.patientDataAccess.password` | `{{i18n.login.password}}` | `patientDataAccess.password` | Password | — | No | No | Hidden when `patientDataType` is preconfigured | CSS class `preconfigured` |
| 13 | `data.patientDataAccess.url` | `{{i18n.location.path}}` | `patientDataAccess.url` | Autocomplete (text) | Populated by `checkConnection` action | No | No | — | Folder path autocomplete |
| 14 | `data.patientDataAccess.active` | `{{i18n.location.check.label}}` | `patientDataAccess.active` | Checkbox (switch) | — | No | No | — | Boolean toggle |
| 15 | `data.patientDataAccess.backupUrl` | **"Backup {{i18n.location.path}}"** | `patientDataAccess.backupUrl` | Autocomplete (text) | Populated by `checkbackupConnection` | No | No | — | Icon: `fa-shield-alt` |
| 16 | `data.medicationType` | `{{i18n.MedicationType}}` | `medicationType` | Select | `ROTE_LISTE`, `WALDAPOTHEKE` | No | No | — | — |
| 17 | `data.externalDescription` | `{{i18n.patient.externalDescription}}` | `externalDescription` | Textarea | — | No | No | — | Title says "Markdown" |
| 18 | `data.sipAccounts` | **"Sip Accounts"** HARDCODED | `sipAccounts[]` | Collection (list) | Items: `sipAccounts.number` (text) | No | No | — | Add/delete dynamic list; icon `fa-phone-plus` |
| 19 | `data.representative` | `{{i18n.location.representative}}` | `representative` | Text | — | No | No | — | Label: `{{i18n.location.contact}}` |
| 20 | `data.phone` | `{{i18n.contact.workphone}}` | `phone` | Text | — | No | No | — | Icon: `fa-phone-office` |
| 21 | `data.fax` | `{{i18n.contact.faxnumber}}` | `fax` | Text | — | No | No | — | Icon: `fa-fax` |
| 22 | `data.uid` | `{{i18n.address.uid}}` | `uid` | Text | — | No | No | — | VAT / UID number |
| 23 | `data.iban` | `{{i18n.address.iban}}` | `iban` | Text | — | No | No | — | Bank IBAN |
| 24 | `data.bank` | `{{i18n.address.bank}}` | `bank` | Text | — | No | No | — | Bank name |
| 25 | `data.bic` | `{{i18n.address.bic}}` | `bic` | Text | — | No | No | — | Bank BIC |
| 26 | `data.contactMedical` | `{{i18n.location.representative}}` | `contactMedical` | Text | — | No | No | — | Label: `{{i18n.location.contactMedical}}` |
| 27 | `data.sip1` | `{{i18n.contact.workphone}}` | `sip1` | Text | — | No | No | — | Icon: `fa-phone-square` |
| 28 | `data.sip2` | `{{i18n.contact.workphone}}` | `sip2` | Text | — | No | No | — | Icon: `fa-phone-square` |
| 29 | `data.sipMobile` | `{{i18n.contact.workphone}}` | `sipMobile` | Text | — | No | No | — | Icon: `fa-mobile` |
| 30 | `data.phoneMedical` | `{{i18n.contact.workphone}}` | `phoneMedical` | Text | — | No | No | — | Icon: `fa-phone-office` |
| 31 | `data.emailMedical` | `{{i18n.contact.email}}` | `emailMedical` | Text | — | No | No | — | Icon: `@` |

##### PatientDataType Enum Values

| Value | i18n key | Preconfigured? | Notes |
|-------|----------|----------------|-------|
| `INTERNAL_SECUREBOX` | `{{i18n.PatientDataType.INTERNAL_SECUREBOX}}` | Yes | Hides host/user/password fields |
| `INTERNAL_VCCLOUD` | `{{i18n.PatientDataType.INTERNAL_VCCLOUD}}` | Yes | Hides host/user/password fields |
| `INTERNAL` | `{{i18n.PatientDataType.INTERNAL}}` | No | Shows all access fields |
| `INTERNAL_DAV` | `{{i18n.PatientDataType.INTERNAL_DAV}}` | No | Shows all access fields |
| `INTERNAL_POST` | `{{i18n.PatientDataType.INTERNAL_POST}}` | No | Shows all access fields |
| `EXTERNAL` | `{{i18n.PatientDataType.EXTERNAL}}` | No | Shows all access fields |
| `EXTERNAL_BASISWEB` | `{{i18n.PatientDataType.EXTERNAL_BASISWEB}}` | No | Shows all access fields |

##### MedicationType Enum Values

| Value | i18n key |
|-------|----------|
| `ROTE_LISTE` | `{{i18n.MedicationType.ROTE_LISTE}}` |
| `WALDAPOTHEKE` | `{{i18n.MedicationType.WALDAPOTHEKE}}` |

---

#### A6.2 Tab 2: Additional / Address (`#tabAdditional`)

##### Form Elements

| # | Name | Placeholder / Label | Datamodel | Type | Options | Required | Notes |
|---|------|-------------------|-----------|------|---------|----------|-------|
| 1 | `data.address` | `{{i18n.contact.address}}` | `address` | Text | — | No | Street address line 1 |
| 2 | `data.address2` | `{{i18n.contact.street2}}` | `address2` | Text | — | No | Street address line 2 |
| 3 | `data.zip` | `{{i18n.contact.zipcode}}` | `zip` | Autocomplete (zip lookup) | `ZipCodeService.get` | No | CSS class `searchZipCode` triggers auto-fill |
| 4 | `data.state` | `{{i18n.contact.state}}` | `state` | Text | — | No | Auto-filled by zip lookup |
| 5 | `data.city` | `{{i18n.contact.city}}` | `city` | Text | — | No | Auto-filled by zip lookup |
| 6 | `data.country` | `{{i18n.contact.country}}` | `country` | Autocomplete | `CountryService` via `countrySelect` class | No | Icon: `fa-globe` |
| 7 | `data.building` | `{{i18n.location.building}}` | `building` | Text | — | No | Building name/number |
| 8 | `data.latitude` | `{{i18n.location.latitude}}` | `latitude` | Text | — | No | Auto-filled by geocoding |
| 9 | `data.longitude` | `{{i18n.location.longitude}}` | `longitude` | Text | — | No | Auto-filled by geocoding |

##### Map Component

- **Leaflet map** (`#locationMap`, 400px height) using Mapbox tiles
- Default center: `[48.212, 16.38]` (Vienna, Austria)
- Marker placed at lat/lng values; updated on field change
- Double-click on map sets lat/lng fields
- Reverse geocoding via Mapbox Geocoding API on zip code select or `#searchMap` button click

---

#### A6.3 Tab 3: Rooms (`#tabRooms`)

Read-only collection table displaying rooms associated with the location.

| # | Field | Column Header (i18n) | Notes |
|---|-------|---------------------|-------|
| 1 | `rooms.name` | `{{i18n.room.name}}` | Room name |
| 2 | `rooms.number` | `{{i18n.room.number}}` | Room number |
| 3 | `rooms.description` | `{{i18n.room.description}}` | Room description |

> **Note**: The room autocomplete "add existing room" feature is commented out in the template. The collection is rendered as a `<table>` with `data-field="data.rooms"`. Adding rooms is currently disabled.

---

### A7. Click Actions (Location)

| Action ID | Element | Title / Label | English | Type | Service Call | Notes |
|-----------|---------|--------------|---------|------|-------------|-------|
| `checkConnection` | `#checkConnection` | **"check und laden"** HARDCODED (German) | Check and load | Icon button (`fa-repeat`) | `LocationService.getFolders` | Populates URL path autocomplete |
| `testConnection` | `#testConnection` | `{{i18n.location.upload.file}}` + `fa-check` | Upload file test | Button | `LocationService.testUpload` | Alert: **"Testdatei erfolgreich hochgeladen!"** HARDCODED (German) |
| `checkbackupConnection` | `#checkbackupConnection` | **"Backup Test"** HARDCODED | Backup Test | Icon button (`fa-check`) | `LocationService.getBackupFolders` | Populates backup URL autocomplete; auto-triggered on load |
| `searchMap` | `#searchMap` | — | — | Icon button (`fa-map-pin`) | Mapbox Geocoding API | Reverse geocode from address fields to lat/lng |

---

### A8. Special Components (Location)

#### Zip Code Auto-Lookup (`zipCodeLookup.js`)

- Targets any `<input class="searchZipCode">` element
- Service: `ZipCodeService.get(term)` -- autocomplete on the zip field
- On select: populates sibling `city`, `state`, `country` fields automatically
- Dropdown shows `"{zipCode} {city}"` labels
- Context resolution: walks up DOM via `.ui-dialog` > `.container` > `div`
- Also triggers `"select"` event used by `locationCreate.js` for reverse geocoding

#### Conditional Field Visibility

When `patientDataType` is changed:
- If selected option has `data-preconfigured="true"` (`INTERNAL_SECUREBOX`, `INTERNAL_VCCLOUD`): hides `.preconfigured` elements (Host/URL, user/password fields)
- Otherwise: shows those fields

#### Mapbox Integration

- Uses Mapbox GL / Leaflet with static access token (hardcoded in JS)
- Geocoding endpoint: `https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json`
- Tile layer: `mapbox/streets-v11`

---

## Part B: Customer User Management Page (`user.htmlm`)

---

### B1. Block Title & Visualization

| Attribute | Value |
|-----------|-------|
| Block ID | `profiles` |
| CSS class | `tableView` |
| Icon | — |
| Color | — |
| Default filter | `[{"type":"CUSTOMER"}, 500]` (via `data-filter` attribute) |
| CRUD config | `Core.initCrud` with `serviceName: "UserService"`, `getMethod: "get"`, `onCreate: {enabled: true, role: "KUNDE"}` |
| Grid mode | `fullscreen: true` via `slickerGrid` |

---

### B2. HTMLM Header Metadata

#### Variables

| Field | Method | Value |
|-------|--------|-------|
| `usePanel` | `variable` | `true` |
| `nav` | `variable` | Filter **disabled** (`filter: false`), toolbar buttons (see B3) |

#### Template Includes

| Field | Method | Template Path |
|-------|--------|---------------|
| `navBar` | `template` | `../_include/navbar.mustache` |
| `passwordDlg` | `template` | `../admin/password.mustache` |

#### Option Sources

| Field | Service | Method | Style | Value Key | Content Key | Data |
|-------|---------|--------|-------|-----------|-------------|------|
| `skills` | `SkillService` | `getAll` | `CHECKBOX` | `code` | `code` | `pojo` |
| `groups` | `GroupService` | `getAll` | `OPTION` | `id` | `name` | `pojo` |

#### Script Includes

| Script |
|--------|
| `/customer/user.js` |
| `/customer/messages.i18n.js` |
| `/profile/messages.i18n.js` |
| `/profile/profile.js` (loaded inside the detail div) |

---

### B3. Toolbar (Nav Buttons)

| # | ID | Name (i18n key) | Icon | Disabled (initial) | Auth / Role Gate | Purpose (from JS) |
|---|-----|-----------------|------|---------------------|------------------|--------------------|
| 1 | `addMenuBtn` | `action.add` | `plus-square` | `false` | — | Add new user (defaults to role `KUNDE`) |
| 2 | `editMenuBtn` | `action.change` | `pencil` | `true` | — | Edit selected user |
| 3 | `deleteMenuBtn` | `action.delete` | `trash` | `true` | — | Delete selected user |
| — | *(spacer)* | — | — | — | — | — |
| 4 | `sendPasswordMenuBtn` | `user.password` | `lock-alt` | `true` | — | Send password reset email to selected user |

**Filter toggle**: `filter: false` -- no filter panel on this page.

---

### B4. Grid / Table Columns

Defined programmatically in `user.js` `columns` array (not via HTML `data-*` attributes).

| # | `field` | `name` (i18n variable) | `width` | `formatter` | Notes |
|---|---------|----------------------|---------|-------------|-------|
| 1 | `id` | **"id"** HARDCODED | *(default)* | — | Row ID |
| 2 | `username` | `i18n.user_username` | 430 | — | Username |
| 3 | `email` | `i18n.user_email` | 180 | — | Email |
| 4 | `customers` | `i18n.customer` | 330 | `Formatter.names` | Array of customer objects rendered by name |
| 5 | `role` | `i18n.user_role` | 170 | `Formatter.userRole` | Enum to i18n label |
| 6 | `firstName` | `i18n.user_firstName` | 100 | — | From `userProfile` (flattened) |
| 7 | `lastName` | `i18n.user_lastName` | 100 | — | From `userProfile` (flattened) |
| 8 | `enabled` | `i18n.userEnabled` | 60 | `Formatter.bool` | Boolean display |

**Grid data source** (from JS):
- Service: `UserService`
- Method: `getAll`
- Params: `[{"type":"CUSTOMER"}, 500]` (hardcoded filter for customer users, max 500)
- Data processing: Flattens `userProfile` fields onto each row object (`firstName`, `lastName`, etc.)
- Settings persistence: `UserService.saveSetting` keyed by `#gridSetting` `data-code`

#### Formatter Details

| Formatter | Behavior |
|-----------|----------|
| `Formatter.names` | Renders array of objects by their `.name` property |
| `Formatter.userRole` | Maps enum (e.g. `KUNDE`) to `i18n.user_role_{VALUE}` |
| `Formatter.bool` | Standard boolean display |

---

### B5. User Create/Edit Detail Panel

The detail panel is embedded directly in `user.htmlm` (not a separate mustache template). It reuses profile form patterns from `profile/profile.js`.

#### Detail Meta

| Attribute | Value |
|-----------|-------|
| CSS class | `detail profileData` |
| Icon | `fa fa-user-tie` |
| Width | `1000` px |
| Color | `bg-color-staff` |
| Title | `{{i18n.user}}` |

#### Tab Structure

| Tab # | Tab ID | Title | Icon | Permission | Description |
|-------|--------|-------|------|------------|-------------|
| 1 | `profile-main` | *(icon only)* | `fas fa-address-card` | — | Main profile info |
| 2 | `profile-address` | *(icon only)* | `far fa-home` | — | Address & personal data |
| 3 | `profile-admin` | *(icon only)* | `far fa-cogs` | **`{{#isAdmin}}`** | Admin-only: role, enabled, locked |

---

#### B5.1 Tab 1: Main Profile (`#profile-main`)

##### Form Elements

| # | Name | Label / Placeholder | Datamodel | Type | Options | Required | Read-only | Notes |
|---|------|-------------------|-----------|------|---------|----------|-----------|-------|
| 1 | *(profile picture)* | — | — | File upload | `UserService.updateThumbnail` | No | No | `#uploadProfilePicture` file input, card with `#uploadedPicture` img |
| 2 | `data.username` | `{{i18n.user.username}}` | `username` | Text | — | No | **Yes** (`readonly`) | — |
| 3 | `data.customers` | `{{i18n.customer}}` | `customers[]` | Collection (list) | `CustomerService.autocomplete` via `customerSelect` | No | No | Add/remove customer associations; shows name + delete icon |
| 4 | `data.userProfile.notificationPerMail` | `{{i18n.user.notificationPerMail}}` | `userProfile.notificationPerMail` | Checkbox (switch) | — | No | No | Boolean toggle |
| 5 | `data.userProfile.firstName` | `{{i18n.user.firstName}}` | `userProfile.firstName` | Text | — | No | No | — |
| 6 | `data.userProfile.lastName` | `{{i18n.user.lastName}}` | `userProfile.lastName` | Text | — | No | No | — |
| 7 | `data.userProfile.cellularNumber` | `{{i18n.contact.cellularnumber}}` | `userProfile.cellularNumber` | Text (regex validated) | Regex: `[0-9 .)(\[\]+-/]{5,}` | No | No | Icon: `fa-mobile-alt` |
| 8 | `data.email` | `{{i18n.contact.primaryemail}}` | `email` | Text (email regex) | Regex: `[a-zA-Z0-9._%-]+@[a-zA-Z0-9._%-]+\.[a-zA-Z]+` | **Yes** (`mandatory`) | No | Icon: `@` |

---

#### B5.2 Tab 2: Address (`#profile-address`)

##### Form Elements

| # | Name | Label (i18n) | Datamodel | Type | Options | Required | Notes |
|---|------|-------------|-----------|------|---------|----------|-------|
| 1 | `data.userProfile.ssn` | `{{i18n.contact.ssn}}` | `userProfile.ssn` | Text | SSN validation (Austrian/German) | No | CSS class `checkSSN`; auto-fills birthday on valid SSN |
| 2 | `data.userProfile.birthday` | `{{i18n.contact.birthday}}` | `userProfile.birthday` | Date | — | No | CSS class `date` |
| 3 | `data.userProfile.birthPlace` | `{{i18n.contact.birthplace}}` | `userProfile.birthPlace` | Text | — | No | — |
| 4 | `data.userProfile.nationality` | `{{i18n.contact.nationality}}` | `userProfile.nationality` | Autocomplete | `CountryService` via `countrySelect` | No | — |
| 5 | `data.homeAddress` | `{{i18n.contact.address}}` | `homeAddress` | Text | — | No | — |
| 6 | `data.userProfile.homeHouse` | `{{i18n.contact.house}}` | `userProfile.homeHouse` | Text | — | No | Small width |
| 7 | `data.userProfile.homeLevel` | `{{i18n.contact.level}}` | `userProfile.homeLevel` | Text | — | No | Small width |
| 8 | `data.userProfile.homeApt` | `{{i18n.contact.apt}}` | `userProfile.homeApt` | Text | — | No | Small width |
| 9 | `data.homeZipCode` | `{{i18n.contact.zipcode}}` | `homeZipCode` | Autocomplete (zip lookup) | `ZipCodeService.get` | No | CSS class `searchZipCode` |
| 10 | `data.homeCity` | `{{i18n.contact.city}}` | `homeCity` | Text | — | No | Auto-filled by zip lookup |
| 11 | `data.homeState` | `{{i18n.contact.state}}` | `homeState` | Text | — | No | Auto-filled by zip lookup |
| 12 | `data.homeCountry` | `{{i18n.contact.country}}` | `homeCountry` | Text | — | No | Auto-filled by zip lookup |

---

#### B5.3 Tab 3: Admin (`#profile-admin`) -- `{{#isAdmin}}` only

##### Form Elements

| # | Name | Label (i18n) | Datamodel | Type | Options | Required | Notes |
|---|------|-------------|-----------|------|---------|----------|-------|
| 1 | `data.role` | `{{i18n.user.role}}` | `role` | Select | See role enum below | No | — |
| 2 | `data.enabled` | `{{i18n.userEnabled}}` | `enabled` | Select (boolean) | `true` = `{{i18n.userEnabled.yes}}`, `false` = `{{i18n.userEnabled.no}}` | No | CSS class `bool` |
| 3 | `data.accountLocked` | `{{i18n.user.locked}}` | `accountLocked` | Select (boolean) | `true` = `{{i18n.label.yes}}`, `false` = `{{i18n.label.no}}` | No | CSS class `bool` |

##### Role Enum Values

| Value | i18n key |
|-------|----------|
| `REGISTERED` | `{{i18n.user.role.REGISTERED}}` |
| `STANDARD` | `{{i18n.user.role.STANDARD}}` |
| `LEITER_INTERN` | `{{i18n.user.role.LEITER_INTERN}}` |
| `ADMIN_INTERN` | `{{i18n.user.role.ADMIN_INTERN}}` |
| `KUNDE` | `{{i18n.user.role.KUNDE}}` |
| `ADMIN_KUNDE` | `{{i18n.user.role.ADMIN_KUNDE}}` |
| `ADMIN` | `{{i18n.user.role.ADMIN}}` |

---

### B6. Permissions

| Element / Section | Condition | Effect |
|-------------------|-----------|--------|
| Admin tab (`#profile-admin`) | `{{#isAdmin}}` | Entire tab (including nav tab link) is only rendered for admin users |
| Role, enabled, locked fields | `{{#isAdmin}}` | Only admin users can change role/enabled/locked state |

---

### B7. Send Password Dialog (`admin/password.mustache`)

Embedded via `{{>passwordDlg}}` at the bottom of `user.htmlm`.

| Attribute | Value |
|-----------|-------|
| Dialog ID | `sendPassword` |
| Title | **"Password Senden"** HARDCODED (German) |
| Target | `modal` |
| Init | `Dialog.init("#sendPassword")` in `password.js` |

#### Dialog Content (all HARDCODED German)

| Element | Text | English Translation |
|---------|------|-------------------|
| Description | **"Folgender Benutzer wird ein E-Mail mit einem Neuen Password bekommen:"** | "The following user will receive an email with a new password:" |
| Username label | **"User"** | "User" |
| Username value | `data.username` (field binding) | — |
| Email label | **"E-Mail"** | "E-Mail" |
| Email value | `data.email` (field binding) | — |
| Warning | **"Es wird ein neues Passwort erstellt. Das Alte ist nicht mehr gültig!"** | "A new password will be created. The old one is no longer valid!" |

**Trigger**: `#sendPasswordMenuBtn` click opens the dialog, pre-filled with selected row's `username` and `email`.

---

### B8. Click Actions (User)

| Action ID | Element | Title / Label | English | Type | Service Call | Notes |
|-----------|---------|--------------|---------|------|-------------|-------|
| `addMenuBtn` | Toolbar | `action.add` | Add | Button | `UserService` (CRUD create) | New user defaults: `enabled: true, role: "KUNDE"` |
| `editMenuBtn` | Toolbar | `action.change` | Change/Edit | Button | `UserService.get` (CRUD edit) | Enabled on row select |
| `deleteMenuBtn` | Toolbar | `action.delete` | Delete | Button | `UserService` (CRUD delete) | Enabled on row select |
| `sendPasswordMenuBtn` | Toolbar | `user.password` | Password | Button | Opens `#sendPassword` dialog | Enabled on row select; fills dialog with selected user data |

---

### B9. Special Components (User)

#### SSN Validation (`checkSSN` function in `profile.js`)

- Validates Austrian (9 or 10 digit) and German (12 digit) social security numbers
- Austrian: Weighted checksum validation (modulo 11)
- German: Direct extraction (no checksum)
- On valid SSN: auto-fills birthday field from encoded date digits

#### Customer Collection (Multi-select)

- `data.customers` rendered as `<ul class="collection">` with `<li>` items showing `customers.name` and delete icon
- New customers added via autocomplete input (`CustomerService.autocomplete`, display=`name`)
- Delete removes customer from the collection

#### Profile Picture Upload

- File upload via `#uploadProfilePicture` file input
- Uploads to `UserService.updateThumbnail`
- Image displayed in card at `/get/UserService/getImage/{userId}/thumbnail.jpg`
- Rotate functionality via `#rotatePic` (calls `UserService.rotateThumbnail`)

---

## Translation Table

### Location Page

| Text-Reference | German (inferred) | English | Notes |
|----------------|-------------------|---------|-------|
| `label.id` | ID | ID | Grid column + form field |
| `label.name` | Name | Name | Grid column + form field |
| `contact.type` | Typ | Type | Grid column |
| `customer` | Kunde | Customer | Grid column + autocomplete |
| `patientDataType` / `PatientDataType` | Patientendatentyp | Patient Data Type | Grid column + form select |
| `patientDataAccess` | Patientendatenzugriff | Patient Data Access | Grid column |
| `contact.state` | Bundesland | State | Grid column + form field |
| `contact.primaryemail` | E-Mail | Primary Email | Grid column |
| `location.address` | Adresse | Address | Grid column + filter |
| `location.zip` | PLZ | Zip Code | Grid column |
| `location.city` | Stadt/Ort | City | Grid column |
| `location.country` | Land | Country | Grid column |
| `location.phone` | Telefon | Phone | Filter field |
| `location` | Standort | Location | Dialog title |
| `contact` | Kontakt | Contact | Tab title |
| `contact.private` | Privat | Private/Additional | Tab title |
| `room` | Raum | Room | Tab title |
| `location.externalId` | Externe ID | External ID | Form field |
| `PatientDataType.INTERNAL_SECUREBOX` | Intern SecureBox | Internal SecureBox | Enum option |
| `PatientDataType.INTERNAL_VCCLOUD` | Intern VC-Cloud | Internal VC-Cloud | Enum option |
| `PatientDataType.INTERNAL` | Intern | Internal | Enum option |
| `PatientDataType.INTERNAL_DAV` | Intern DAV | Internal DAV | Enum option |
| `PatientDataType.INTERNAL_POST` | Intern Post | Internal Post | Enum option |
| `PatientDataType.EXTERNAL` | Extern | External | Enum option |
| `PatientDataType.EXTERNAL_BASISWEB` | Extern BasisWeb | External BasisWeb | Enum option |
| `MedicationType` | Medikationstyp | Medication Type | Form label |
| `MedicationType.ROTE_LISTE` | Rote Liste | Rote Liste | Enum option |
| `MedicationType.WALDAPOTHEKE` | Waldapotheke | Waldapotheke | Enum option |
| `book.number` | Buchnummer | Book Number | Form field |
| `location.path` | Pfad | Path | Form field |
| `location.check.label` | Aktiv | Active / Check Label | Checkbox label |
| `location.upload.file` | Datei hochladen | Upload File | Button label |
| `location.building` | Gebäude | Building | Form field |
| `location.latitude` | Breitengrad | Latitude | Form field |
| `location.longitude` | Längengrad | Longitude | Form field |
| `location.contact` | Kontaktperson | Contact Person | Section label |
| `location.contactMedical` | Medizinischer Kontakt | Medical Contact | Section label |
| `location.representative` | Ansprechpartner | Representative | Form placeholder |
| `contact.workphone` | Telefon (Arbeit) | Work Phone | Form placeholder |
| `contact.faxnumber` | Fax | Fax Number | Form placeholder |
| `contact.email` | E-Mail | Email | Form placeholder |
| `contact.address` | Adresse | Address | Form field |
| `contact.street2` | Adresszeile 2 | Street Line 2 | Form field |
| `contact.zipcode` | PLZ | Zip Code | Form field |
| `contact.city` | Stadt/Ort | City | Form field |
| `contact.country` | Land | Country | Form field |
| `address.uid` | UID | UID (VAT Number) | Form field |
| `address.iban` | IBAN | IBAN | Form field |
| `address.bank` | Bank | Bank | Form field |
| `address.bic` | BIC | BIC | Form field |
| `login.password` | Passwort | Password | Form field |
| `room.name` | Raumname | Room Name | Table column |
| `room.number` | Raumnummer | Room Number | Table column |
| `room.description` | Beschreibung | Description | Table column |
| `button.apply` | Anwenden | Apply | Filter button |
| `button.reset` | Zurücksetzen | Reset | Filter button |
| `filter.results` | Ergebnisse | Results | Filter select title |

### User Page

| Text-Reference | German (inferred) | English | Notes |
|----------------|-------------------|---------|-------|
| `user` | Benutzer | User | Dialog title |
| `user.username` | Benutzername | Username | Form label |
| `user.firstName` | Vorname | First Name | Form label + grid column |
| `user.lastName` | Nachname | Last Name | Form label + grid column |
| `user.email` | E-Mail | Email | Grid column (via i18n variable) |
| `user.role` | Rolle | Role | Form label + grid column |
| `user.role.REGISTERED` | Registriert | Registered | Role enum |
| `user.role.STANDARD` | Standard | Standard | Role enum |
| `user.role.LEITER_INTERN` | Leiter Intern | Internal Leader | Role enum |
| `user.role.ADMIN_INTERN` | Admin Intern | Internal Admin | Role enum |
| `user.role.KUNDE` | Kunde | Customer | Role enum |
| `user.role.ADMIN_KUNDE` | Admin Kunde | Customer Admin | Role enum |
| `user.role.ADMIN` | Admin | Admin | Role enum |
| `userEnabled` | Aktiv | Enabled | Form label + grid column |
| `userEnabled.yes` | Ja | Yes | Enabled option |
| `userEnabled.no` | Nein | No | Enabled option |
| `user.locked` | Gesperrt | Locked | Form label |
| `user.password` | Passwort | Password | Toolbar button label |
| `user.notificationPerMail` | E-Mail-Benachrichtigung | Notification per Mail | Checkbox label |
| `contact.ssn` | Sozialversicherungsnummer | Social Security Number | Form label |
| `contact.birthday` | Geburtstag | Birthday | Form label |
| `contact.birthplace` | Geburtsort | Birthplace | Form label |
| `contact.nationality` | Nationalität | Nationality | Form label |
| `contact.cellularnumber` | Mobilnummer | Cellular Number | Form placeholder |
| `contact.house` | Haus | House | Form placeholder |
| `contact.level` | Stock | Level/Floor | Form placeholder |
| `contact.apt` | Top/Wohnung | Apartment | Form placeholder |
| `contact.address2` | Adresse 2 | Address Line 2 | Form label |
| `label.yes` | Ja | Yes | Generic option |
| `label.no` | Nein | No | Generic option |

### Hardcoded Strings (require migration to i18n)

| Location | String | Language | Context |
|----------|--------|----------|---------|
| `locationCreate.mustache` L47 | `"E-Mail"` | English/German | patientDataAccess email placeholder |
| `locationCreate.mustache` L49 | `"Subject"` | English | patientDataAccess subject placeholder |
| `locationCreate.mustache` L53 | `"Host/Url"` | English | patientDataAccess host placeholder |
| `locationCreate.mustache` L59 | `"check und laden"` | German | checkConnection button title |
| `locationCreate.mustache` L72 | `"VC-Cloud Backup"` | English | Section header text |
| `locationCreate.mustache` L75 | `"Backup {{i18n.location.path}}"` | Mixed | Backup URL placeholder |
| `locationCreate.mustache` L98 | `"Sip Accounts"` | English | Collection label |
| `locationCreate.js` L116 | `"Testdatei erfolgreich hochgeladen!"` | German | Alert message |
| `password.mustache` L3 | `"Password Senden"` | German | Dialog title |
| `password.mustache` L5 | Full German description text | German | Dialog body |
| `password.mustache` L9 | `"Es wird ein neues Passwort erstellt..."` | German | Warning text |
| `user.js` L53 | `"id"` | — | Column name (trivial) |

---

## Data Model Summary

### Location Entity

```
Location {
  id: number
  foreignId: string
  externalId: string
  name: string (required)
  type: LocationType (object: {name})
  customer: Customer (object: {name}) (required)
  patientDataType: PatientDataType (enum)
  patientDataAccess: {
    email: string
    subject: string
    host: string
    user: string
    password: string
    url: string
    active: boolean
    backupUrl: string
  }
  booknumberMask: string
  medicationType: MedicationType (enum)
  externalDescription: string (markdown)
  sipAccounts: [{number: string}]
  representative: string
  phone: string
  fax: string
  uid: string
  iban: string
  bank: string
  bic: string
  contactMedical: string
  sip1: string
  sip2: string
  sipMobile: string
  phoneMedical: string
  emailMedical: string
  address: string
  address2: string
  zip: string
  state: string
  city: string
  country: string
  building: string
  latitude: number
  longitude: number
  rooms: [{name, number, description}]
  // Grid-only (denormalized):
  typeName: string
  customerName: string
  email: string (from contact?)
}
```

### User Entity (Customer context)

```
User {
  id: number
  username: string (read-only)
  email: string (required)
  role: UserRole (enum)
  enabled: boolean
  accountLocked: boolean
  customers: [{name, id}] (collection)
  userProfile: {
    firstName: string
    lastName: string
    cellularNumber: string
    notificationPerMail: boolean
    ssn: string
    birthday: date
    birthPlace: string
    nationality: string
    homeHouse: string
    homeLevel: string
    homeApt: string
  }
  homeAddress: string
  homeZipCode: string
  homeCity: string
  homeState: string
  homeCountry: string
}
```

---

## Wireframe Reference (ASCII)

### Location Management

> Full wireframe: [`specs/wireframes/customer/workflows.md#w2-location-management`](../../../wireframes/customer/workflows.md#w2-location-management)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▌Locations                                                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [+ Add] [✎ Edit] [🗑 Delete] [⚙ Filter]                                    │
├────┬────────┬────┬──────────┬──────────┬──────────┬──────┬──────┬────┬─────┤
│ ID │ Name   │Type│ Customer │ PDType   │ PDAcc    │State │Email │Addr│ Zip │
├────┼────────┼────┼──────────┼──────────┼──────────┼──────┼──────┼────┼─────┤
│  1 │ Loc-A  │ -- │ JVA Berl │ 📁INT   │ 📂✓     │ BE   │a@..  │... │ 10  │
│  2 │ Loc-B  │ -- │ JVA Hamb │ 📧EXT   │ ✉       │ HH   │b@..  │... │ 20  │
├────┴────────┴────┴──────────┴──────────┴──────────┴──────┴──────┴────┴─────┤
│ Filter: Name [___] Address [___] Phone [___] Max [100▾]                     │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Location Detail (900px) ─────────────────────────────────────────────────┐
│  [Tab 1: Contact] [Tab 2: Address] [Tab 3: Rooms (RO)]                    │
├───────────────────────────────────────────────────────────────────────────┤
│  Tab 1: Contact (~31 fields)                                              │
│  Type [autocomplete] Name* [____] ForeignId [___] ExternalId [___]        │
│  Customer* [autocomplete 🏢]                                              │
│  ┌─ Patient Data Access ─────────────────────────────────────────┐        │
│  │ PatientDataType [select ▾]        Email [___] Subject [___]   │        │
│  │ [cond: patientDataType != PRECONFIGURED]:                     │        │
│  │   Host/URL [___] User [___] Password [___]                    │        │
│  │   [Test Connection] → Path [autocomplete] → [Test Upload]     │        │
│  │   Active [toggle]  Backup Path [___] → [Test Backup]          │        │
│  └───────────────────────────────────────────────────────────────┘        │
│  Medication Type [select] Book Number Mask [___]                          │
│  External Description [textarea/markdown]                                 │
│  SIP Accounts [repeats]: [📞+] Number [___] [🗑]                          │
│  Representative [___] Phone [___] Fax [___]                               │
│  UID [___] IBAN [___] Bank [___] BIC [___]                                │
│  Medical Contact [___] SIP1 [___] SIP2 [___] SIP Mobile [___]            │
│  Phone Medical [___] Email Medical [___]                                  │
│                                                                           │
│  Tab 2: Address                                                           │
│  Street [_____] Street2 [_____] Building [___]                            │
│  Zip [____] → City [auto] State [auto] Country [autocomplete 🌐]          │
│  [autofill: ZipCodeService]                                               │
│  Latitude [___] Longitude [___]                                           │
│  ┌─ Leaflet Map (400px) ──────────────────────────┐                       │
│  │  [integration: Leaflet/Mapbox]                  │                       │
│  │  📍 Double-click → sets lat/lng                 │                       │
│  │  [🔍 Search] → reverse geocode                  │                       │
│  └─────────────────────────────────────────────────┘                       │
│                                                                           │
│  Tab 3: Rooms [RO]                                                        │
│  ┌──────────┬──────────┬──────────────────┐                               │
│  │ Name     │ Number   │ Description      │                               │
│  ├──────────┼──────────┼──────────────────┤                               │
│  │ Room A   │ 101      │ Main consult.    │                               │
│  └──────────┴──────────┴──────────────────┘                               │
│                                            [Cancel] [Save]                │
└───────────────────────────────────────────────────────────────────────────┘
```

### Customer User Management

> Part of wireframe W2 (location-management.pen includes user management context)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ▌Customer Users                              Default filter: type=CUSTOMER  │
├─────────────────────────────────────────────────────────────────────────────┤
│ [+ Add] [✎ Edit] [🗑 Delete] | [🔑 Send Password]                          │
├────┬──────────┬──────────┬──────────┬──────┬───────┬────────┬──────────────┤
│ ID │ Username │ Email    │ Customer │ Role │ First │ Last   │ Enabled      │
├────┼──────────┼──────────┼──────────┼──────┼───────┼────────┼──────────────┤
│  1 │ user1    │ u@email  │ JVA Berl │KUNDE │ Max   │ Muster │ ✓            │
├────┴──────────┴──────────┴──────────┴──────┴───────┴────────┴──────────────┤
│ Max 500 results                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─ Customer User Detail (1000px) ───────────────────────────────────────────┐
│  [Tab 1: 🪪 Main] [Tab 2: 🏠 Address] [Tab 3: ⚙ Admin*]  *[admin-only]  │
├───────────────────────────────────────────────────────────────────────────┤
│  Tab 1: Main                                                              │
│  [Profile Picture 📷]  Username [RO on edit]                              │
│  Customers [collection: add via autocomplete, remove via 🗑]               │
│  Notification Per Mail [toggle]                                           │
│  Email* [___]  First Name [___]  Last Name [___]  Cell [___]              │
│                                                                           │
│  Tab 2: Address                                                           │
│  SSN [____] → [checkSSN: AT/DE format → auto-fill birthday]              │
│  Birthday [📅]  Birthplace [___]  Nationality [autocomplete 🌐]           │
│  Address [___] House [_] Level [_] Apt [_]                                │
│  Zip [____] → City [auto] State [auto] Country [auto]                     │
│                                                                           │
│  Tab 3: Admin [cond: role == ADMIN]                                       │
│  Role [select ▾]  Enabled [select ▾]  Locked [select ▾]                   │
│                                            [Cancel] [Save]                │
└───────────────────────────────────────────────────────────────────────────┘
```
