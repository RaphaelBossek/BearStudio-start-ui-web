# Data Dictionary — User Management

This document defines the data dictionary for the User Management domain. It maps UI fields to their exact MongoDB collection fields, documents UI types, abstract data types, translations, and workflow actions.

## 1. Profile Form — Personal Data (`profile/profile-form.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Profile picture | Profilbild | — | `user.userProfile.photo` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `reference:userFile` | `file` / `display` | — | No | No | `uploadProfilePicture` triggers `updateThumbnail` |
| Salutation | Anrede | `data.userProfile.salutation` | `user.userProfile.salutation` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `enum:SalutationType` | `select` | BUSINESS, FORMAL, FEMALE, MALE, INFORMAL, INFORMAL_FEMALE, INFORMAL_MALE | No | No | — |
| Title | Titel | `data.userProfile.title` | `user.userProfile.title` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| First Name | Vorname | `data.userProfile.firstName` | `user.userProfile.firstName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | Yes | No | — |
| Last Name | Nachname | `data.userProfile.lastName` | `user.userProfile.lastName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | Yes | No | — |
| Mobile | Handy | `data.userProfile.cellularNumber` | `user.userProfile.cellularNumber` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Birthday | Geburtstag | `data.userProfile.birthday` | `user.userProfile.birthday` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `date` | `date` | — | No | No | — |
| On-call number | Bereitschaftsnummer | `data.userProfile.shiftPhoneNumber` | `user.userProfile.shiftPhoneNumber` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `text` | — | No | No | — |
| Email | E-Mail | `data.email` | `user.email` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | Yes | No | Email format |
| Email 2 | E-Mail2 | `data.employeeProfile.email2` | `user.employeeProfile.email2` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | Email format |
| Send notifications per mail | Nachrichten per E-Mail weiterleiten | `data.userProfile.notificationPerMail` | `user.userProfile.notificationPerMail` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `boolean` | `checkbox` | — | No | No | — |
| User | User (Hardcoded) | `data.employeeProfile.bayernBoxAccess.user` | `user.employeeProfile.bayernBoxAccess.user` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | Securebox Data |
| Password | Passwort | `data.employeeProfile.bayernBoxAccess.password` | `user.employeeProfile.bayernBoxAccess.password` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `password` | — | No | No | Securebox Data |
| Check access | Zugang prüfen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: calls `LocationService.checkBayernBoxAccess` |
| Exclude from the following messages | Von folgenden Nachrichten ausnehmen | `data.userProfile.exludedNotifications` | `user.userProfile.exludedNotifications` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `enum:NotificationEvent[]` | `checkbox` (list) | 20 NotificationEvent options | No | No | ADMIN only |

## 2. Profile Form — Business Data (`profile/profile-form.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| active as doctor since | tätig als Arzt seit | `data.employeeProfile.activeSince` | `user.employeeProfile.activeSince` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `date` | `date` | — | No | No | — |
| GKTO | GKTO | `data.employerProfile.gkto` | `user.employerProfile.gkto` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `string` | `text` | — | No | No | ADMIN only |
| Account | Konto | `data.employerProfile.konto` | `user.employerProfile.konto` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `string` | `text` | — | No | No | ADMIN only |
| EFN/Membernumber (PT) | EFN/Mitgliedsnummer (PT) | `data.employerProfile.efn` | `user.employerProfile.efn` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `string` | `text` | — | No | No | ADMIN only |
| active at VC since | tätig bei VC als Arzt seit | `data.employerProfile.activeSinceVC` | `user.employerProfile.activeSinceVC` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `date` | `date` | — | No | No | ADMIN only |
| active at VC till | tätig bei VC als Arzt bis | `data.employerProfile.activeUntilVC` | `user.employerProfile.activeUntilVC` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `date` | `date` | — | No | No | ADMIN only |
| AGB/TC Login Akzeptiert (Hardcoded) | AGB/TC Login Akzeptiert (Hardcoded) | `data.dateAcceptedLoginNotification` | `user.dateAcceptedLoginNotification` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `datetime` | `display` | — | No | Yes | ADMIN only |
| State | Status | `data.employeeState` | `user.employeeState` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `enum:EmployeeState` | `select` | UNCONFIRMED, ACTIVE, SICK, HOLIDAY, INACTIVE | No | No | ADMIN only |
| Inactive start | Inaktiv ab | `data.employerProfile.dateInactiveStart` | `user.employerProfile.dateInactiveStart` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `date` | `date` | — | No | No | ADMIN only |
| Inactive until | Inaktiv bis | `data.employerProfile.dateInactiveUntil` | `user.employerProfile.dateInactiveUntil` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `date` | `date` | — | No | No | ADMIN only |
| Description | Beschreibung | `data.employerProfile.inctiveReason` | `user.employerProfile.inctiveReason` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `bigstring` | `textarea` | — | No | No | ADMIN only |
| Require Two-Factor | 2-Faktor verpflichtend | `data.requireTotp` | `user.requireTotp` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `checkbox` | — | No | No | ADMIN only |
| Start (Hardcoded) | Start (Hardcoded) | `data.employerProfile.employeeType.start` | `user.employerProfile.employeeType.start` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `date` | `date` | — | No | No | ADMIN only, Repeater |
| Type | Typ | `data.employerProfile.employeeType.type` | `user.employerProfile.employeeType.type` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `enum:EmployeeType` | `select` | HONORAR, HN2, HN3, A1, A2, A3 | No | No | ADMIN only, Repeater |
| Sip Accounts (Hardcoded) | Sip Accounts (Hardcoded) | `data.employerProfile.sipAccounts.number` | `user.employerProfile.sipAccounts.number` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `string` | `text` | — | No | No | ADMIN only, Repeater |
| Yearly Income | Honorarbasis | `data.employerProfile.currentIncome` | `user.employerProfile.currentIncome` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `number` | `text` | — | No | No | ADMIN only |
| sales tax id | Umsatzsteuernummer | `data.employeeProfile.uid` | `user.employeeProfile.uid` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | — |
| Tax Nr | Steuer ID | `data.employeeProfile.taxid` | `user.employeeProfile.taxid` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | — |
| IBAN | IBAN | `data.employeeProfile.iban` | `user.employeeProfile.iban` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | — |
| Bank | Kreditinstitut | `data.employeeProfile.bank` | `user.employeeProfile.bank` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | — |
| BIC | BIC | `data.employeeProfile.bic` | `user.employeeProfile.bic` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | — |
| Create signature | Unterschrift erstellen | — | `user.employeeProfile.imageSignature` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `reference:userFile` | `button` / `file` | — | No | No | Opens signature pad |
| Qualification Level | Qualifikationsniveau | `data.employerProfile.level` | `user.employerProfile.level` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `enum:QualificationLevel` | `select` | ONBOARDING, ROOKIE, AMATEUR, PROFI | No | No | ADMIN only |
| Experience Addiction Medicine | Suchtmedizin | `data.employerProfile.experienceAddictionMedicine` | `user.employerProfile.experienceAddictionMedicine` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `enum:FocusLevel` | `select` | VERYHIGH, HIGH, MEDIUM, LOW, VERYLOW | No | No | ADMIN only |
| Shift | Bereitschaftsdienst | `data.employeeProfile.shift` | `user.employeeProfile.shift` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `enum:FocusLevel` | `select` | NONE, HIGH, MEDIUM, LOW | No | No | ADMIN only |
| Appointment | Sprechstunde | `data.employeeProfile.appointment` | `user.employeeProfile.appointment` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `enum:FocusLevel` | `select` | NONE, HIGH, MEDIUM, LOW | No | No | ADMIN only |
| Therapy | Therapie | `data.employeeProfile.therapy` | `user.employeeProfile.therapy` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `enum:FocusLevel` | `select` | NONE, HIGH, MEDIUM, LOW | No | No | ADMIN only |

## 3. Profile Form — Addresses (`profile/profile-form.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.userProfile.mainAddress.name` | `user.userProfile.mainAddress.name` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Type | Typ | `data.userProfile.mainAddress.type` | `user.userProfile.mainAddress.type` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `enum:AddressType` | `select` | PRIVATE, ALTERNATIVE, WORK, PRAXIS, OTHER | No | No | — |
| Street | Straße | `data.userProfile.mainAddress.address` | `user.userProfile.mainAddress.address` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | Yes | No | Mandatory for employee |
| Additional | Zusatz | `data.userProfile.mainAddress.address2` | `user.userProfile.mainAddress.address2` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| telephone | Festnetz | `data.userProfile.mainAddress.phone` | `user.userProfile.mainAddress.phone` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| fax | Fax | `data.userProfile.mainAddress.fax` | `user.userProfile.mainAddress.fax` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| ZIP | PLZ | `data.userProfile.mainAddress.zip` | `user.userProfile.mainAddress.zip` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | Yes | No | Mandatory for employee, triggers zip lookup |
| City | Ort | `data.userProfile.mainAddress.city` | `user.userProfile.mainAddress.city` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | Yes | No | Mandatory for employee |
| State | Bundesland | `data.userProfile.mainAddress.state` | `user.userProfile.mainAddress.state` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Country | Land | `data.userProfile.mainAddress.country` | `user.userProfile.mainAddress.country` | [user-management.md#address](../mongodb-mapping/user-management.md#sub-entity-address) | `string` | `text` | — | No | No | — |
| Name | Name | `data.employeeProfile.sites.name` | `user.employeeProfile.sites.name` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | Repeater (additional addresses) |
| Type | Typ | `data.employeeProfile.sites.type` | `user.employeeProfile.sites.type` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `enum:AddressType` | `select` | — | No | No | Repeater |
| Street | Straße | `data.employeeProfile.sites.address` | `user.employeeProfile.sites.address` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | Repeater |
| ZIP | PLZ | `data.employeeProfile.sites.zip` | `user.employeeProfile.sites.zip` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | Repeater |
| City | Ort | `data.employeeProfile.sites.city` | `user.employeeProfile.sites.city` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | No | Repeater |

## 4. Profile Form — Education (`profile/profile-form.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Skill | Skill | `data.employeeProfile.skills.skill` | `user.employeeProfile.skills.skill` | [user-management.md#skillassignment](../mongodb-mapping/user-management.md#sub-entity-skillassignment) | `reference:skill` | `autocomplete` | `SkillService.autocomplete` | No | No | Collection Insert |
| Active | Aktiv | `data.employeeProfile.skills.active` | `user.employeeProfile.skills.active` | [user-management.md#skillassignment](../mongodb-mapping/user-management.md#sub-entity-skillassignment) | `boolean` | `icon` | — | No | Yes | Repeater status |
| Date | Datum | `data.employeeProfile.skills.dateCertification` | `user.employeeProfile.skills.dateCertification` | [user-management.md#skillassignment](../mongodb-mapping/user-management.md#sub-entity-skillassignment) | `date` | `date` | — | No | No | Repeater |
| Certificate | Zertifikat | `data.employeeProfile.skills.certification` | `user.employeeProfile.skills.certification` | [user-management.md#skillassignment](../mongodb-mapping/user-management.md#sub-entity-skillassignment) | `reference:userFile` | `file` / `display` | — | No | No | ADMIN only |
| Exclusion criteria | Ausschlusskriterien | `data.employeeProfile.exclusionCriteria` | `user.employeeProfile.exclusionCriteria` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `reference:exclusionCriteria` | `autocomplete` | `ExclusionCriteriaService.autocomplete` | No | No | Collection Insert |
| Exclusion Title | Ausschlusskriterien Titel | `data.employeeProfile.exclusionCriteria.title` | `user.employeeProfile.exclusionCriteria.title` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `string` | `text` | — | No | Yes | Repeater display |
| Exclusion Description | Ausschlusskriterien Beschreibung | `data.employeeProfile.exclusionCriteria.description` | `user.employeeProfile.exclusionCriteria.description` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `bigstring` | `textarea` | — | No | Yes | Repeater display |

## 5. Profile Form — Documents (`profile/profile-form.md`) (ADMIN)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Upload file (Hardcoded) | Datei hochladen (Hardcoded) | — | — | — | `action` | `button` / `file` | — | — | — | **Workflow-only**: calls `UserFileService.upload` |
| File | Datei | `files.list.name` | `userFile.name` | [user-management.md#entity-benutzerdateien-user-files](../mongodb-mapping/user-management.md#entity-benutzerdateien-user-files) | `string` | `display` | — | No | Yes | Repeater |
| Type | Typ | `files.list.type` | `userFile.type` | [user-management.md#entity-benutzerdateien-user-files](../mongodb-mapping/user-management.md#entity-benutzerdateien-user-files) | `enum:UserFileType` | `select` | APPROBIATION, AUTHENTICATED_MEDICAL_SPECIALIST_CERTIFICATE, etc. | Yes | No | Repeater |
| Date | Datum | `files.list.date` | `userFile.date` | [user-management.md#entity-benutzerdateien-user-files](../mongodb-mapping/user-management.md#entity-benutzerdateien-user-files) | `date` | `date` | — | No | No | Repeater |

## 6. Profile Form — Products (`profile/profile-form.md`) (ADMIN)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| mail invoice | E-Mail-Rechnung | `data.employeeProfile.mailInvoice` | `user.employeeProfile.mailInvoice` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `boolean` | `checkbox` | — | No | No | — |
| post invoice | Post Rechnung | `data.employeeProfile.postInvoice` | `user.employeeProfile.postInvoice` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `boolean` | `checkbox` | — | No | No | — |
| Product | Produkt | `data.employerProfile.products.product` | `user.employerProfile.products.product` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `reference:product` | `autocomplete` | `ProductService.autocomplete` | No | No | Collection Insert |
| Amount | Menge | `data.employerProfile.products.amount` | `user.employerProfile.products.amount` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `number` | `text` | — | No | No | Repeater |
| Product Name | Produktname | `data.employerProfile.products.product.name` | `user.employerProfile.products.product.name` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `string` | `display` | — | No | Yes | Repeater |
| Start | Start (Hardcoded) | `data.employerProfile.products.start` | `user.employerProfile.products.start` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `date` | `date` | — | No | No | Repeater |
| Until | Bis | `data.employerProfile.products.until` | `user.employerProfile.products.until` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `date` | `date` | — | No | No | Repeater |
| Description | Beschreibung | `data.employerProfile.products.description` | `user.employerProfile.products.description` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `string` | `text` | — | No | No | Repeater |
| Comment | Kommentar | `data.employerProfile.products.comment` | `user.employerProfile.products.comment` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `string` | `text` | — | No | No | Repeater |
| Price | Preis | `data.employerProfile.products.product.price` | `user.employerProfile.products.adjustedPrice` | [user-management.md#subscribedproduct](../mongodb-mapping/user-management.md#sub-entity-subscribedproduct) | `decimal` | `text` | — | No | No | Repeater (shows base price or adjusted) |
| Total (Hardcoded) | Total (Hardcoded) | — | — | — | `decimal` | `display` | — | No | Yes | Computed: amount * price |

## 7. Expert Days/Month & Expert Week (`profile/profile-expert-availability.md`) (ADMIN)

*Note: The availability grids map to `expertDays` and `expertWeek` collections, but they are stored separately from the user record in MongoDB, despite being edited in the profile form.*

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Year | Jahr | — | `expertDays.year` | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | Yes | No | Input |
| Month | Monat | — | `expertDays.month` | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `enum:Month` | `select` | JAN to DEC | Yes | No | Input |
| Slot: morning | Vormittag | — | `expertDays.morningYes` / `morningNo` | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `button` | Tri-state (null/true/false) | No | No | Grid Cell |
| Slot: afternoon | Nachmittag | — | `expertDays.afternoonYes` / `afternoonNo` | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `button` | Tri-state | No | No | Grid Cell |
| Slot: night | Nacht | — | `expertDays.nightYes` / `nightNo` | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `button` | Tri-state | No | No | Grid Cell |
| Slot: morning appointment | Sprechstunde Vormittag | — | `expertDays.morningAppointmentYes` / `No` | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `button` | Tri-state | No | No | Grid Cell |
| Slot: afternoon appointment | Sprechstunde Nachmittag | — | `expertDays.afternoonAppointmentYes` / `No` | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `button` | Tri-state | No | No | Grid Cell |
| Slot: treatment | Therapie | — | `expertDays.treatmentAppointmentYes` / `No`| [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `boolean` | `button` | Tri-state | No | No | Grid Cell |
| Max count inputs | Max. Anzahl | — | `expertDays.maxWeekDayMorning` (etc) | [planning.md#entity-jahreskalender-eines-experten-expert-days](../mongodb-mapping/planning.md#entity-jahreskalender-eines-experten-expert-days) | `number` | `text` | — | No | No | Total 8 inputs |
| Week Slot | Woche Slot | — | `expertWeek.slotsMo` (etc) | [planning.md#entity-experten-wochenplan-expert-week](../mongodb-mapping/planning.md#entity-experten-wochenplan-expert-week) | `boolean` | `button` | Binary (null/true) | No | No | Grid Cell |

## 8. Staff Management List & Toolbar (`profile/profile-staff.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| First Name | Vorname | `firstName` | `user.userProfile.firstName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `display` | — | — | Yes | Grid Column |
| Last Name | Nachname | `lastName` | `user.userProfile.lastName` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `display` | — | — | Yes | Grid Column |
| State | Status | `employeeState` | `user.employeeState` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `enum:EmployeeState` | `display` | — | — | Yes | Grid Column |
| Standby | Bereitschaft | `shift` | `user.employeeProfile.shift` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `enum:FocusLevel` | `display` | — | — | Yes | Grid Column |
| Appointment | Sprechstunde | `appointment` | `user.employeeProfile.appointment` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `enum:FocusLevel` | `display` | — | — | Yes | Grid Column |
| Therapy | Therapie | `therapy` | `user.employeeProfile.therapy` | [user-management.md#employeeprofile](../mongodb-mapping/user-management.md#sub-entity-employeeprofile) | `enum:FocusLevel` | `display` | — | — | Yes | Grid Column |
| Last Reminder | Letzte Erinnerung | `lastReminder` | `user.lastReminder` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `datetime` | `display` | — | — | Yes | Grid Column |
| Require Two-Factor | 2-Faktor verpflichtend | `requireTotp` | `user.requireTotp` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `icon` | — | — | Yes | Grid Column |
| Enabled | Aktiv | `enabled` | `user.enabled` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `icon` | — | — | Yes | Grid Column |
| Appointment Requests | Terminanfragen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: opens `#assignmentDlg` |
| Add | Neu | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: open new profile form |
| Change | Editieren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: open edit profile form |
| Onboarding step | Onboarding-Schritt | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: open onboarding dialog |
| Delete | Löschen | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: delete user |
| Export | Exportieren | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: download `ExpertenListe.xls` |
| Password | Passwort | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: open password reset dialog |
| Invoice | Rechnungserstellung | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: open `#createInvoiceDlg` |
| Expert Test Search | Expert Test Search (Hardcoded) | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: open `#searchExpertDlg` |

## 9. Expert Search Dialog (`profile/profile-staff.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Job | Job | `data.job` | — | — | `reference:jobId` | `autocomplete` | `JobService.autocomplete` | No | No | Search filter (no direct DB save) |
| Active (Hardcoded) | Active (Hardcoded) | `data.active` | — | — | `boolean` | `switch` | — | No | No | Search filter |
| Skills | Skills (Hardcoded) | `data.skills` | — | — | `reference:skill` | `autocomplete` | `SkillService.autocomplete` | No | No | Search filter collection |
| Exclusion Criteria | Ausschlusskriterien | `data.exclusionCriteria` | — | — | `reference:exclusionCriteria` | `autocomplete` | `ExclusionCriteriaService.autocomplete` | No | No | Search filter collection |
| Search | Search (Hardcoded) | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `UserService.expertSearch` |
| Search Result Name | Name | `data.result.userProfile.displayName` | `user.userProfile` | [user-management.md#userprofile](../mongodb-mapping/user-management.md#sub-entity-userprofile) | `string` | `display` | — | — | Yes | Result table |
| Qualification Level | Qualifikationsniveau | `data.result.employerProfile.level` | `user.employerProfile.level` | [user-management.md#employerprofile](../mongodb-mapping/user-management.md#sub-entity-employerprofile) | `enum:QualificationLevel` | `select` | — | — | Yes | Result table |

## 10. Password Dialogs (`profile/profile-dialogs.md`, `admin/user-management.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Current Password | Aktuelles Passwort | `data.current` | `user.password` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `password` | — | Yes | No | Hidden for admin |
| New password | Neues Passwort | `data.password` | `user.password` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `password` | — | Yes | No | Validated |
| Confirm Password | Neues Passwort wiederholen | `data.confirmPassword` | — | — | `string` | `password` | — | Yes | No | Must match new password |
| Send Password | Passwort Senden (Hardcoded) | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `UserService.sendPassword` |

## 11. DocFinder Dialog (`profile/profile-dialogs.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Physician | Arzt | `data.doctor` | `appointment.doctor` | [planning.md#entity-termine-appointments](../mongodb-mapping/planning.md#entity-termine-appointments) | `reference:user` | `autocomplete` | `UserService.findEmployee` | No | No | Search filter |
| Job-Id | Dienstleistung | `data.job.code` | `appointment.job.code` | [planning.md#entity-termine-appointments](../mongodb-mapping/planning.md#entity-termine-appointments) | `string` | `display` | — | No | Yes | Context filter |
| Day | Tag | `data.day` | `appointment.date` | [planning.md#entity-termine-appointments](../mongodb-mapping/planning.md#entity-termine-appointments) | `date` | `display` | — | No | Yes | Context filter |
| Start | Start | `data.start` | `appointment.timeStart` | [planning.md#entity-termine-appointments](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `display` | — | No | Yes | Context filter |
| End | Ende | `data.end` | `appointment.timeEnd` | [planning.md#entity-termine-appointments](../mongodb-mapping/planning.md#entity-termine-appointments) | `time` | `display` | — | No | Yes | Context filter |

## 12. Admin User Management (`admin-user/user-management.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Username | Benutzername | `data.username` | `user.username` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | Yes | No | Grid + Detail |
| Role | Rolle | `data.role` | `user.role` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `enum:Role` | `select` | REGISTERED, STANDARD, KUNDE, ADMIN_KUNDE, LEITER_INTERN, ADMIN_INTERN, ADMIN | Yes | No | Grid + Detail |
| Group | Gruppe | `data.groups` | `user.groups` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `reference:group` | `select` | `GroupService.getAll` | No | No | Detail collection insert |
| Customer | Kunde | `data.customers` | `user.customers` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `reference:customer` | `autocomplete` | `CustomerService.autocomplete` | No | No | Detail collection insert |
| Locked | Gesperrt | `data.accountLocked` | `user.accountLocked` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `switch` | — | No | No | Grid + Detail |
| Two Factor | Zwei-Faktor | `data.dateTwoFactor` | `user.totpDevice.dateRegistered` | [user-management.md#totpdevice](../mongodb-mapping/user-management.md#sub-entity-totpdevice) | `datetime` | `display` | — | No | Yes | Has reset button |
| API Key | API-Schlüssel | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: opens `#changeApiKeyDlg` |

### API Key Dialog (`data.apikeys`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Key (Hardcoded) | Key (Hardcoded) | `apikeys.key` | `user.settings.apikeys` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `display` | — | No | Yes | Auto-generated |
| IP (Hardcoded) | IP (Hardcoded) | `apikeys.whitelistText` | `user.settings.apikeys` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `string` | `text` | — | Yes | No | Parsed to array |
| Active (Hardcoded) | Active (Hardcoded) | `apikeys.enabled` | `user.settings.apikeys` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `boolean` | `checkbox` | — | No | No | — |
| Last Use (Hardcoded) | Last Use (Hardcoded) | `apikeys.dateLastUsed` | `user.settings.apikeys` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `datetime` | `display` | — | No | Yes | — |

## 13. TOTP Onboarding (`admin-user/06-totp-onboarding.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| TOTP Code | TOTP Code | — | — | — | `string` | `text` (split) | — | Yes | No | Input for verification |
| Start | Start | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `UserService.registerDevice` |
| Generate New Secret | Neues Secret Generieren (Hardcoded) | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `UserService.registerDevice` |
| Test | Test (Hardcoded) | — | — | — | `action` | `button` | — | — | — | **Workflow-only**: `UserService.checkTotp` |
| Delete 2nd Factor | 2. Faktor Löschen (Hardcoded) | — | `user.totpDevice` | [user-management.md#entity-experte-expert](../mongodb-mapping/user-management.md#entity-experte-expert) | `action` | `button` | — | — | — | **Workflow-only**: `UserService.resetTotp` |

## 14. Group Management (`admin-group/group-management.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Name | Name | `data.name` | `group.name` | [user-management.md#entity-benutzergruppen-groups](../mongodb-mapping/user-management.md#entity-benutzergruppen-groups) | `string` | `text` | — | Yes | No | — |
| Description | Beschreibung | `data.description` | `group.description` | [user-management.md#entity-benutzergruppen-groups](../mongodb-mapping/user-management.md#entity-benutzergruppen-groups) | `bigstring` | `textarea` | — | No | No | — |
| Right | Recht | `data.rights` | `group.rights` | [user-management.md#entity-benutzergruppen-groups](../mongodb-mapping/user-management.md#entity-benutzergruppen-groups) | `reference:accessRight[]` | `select` (multiple) | `GroupService.getRights` | No | No | — |

## 15. Skill Management (`admin-skill/skill.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Code | Code | `data.code` | `skill.code` | [capabilities.md#entity-fähigkeiten-skills](../mongodb-mapping/capabilities.md#entity-fähigkeiten-skills) | `string` | `text` | — | Yes | No | — |
| Type | Typ | `data.type` | `skill.type` | [capabilities.md#entity-fähigkeiten-skills](../mongodb-mapping/capabilities.md#entity-fähigkeiten-skills) | `enum:SkillType` | `select` | MAIN, ADDITIONAL, EXTRA, LANGUAGE | Yes | No | — |
| Certificate | Zertifikat | `data.certified` | `skill.certified` | [capabilities.md#entity-fähigkeiten-skills](../mongodb-mapping/capabilities.md#entity-fähigkeiten-skills) | `boolean` | `switch` | — | No | No | — |
| Active | Aktiv | `data.active` | `skill.active` | [capabilities.md#entity-fähigkeiten-skills](../mongodb-mapping/capabilities.md#entity-fähigkeiten-skills) | `boolean` | `switch` | — | No | No | — |
| Description | Beschreibung | `data.description` | `skill.description` | [capabilities.md#entity-fähigkeiten-skills](../mongodb-mapping/capabilities.md#entity-fähigkeiten-skills) | `bigstring` | `textarea` | — | No | No | — |

## 16. Onboarding Flow (`onboarding/onboarding-flow.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Step | Schritt | `data.steps.step.title` | `onboardingHistory.step.title` | [user-management.md#onboardinghistory](../mongodb-mapping/user-management.md#entity-onboarding-verlauf-onboarding-history) | `string` | `display` | — | No | Yes | Repeater column |
| Date | Datum | `data.steps.dateStarted` | `onboardingHistory.dateStarted` | [user-management.md#onboardinghistory](../mongodb-mapping/user-management.md#entity-onboarding-verlauf-onboarding-history) | `date` | `date` | — | No | No | Repeater column |
| Completed | Abgeschlossen | `data.steps.dateCompleted` | `onboardingHistory.dateCompleted` | [user-management.md#onboardinghistory](../mongodb-mapping/user-management.md#entity-onboarding-verlauf-onboarding-history) | `date` | `date` | — | No | No | Repeater column |
| Comment | Kommentar | `data.steps.comment` | `onboardingHistory.comment` | [user-management.md#onboardinghistory](../mongodb-mapping/user-management.md#entity-onboarding-verlauf-onboarding-history) | `bigstring` | `textarea` | — | No | No | Repeater column |
| Upload file | Datei hochladen | `data.steps.file` | — | — | `action` | `file` | — | No | No | **Workflow-only**: Only visible for SUBMIT/SELFSUBMIT types |

## 17. User Stats Details (`dashboard/dialogs-user-management.md`)

| UI Field Label (EN) | UI Field Label (DE) | Data Path (`data.*`) | MongoDB Path (`collection.field`) | DB Mapping Reference | Abstract Type | UI Element | Options/Enum | Required | Read-only | Notes |
|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|:---|
| Date | Datum | `data.ts` | — | — | `date` | `date` | — | No | No | Search filter (no DB mapping) |
| Available | Verfügbar | `data.count.available` | — | — | `number` | `display` | — | — | Yes | Data grid column (derived stat) |
| Booked | Gebucht | `data.count.booked` | — | — | `number` | `display` | — | — | Yes | Data grid column (derived stat) |

