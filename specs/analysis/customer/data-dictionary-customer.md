# Data Dictionary — Customer

This document maps UI elements from the Customer domain to their underlying MongoDB data models.

## Abstract Data Types

See the [Central Data Dictionary Index](../data-dictionary-index.md) for the mapping of UI elements to abstract data types.

---

## 1. Customer List & Detail (`customer/index.htmlm`)

Source: `specs/analysis/customers/customer-list-detail.md`

### 1.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `data.id` | `customer._id` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `number` | `text` | — | No | Yes | — |
| Name | Name | `data.name` | `customer.name` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | Yes | — |
| Bank | Bank | `data.bank` | `customer.bank` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | Yes | Hardcoded "Bank" in legacy |
| State | Bundesland | `data.state` | `customer.state` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | Yes | — |
| Representative | Ansprechpartner | `data.representative` | `customer.representative` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | Yes | — |
| Primary Email | E-Mail | `data.email` | `customer.email` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | Yes | — |
| Work Phone | Telefon (Arbeit) | `data.phone` | `customer.phone2` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | Yes | Grid says workphone, maps to phone2 ideally, legacy mapped `phone` |

### 1.2 Form Elements — Tab 1: Contact (`tabContact`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Customer Name | Kundenname | `data.name` | `customer.name` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | Yes | No | — |
| Primary Email | E-Mail | `data.email` | `customer.email` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `email` | — | No | No | Regex validated |
| Webpage | Webseite | `data.webpage` | `customer.webpage` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| UID (VAT ID) | UID | `data.uid` | `customer.uid` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| IBAN | IBAN | `data.iban` | `customer.iban` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| Bank | Bank | `data.bank` | `customer.bank` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| BIC | BIC | `data.bic` | `customer.bic` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| Representative | Ansprechpartner | `data.representative` | `customer.representative` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| Cellular Number | Mobiltelefon | `data.phone` | `customer.phone` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| Work Phone | Telefon (Arbeit) | `data.phone2` | `customer.phone2` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| Fax Number | Fax | `data.faxNumber` | `customer.faxNumber` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |

### 1.3 Form Elements — Tab 2: Home/Private (`tabPrivate`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Street | Strasse | `data.address` | `customer.address` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| Street Line 2 | Adresszeile 2 | `data.address2` | `customer.address2` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | — |
| Zip Code | PLZ | `data.zip` | `customer.zip` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `autocomplete` | `ZipCodeService.get` | No | No | Auto-fills city, state, country |
| State | Bundesland | `data.state` | `customer.state` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | Auto-filled by zip lookup |
| City | Stadt / Ort | `data.city` | `customer.city` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | Auto-filled by zip lookup |
| Country | Land | `data.country` | `customer.country` | [customer.md#customer](../mongodb-mapping/customer.md#entity-kunden-customers) | `string` | `text` | — | No | No | Auto-filled by zip lookup |

### 1.4 Form Elements — Tab 3: Billing (`tabBilling`) (Admin Only)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Price List (Add) | Preisliste | `data.priceLists` | `customer.priceLists` | [customer.md#customerpricelist](../mongodb-mapping/customer.md#sub-entity-customerpricelist) | `collection` | `autocomplete` | `JobPriceListService.autocomplete` | No | No | Adds new row to collection |
| Price List | Preisliste | `priceLists.priceList.name` | `customer.priceLists.priceList.name` | [customer.md#customerpricelist](../mongodb-mapping/customer.md#sub-entity-customerpricelist) | `string` | `text` | — | No | Yes | Displayed in collection row |
| Start | Start | `priceLists.start` | `customer.priceLists.start` | [customer.md#customerpricelist](../mongodb-mapping/customer.md#sub-entity-customerpricelist) | `date` | `date` | — | No | No | — |
| Until | Bis | `priceLists.until` | `customer.priceLists.until` | [customer.md#customerpricelist](../mongodb-mapping/customer.md#sub-entity-customerpricelist) | `date` | `date` | — | No | No | — |
| Comment | Kommentar | `priceLists.comment` | `customer.priceLists.comment` | [customer.md#customerpricelist](../mongodb-mapping/customer.md#sub-entity-customerpricelist) | `string` | `text` | — | No | No | — |
| Delete Action | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Delete price list row |
| Job/Service | Leistung | `discounts.job` | `customer.discounts.job` | [customer.md#customerdiscount](../mongodb-mapping/customer.md#sub-entity-customerdiscount) | `reference:jobId` | `select` | `JobService.getAllOptions` | Yes | No | — |
| Rebate/Discount | Rabatt | `discounts.discount` | `customer.discounts.discount` | [customer.md#customerdiscount](../mongodb-mapping/customer.md#sub-entity-customerdiscount) | `number` | `percent` | — | Yes | No | — |
| Start | Start | `discounts.dateStart` | `customer.discounts.dateStart` | [customer.md#customerdiscount](../mongodb-mapping/customer.md#sub-entity-customerdiscount) | `date` | `date` | — | No | No | — |
| End | Ende | `discounts.dateUntil` | `customer.discounts.dateUntil` | [customer.md#customerdiscount](../mongodb-mapping/customer.md#sub-entity-customerdiscount) | `date` | `date` | — | No | No | — |
| Comment | Kommentar | `discounts.comment` | `customer.discounts.comment` | [customer.md#customerdiscount](../mongodb-mapping/customer.md#sub-entity-customerdiscount) | `string` | `text` | — | No | No | — |
| Delete Action | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Delete discount row |

### 1.5 Workflow Buttons

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Add | Hinzufügen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Add new customer |
| Change | Bearbeiten | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Edit selected customer |
| Delete | Löschen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Delete selected customer |

---

## 2. Location Management (`customer/location.htmlm`)

Source: `specs/analysis/customers/location-and-users.md`

### 2.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `foreignId` | `location.foreignId` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |
| Name | Name | `name` | `location.name` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |
| Type | Typ | `typeName` | `location.type` (resolved) | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | Resolved locationType |
| Customer | Kunde | `customerName` | `location.customer` (resolved) | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | Resolved customer name |
| Patient Data Type | Patientendatentyp | `patientDataType` | `location.patientDataType` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `enum:PatientDataType` | `text` | — | No | Yes | Formatter used |
| Patient Data Access | Patientendatenzugriff | `patientDataAccess` | `location.patientDataAccess` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `object` | `icon` | — | No | Yes | Displays folder/envelope icons |
| State | Bundesland | `state` | `location.state` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |
| Primary Email | E-Mail | `email` | `location.emailMedical` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |
| Address | Adresse | `address` | `location.address` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |
| Zip Code | PLZ | `zip` | `location.zip` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |
| City | Stadt/Ort | `city` | `location.city` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |
| Country | Land | `country` | `location.country` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | Yes | — |

### 2.2 Filter Panel

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `location.name` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | Search filter |
| Address | Adresse | `data.address` | `location.address` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | Search filter |
| Phone | Telefon | `data.phone` | `location.phone` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | Search filter |

### 2.3 Form Elements — Tab 1: Contact (`#tabContact`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Location | Standort | `data.type` | `location.type` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `reference:locationType` | `autocomplete` | `LocationTypeService.autocomplete` | No | No | Location Type |
| Name | Name | `data.name` | `location.name` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | Yes | No | — |
| ID | ID | `data.foreignId` | `location.foreignId` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | External reference ID |
| External ID | Externe ID | `data.externalId` | `location.externalId` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Customer | Kunde | `data.customer` | `location.customer` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `reference:customer` | `autocomplete` | `CustomerService.autocomplete` | Yes | No | — |
| Patient Data Type | Patientendatentyp | `data.patientDataType` | `location.patientDataType` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `enum:PatientDataType` | `select` | INTERNAL_SECUREBOX, VCCLOUD, INTERNAL, EXTERNAL, etc. | No | No | Controls visibility of preconfigured fields |
| Book Number | Buchnummer | `data.booknumberMask` | `location.booknumberMask` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | Mask |
| E-Mail | E-Mail | `data.patientDataAccess.email` | `location.patientDataAccess.email` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `string` | `text` | — | No | No | — |
| Subject | Subject | `data.patientDataAccess.subject` | `location.patientDataAccess.subject` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `string` | `text` | — | No | No | — |
| Host/Url | Host/Url | `data.patientDataAccess.host` | `location.patientDataAccess.host` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `string` | `text` | — | No | No | Hidden when preconfigured |
| Name | Name | `data.patientDataAccess.user` | `location.patientDataAccess.user` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `string` | `text` | — | No | No | Hidden when preconfigured |
| Password | Passwort | `data.patientDataAccess.password` | `location.patientDataAccess.password` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `string` | `password` | — | No | No | Hidden when preconfigured |
| Path | Pfad | `data.patientDataAccess.url` | `location.patientDataAccess.url` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `string` | `autocomplete` | Populated by `checkConnection` | No | No | — |
| Active | Aktiv | `data.patientDataAccess.active` | `location.patientDataAccess.active` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `boolean` | `checkbox` | — | No | No | Toggle switch |
| Backup Path | Backup Pfad | `data.patientDataAccess.backupUrl` | `location.patientDataAccess.backupUrl` | [customer.md#locationpatientdataaccess](../mongodb-mapping/customer.md#sub-entity-locationpatientdataaccess) | `string` | `autocomplete` | Populated by `checkbackupConnection` | No | No | — |
| Medication Type | Medikationstyp | `data.medicationType` | `location.medicationType` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `enum:MedicationType` | `select` | ROTE_LISTE, WALDAPOTHEKE | No | No | — |
| External Description | Externe Beschreibung | `data.externalDescription` | `location.externalDescription` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `textarea` | — | No | No | Markdown |
| Sip Accounts | Sip Accounts | `data.sipAccounts` | `location.sipAccounts` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `collection` | `list` | — | No | No | Dynamic list of sip.number |
| Representative | Ansprechpartner | `data.representative` | `location.representative` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | Contact Person section |
| Work Phone | Telefon (Arbeit) | `data.phone` | `location.phone` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Fax Number | Fax | `data.fax` | `location.fax` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| UID (VAT Number) | UID | `data.uid` | `location.uid` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| IBAN | IBAN | `data.iban` | `location.iban` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Bank | Bank | `data.bank` | `location.bank` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| BIC | BIC | `data.bic` | `location.bic` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Medical Contact | Medizinischer Kontakt | `data.contactMedical` | `location.contactMedical` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | Medical Contact section |
| Work Phone | Telefon (Arbeit) | `data.sip1` | `location.sip1` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | SIP 1 |
| Work Phone | Telefon (Arbeit) | `data.sip2` | `location.sip2` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | SIP 2 |
| Work Phone | Telefon (Arbeit) | `data.sipMobile` | `location.sipMobile` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | SIP Mobile |
| Work Phone | Telefon (Arbeit) | `data.phoneMedical` | `location.phoneMedical` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Email | E-Mail | `data.emailMedical` | `location.emailMedical` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Check and load | check und laden | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `LocationService.getFolders` |
| Upload File | Datei hochladen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `LocationService.testUpload` |
| Backup Test | Backup Test | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `LocationService.getBackupFolders` |

### 2.4 Form Elements — Tab 2: Additional / Address (`#tabAdditional`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Address | Adresse | `data.address` | `location.address` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Street Line 2 | Adresszeile 2 | `data.address2` | `location.address2` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Zip Code | PLZ | `data.zip` | `location.zip` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `autocomplete` | `ZipCodeService.get` | No | No | Auto-fills city, state, country |
| State | Bundesland | `data.state` | `location.state` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| City | Stadt/Ort | `data.city` | `location.city` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Country | Land | `data.country` | `location.country` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `autocomplete` | `CountryService` | No | No | — |
| Building | Gebäude | `data.building` | `location.building` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `string` | `text` | — | No | No | — |
| Latitude | Breitengrad | `data.latitude` | `location.latitude` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `number` | `text` | — | No | No | Mapbox geocoding |
| Longitude | Längengrad | `data.longitude` | `location.longitude` | [customer.md#location](../mongodb-mapping/customer.md#entity-standorte-locations) | `number` | `text` | — | No | No | Mapbox geocoding |
| Search Map | — | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Mapbox Geocoding reverse lookup |

### 2.5 Form Elements — Tab 3: Rooms (`#tabRooms`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Room Name | Raumname | `rooms.name` | `room.name` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | No | Yes | Collection row |
| Room Number | Raumnummer | `rooms.number` | `room.number` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | No | Yes | Collection row |
| Description | Beschreibung | `rooms.description` | `room.description` (unmapped) | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | No | Yes | Collection row |

### 2.6 Workflow Buttons

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Add | Hinzufügen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Add new location |
| Change | Bearbeiten | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Edit selected location |
| Delete | Löschen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Delete selected location |

---

## 3. Customer User Management (`customer/user.htmlm`)

Source: `specs/analysis/customers/location-and-users.md`

### 3.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `user._id` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `number` | `text` | — | No | Yes | — |
| Username | Benutzername | `username` | `user.username` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | — |
| Email | E-Mail | `email` | `user.email` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | — |
| Customer | Kunde | `customers` | `user.customers` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `array` | `text` | — | No | Yes | Formatter.names |
| Role | Rolle | `role` | `user.role` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `enum:Role` | `text` | — | No | Yes | — |
| First Name | Vorname | `firstName` | `user.userProfile.firstName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | Yes | — |
| Last Name | Nachname | `lastName` | `user.userProfile.lastName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | Yes | — |
| Enabled | Aktiv | `enabled` | `user.enabled` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `text` | — | No | Yes | Boolean formatter |

### 3.2 Form Elements — Tab 1: Main Profile (`#profile-main`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Profile Picture | Profilbild | — | `user.userProfile.photo` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `reference:userFile` | `file` | `UserService.updateThumbnail` | No | No | — |
| Username | Benutzername | `data.username` | `user.username` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | — |
| Customer | Kunde | `data.customers` | `user.customers` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `collection` | `autocomplete` | `CustomerService.autocomplete` | No | No | — |
| Notification per Mail | E-Mail-Benachrichtigung | `data.userProfile.notificationPerMail` | `user.userProfile.notificationPerMail` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `boolean` | `checkbox` | — | No | No | Toggle switch |
| First Name | Vorname | `data.userProfile.firstName` | `user.userProfile.firstName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Last Name | Nachname | `data.userProfile.lastName` | `user.userProfile.lastName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Cellular Number | Mobilnummer | `data.userProfile.cellularNumber` | `user.userProfile.cellularNumber` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | Regex validated |
| Email | E-Mail | `data.email` | `user.email` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `email` | — | Yes | No | Regex validated |

### 3.3 Form Elements — Tab 2: Address (`#profile-address`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Social Security Number | Sozialversicherungsnummer | `data.userProfile.ssn` | `user.userProfile.ssn` (unmapped) | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | SSN validation auto-fills birthday |
| Birthday | Geburtstag | `data.userProfile.birthday` | `user.userProfile.birthday` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `date` | `date` | — | No | No | — |
| Birthplace | Geburtsort | `data.userProfile.birthPlace` | `user.userProfile.birthPlace` (unmapped) | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Nationality | Nationalität | `data.userProfile.nationality` | `user.userProfile.nationality` (unmapped) | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `autocomplete` | `CountryService` | No | No | — |
| Address | Adresse | `data.homeAddress` | `user.userProfile.mainAddress.address` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| House | Haus | `data.userProfile.homeHouse` | `user.userProfile.mainAddress.house` (unmapped) | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Level/Floor | Stock | `data.userProfile.homeLevel` | `user.userProfile.mainAddress.level` (unmapped) | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Apartment | Top/Wohnung | `data.userProfile.homeApt` | `user.userProfile.mainAddress.apt` (unmapped) | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Zip Code | PLZ | `data.homeZipCode` | `user.userProfile.mainAddress.zip` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `autocomplete` | `ZipCodeService.get` | No | No | Auto-fills city/state/country |
| City | Stadt/Ort | `data.homeCity` | `user.userProfile.mainAddress.city` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| State | Bundesland | `data.homeState` | `user.userProfile.mainAddress.state` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Country | Land | `data.homeCountry` | `user.userProfile.mainAddress.country` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |

### 3.4 Form Elements — Tab 3: Admin (`#profile-admin`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Role | Rolle | `data.role` | `user.role` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `enum:Role` | `select` | REGISTERED, STANDARD, LEITER_INTERN, ADMIN_INTERN, KUNDE, ADMIN_KUNDE, ADMIN | No | No | Admin only |
| Enabled | Aktiv | `data.enabled` | `user.enabled` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `select` | — | No | No | Admin only |
| Locked | Gesperrt | `data.accountLocked` | `user.accountLocked` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `select` | — | No | No | Admin only |

### 3.5 Workflow Buttons & Send Password Dialog

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Add | Hinzufügen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Add new customer user |
| Change | Bearbeiten | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Edit selected customer user |
| Delete | Löschen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Delete selected customer user |
| Password | Passwort | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Opens send password dialog |
| Send Password | Password Senden | — | — | — | `action` | `dialog` | — | — | — | **Workflow-only**: Reset password email process |

---

## 4. Contact Management (`customer/contact/contact.md`)

Source: `specs/analysis/customer/contact/contact.md`

Note: Contact grid flattens `userProfile` sub-object onto the main contact object, indicating Contacts are stored as `user` entities with `employeeState: CUSTOMER` or similar.

### 4.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Display Name | Display Name | `displayName` | `user.userProfile.displayName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | Yes | — |
| First Name | First Name | `firstName` | `user.userProfile.firstName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | Yes | — |
| Last Name | Last Name | `lastName` | `user.userProfile.lastName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | Yes | — |
| Type | Type | `type` | `user.type` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | — |
| Categories | Categories | `categories` | `user.categories` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `array` | `text` | — | No | Yes | Formatter joins array |
| Primary Email | Primary Email | `primaryEmail` | `user.email` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | Yes | — |
| Cellular Number | Cellular Number | `cellularNumber` | `user.userProfile.cellularNumber` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | Yes | — |
| Company | Company | `company` | `user.employerProfile` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `string` | `text` | — | No | Yes | Formatter displays `.name` |
| Work Phone | Work Phone | `workPhone` | `user.userProfile.workPhone` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | Yes | — |
| Address | Address | `workAddress` | `user.userProfile.mainAddress.address` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | Yes | — |
| Zip Code | Zip Code | `workZipCode` | `user.userProfile.mainAddress.zip` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | Yes | — |
| City | City | `workCity` | `user.userProfile.mainAddress.city` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | Yes | — |
| Country | Country | `workCountry` | `user.userProfile.mainAddress.country` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | Yes | — |

### 4.2 Filter Panel

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `user.userProfile.displayName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | Offcanvas search |
| Primary Email | Primary Email | `data.email` | `user.email` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | No | Offcanvas search |
| A-Z Filter | — | — | `user.userProfile.lastName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `filter` | — | No | No | A-Z Quick Filter bar |

### 4.3 Form Elements — Tab 1: Contact Info

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Title | Title | `data.title` | `user.userProfile.title` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| First Name | First Name | `data.firstName` | `user.userProfile.firstName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Last Name | Last Name | `data.lastName` | `user.userProfile.lastName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Display Name | Display Name | `data.displayName` | `user.userProfile.displayName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Company | Company | `data.company` | `user.employerProfile` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `reference:customer` | `autocomplete` | `CompanyService.autocomplete` | No | No | — |
| Position | Position | `data.position` | `user.employeeProfile.position` (unmapped) | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | — |
| Categories | Categories | `data.categories` | `user.categories` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `array` | `tag-it` | `ContactService.getCategories` | No | No | Multi-tag |
| Primary Email | Primary Email | `data.primaryEmail` | `user.email` | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `email` | — | No | No | Regex validated |
| Second Email | Second Email | `data.secondEmail` | `user.employeeProfile.email2` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `email` | — | No | No | Regex validated |
| Work Phone | Work Phone | `data.workPhone` | `user.userProfile.workPhone` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Cellular | Cellular Number | `data.cellularNumber` | `user.userProfile.cellularNumber` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Fax | Fax Number | `data.faxNumber` | `user.userProfile.faxNumber` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Pager | Pager Number | `data.pagerNumber` | `user.userProfile.pagerNumber` (unmapped) | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Home Phone | Home Phone | `data.homePhone` | `user.userProfile.homePhone` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Birthday | Birthday | `data.birthday` | `user.userProfile.birthday` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `date` | `date` | — | No | No | — |
| QR Code | — | — | — | — | `image` | `image` | — | No | Yes | Generates QR |

### 4.4 Form Elements — Tab 2: Private Address

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Address | Address | `data.homeAddress` | `user.userProfile.mainAddress.address` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Address 2 | Address 2 | `data.homeAddress2` | `user.userProfile.mainAddress.address2` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| City | City | `data.homeCity` | `user.userProfile.mainAddress.city` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| State | State | `data.homeState` | `user.userProfile.mainAddress.state` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Zip Code | Zip Code | `data.homeZipCode` | `user.userProfile.mainAddress.zip` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Country | Country | `data.homeCountry` | `user.userProfile.mainAddress.country` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Webpage | Webpage | `data.webpage1` | `user.userProfile.webpage1` (unmapped) | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |

### 4.5 Form Elements — Tab 3: Work Address

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Address | Address | `data.workAddress` | `user.employerProfile.billingAddress.address` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | Or maps to second address |
| Address 2 | Address 2 | `data.workAddress2` | `user.employerProfile.billingAddress.address2` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| City | City | `data.workCity` | `user.employerProfile.billingAddress.city` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| State | State | `data.workState` | `user.employerProfile.billingAddress.state` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Zip Code | Zip Code | `data.workZipCode` | `user.employerProfile.billingAddress.zip` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Country | Country | `data.workCountry` | `user.employerProfile.billingAddress.country` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Webpage | Webpage | `data.webpage2` | `user.employerProfile.webpage2` (unmapped) | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `string` | `text` | — | No | No | — |

### 4.6 Form Elements — Tab 4: Other

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Custom 1 | Custom 1 | `data.custom1` | `user.custom1` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | No | — |
| Custom 2 | Custom 2 | `data.custom2` | `user.custom2` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | No | — |
| Custom 3 | Custom 3 | `data.custom3` | `user.custom3` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | No | — |
| Custom 4 | Custom 4 | `data.custom4` | `user.custom4` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | No | No | — |
| Notes | Notes | `data.notes` | `user.notes` (unmapped) | [user-management.md#user](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `textarea` | — | No | No | — |

### 4.7 Workflow Buttons & Dialogs

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Add | Hinzufügen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Add new contact |
| Edit | Bearbeiten | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Edit selected contact |
| Delete | Löschen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Delete selected contact |
| Download | Download | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Export data |
| Password | Password | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Send password reset email |
| Import | Import | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: Open import dialog |
| Update existing contacts | Update existing contacts | `data.forceUpdate` | — | — | `boolean` | `checkbox` | — | No | No | Only for import |

---

## 5. Room Management (`customer/room/room.md`)

Source: `specs/analysis/customers/room.md`

### 5.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `room._id` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `number` | `text` | — | No | Yes | — |
| Location | Location | `location` | `room.location` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `reference:location` | `text` | — | No | Yes | Formatter.name |
| Room Name | Raumname | `name` | `room.name` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | No | Yes | — |
| Room Number | Raumnummer | `number` | `room.number` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | No | Yes | — |
| Description | Beschreibung | `description` | `room.description` (unmapped) | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | No | Yes | — |

### 5.2 Form Elements — Tab 1: Room Info

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Location | Location | `data.location` | `room.location` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `reference:location` | `autocomplete` | `LocationService.autocomplete` | No | No | — |
| Available | Available | `data.available` | `room.available` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `boolean` | `checkbox` | — | No | No | — |
| Room Name | Raumname | `data.name` | `room.name` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | Yes | No | — |
| Room Number | Raumnummer | `data.number` | `room.number` | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `text` | — | Yes | No | — |
| Description | Beschreibung | `data.description` | `room.description` (unmapped) | [customer.md#room](../mongodb-mapping/customer.md#entity-räume-rooms) | `string` | `textarea` | — | No | No | — |

### 5.3 Form Elements — Tab 2: Planning (`#roomplanDlg`)

Room plan dialog fields.

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.title` | `roomPlan.title` (unmapped) | — | `string` | `text` | — | Yes | No | Undocumented roomPlan collection |
| From Date | From Date | `data.dateStart` | `roomPlan.dateStart` (unmapped) | — | `date` | `date` | — | No | No | — |
| To Date | To Date | `data.dateUntil` | `roomPlan.dateUntil` (unmapped) | — | `date` | `date` | — | No | No | — |
| Active | Active | `data.active` | `roomPlan.active` (unmapped) | — | `boolean` | `checkbox` | — | No | No | Toggle switch |
| Description | Beschreibung | `data.description` | `roomPlan.description` (unmapped) | — | `string` | `textarea` | — | No | No | — |
| Monday | Monday | `data.recur.monday` | `roomPlan.recur.monday` (unmapped) | — | `boolean` | `checkbox` | — | No | No | — |
| Tuesday | Tuesday | `data.recur.tuesday` | `roomPlan.recur.tuesday` (unmapped) | — | `boolean` | `checkbox` | — | No | No | — |
| Wednesday | Wednesday | `data.recur.wednesday` | `roomPlan.recur.wednesday` (unmapped) | — | `boolean` | `checkbox` | — | No | No | — |
| Thursday | Thursday | `data.recur.thursday` | `roomPlan.recur.thursday` (unmapped) | — | `boolean` | `checkbox` | — | No | No | — |
| Friday | Friday | `data.recur.friday` | `roomPlan.recur.friday` (unmapped) | — | `boolean` | `checkbox` | — | No | No | — |
| Saturday | Saturday | `data.recur.saturday` | `roomPlan.recur.saturday` (unmapped) | — | `boolean` | `checkbox` | — | No | No | — |
| Sunday | Sunday | `data.recur.sunday` | `roomPlan.recur.sunday` (unmapped) | — | `boolean` | `checkbox` | — | No | No | — |
| Start | Start | `data.recur.start` | `roomPlan.recur.start` (unmapped) | — | `time` | `time` | — | Yes | No | clockpicker |
| Until | Until | `data.recur.end` | `roomPlan.recur.end` (unmapped) | — | `time` | `time` | — | Yes | No | clockpicker |

### 5.4 Form Elements — Tab 3: Equipment Assignment

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Add Equipment | Add Equipment | — | `equipment.room` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:equipment` | `autocomplete` | `EquipmentService.autocomplete` | No | No | Assigns equipment to room |
| Equipment List | Equipment List | — | `equipment.room` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `collection` | `list` | — | No | Yes | View associated equipment |

---

## 6. Equipment Management (`customer/equipment/equipment.md`)

Source: `specs/analysis/customers/equipment.md`

### 6.1 Grid Columns

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| ID | ID | `id` | `equipment._id` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `number` | `text` | — | No | Yes | — |
| Serial Number | Seriennummer | `serialNumber` | `equipment.serialNumber` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | Yes | — |
| Inventory Number | Inventarnummer | `inventoryNumber` | `equipment.inventoryNumber` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | Yes | — |
| Equipment Status | Ausrüstungsstatus | `status` | `equipment.status` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `enum:EquipmentStatus` | `text` | — | No | Yes | Formatter used |
| Name | Name | `name` | `equipment.name` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | Yes | — |
| Manufacturer | Hersteller | `manufacturer` | `equipment.manufacturer` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | Yes | — |
| Description | Beschreibung | `description` | `equipment.description` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | Yes | — |
| Comments | Kommentare | `comments` | `equipment.comments` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `number` | `text` | — | No | Yes | Count of comments |
| Room | Raum | `room` | `equipment.room` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:room` | `text` | — | No | Yes | Formatter used |

### 6.2 Filter Panel

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `equipment.name` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | No | — |
| Location | Standort | `data.location` | `equipment.location` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:location` | `autocomplete` | `LocationService.autocomplete` | No | No | Unlocks room filter |
| Room | Raum | `data.room` | `equipment.room` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:room` | `autocomplete` | `RoomService.autocomplete` | No | No | Readonly until location is set |
| Customer | Kunde | `data.customer` | `equipment.customer` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:customer` | `autocomplete` | `CustomerService.autocomplete` | No | No | — |
| Equipment Status | Ausrüstungsstatus | `data.status` | `equipment.status` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `enum:EquipmentStatus` | `select` | WORKING, DEFECT, INREPAIR, RESERVED, UNKNOWN, SENT | No | No | — |

### 6.3 Form Elements — Tab 1: Equipment Info

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Inventory Number | Inventarnummer | `data.inventoryNumber` | `equipment.inventoryNumber` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | No | — |
| Name | Name | `data.name` | `equipment.name` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | No | — |
| Access User | Access User | `data.accessUser` | `equipment.accessUser` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:user` | `autocomplete` | `UserService.autocomplete` | No | No | — |
| Serial Number | Seriennummer | `data.serialNumber` | `equipment.serialNumber` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | No | — |
| Manufacturer | Hersteller | `data.manufacturer` | `equipment.manufacturer` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | No | — |
| Initial User | Initial User | `data.initialUser` | `equipment.initialUser` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:user` | `autocomplete` | `UserService.autocomplete` | No | No | — |
| Active | Aktiv | `data.active` | `equipment.active` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `boolean` | `select` | — | No | No | Options: Active/Inactive |
| Location | Standort | `data.location` | `equipment.location` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:location` | `autocomplete` | `LocationService.autocomplete` | No | No | — |
| Initial Password | Initial Password | `data.initialPassword` | `equipment.initialPassword` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `text` | — | No | No | — |
| Equipment Status | Ausrüstungsstatus | `data.status` | `equipment.status` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `enum:EquipmentStatus` | `text` | — | No | Yes | Managed via comments tab |
| Room | Raum | `data.room` | `equipment.room` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:room` | `autocomplete` | `RoomService.autocomplete` | No | No | Cascading from Location |
| Date Setup | Date Setup | `data.dateSetup` | `equipment.dateSetup` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `date` | `date` | — | No | No | — |
| Product | Produkt | `data.product` | `equipment.product` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `reference:product` | `autocomplete` | `ProductService.autocomplete` | No | No | Filtered by "EQUIPMENT" |
| Date Last Inventory | Date Last Inventory | `data.dateLastInventory` | `equipment.dateLastInventory` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `date` | `date` | — | No | No | — |
| Date Exit | Date Exit | `data.dateExit` | `equipment.dateExit` (unmapped) | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `date` | `date` | — | No | No | — |
| Description | Beschreibung | `data.description` | `equipment.description` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `textarea` | — | No | No | — |

### 6.4 Form Elements — Tab 2: Comments / Status Change

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Status | Status | `data.status` | `equipment.status` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `enum:EquipmentStatus` | `select` | WORKING, DEFECT, INREPAIR, RESERVED, UNKNOWN, SENT | Yes | No | — |
| Comment | Kommentar | `data.comment` | `equipment.comments.text` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `string` | `textarea` | — | No | No | Appends to collection |
| Save Comment | Speichern | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `EquipmentService.addComment` |
| Comments List | Kommentare | `comments` | `equipment.comments` | [customer.md#equipment](../mongodb-mapping/customer.md#entity-ausrüstung-equipment) | `collection` | `list` | — | No | Yes | Shows user, time, status, text |

