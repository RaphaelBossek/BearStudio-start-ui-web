# Customer

[← Back to Index](./README.md)

This file covers the Customer category: entities related to customers, locations, and sites.

---

## ER Diagram

Customer accounts, consultation sites, and room inventory.

```mermaid
erDiagram
    customer {
        bigint _id PK
        string name
        string code
        string timeframe
        string roundingType
    }
    location {
        bigint _id PK
        string name
        string typeEnum
        string patientDataType
        bigint customer_id FK
    }
    locationType {
        bigint _id PK
        string name
    }
    site {
        bigint _id PK
        string name
        string address
        string zip
        string city
        boolean primary
    }
    room {
        bigint _id PK
        bigint location_id FK
        string name
    }
    CustomerDiscount {
        bigint job_id FK
        number discount
        datetime dateStart
        datetime dateUntil
    }
    CustomerPriceList {
        datetime start
        datetime until
        string comment
    }

    customer ||--o{ CustomerDiscount : "embeds[]"
    customer ||--o{ CustomerPriceList : "embeds[]"
    location }o--|| customer : "references"
    location }o--o| locationType : "DBRef"
    room }o--|| location : "references"
```

---

## Entities in This Category

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`customer`](#entity-kunden-customers) | Kunden (Customers) | Organizational entities (customers) that are assigned to locations and appointment plans. |
| [`location`](#entity-standorte-locations) | Standorte (Locations) | Definition of consultation sites, including room configurations and contact details. |
| [`locationType`](#entity-standorttypen-location-types) | Standorttypen (Location Types) | Classification for different types of consultation locations. |
| [`site`](#entity-seiten-standorte-sites) | Seiten/Standorte (Sites) | Physical locations or digital sites associated with the system. |

---

## Entity: Kunden (Customers)
Organizational entities (customers) that are assigned to locations and appointment plans.

### Table: customer
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer (Zeitstempel) |
| `name` | `String` | schema | Name des Kunden |
| `code` | `String` | schema | Kunden-Code |
| `representative` | `String` | schema | Ansprechpartner |
| `email` | `String` | schema | E-Mail-Adresse |
| `uid` | `String` | schema | Umsatzsteuer-ID |
| `bank` | `String` | schema | Kreditinstitut |
| `bic` | `String` | schema | BIC |
| `iban` | `String` | schema | IBAN |
| `address` | `String` | schema | Straße und Hausnummer |
| `address2` | `String` | schema | Adresszusatz |
| `zip` | `String` | schema | Postleitzahl |
| `city` | `String` | schema | Ort |
| `state` | `String` | schema | Bundesland |
| `country` | `String` | schema | Land |
| `webpage` | `String` | schema | Webseite |
| `phone` | `String` | schema | Telefonnummer |
| `phone2` | `String` | schema | Zweite Telefonnummer |
| `faxNumber` | `String` | schema | Faxnummer |
| `timeframe` | `String` | schema | Abrechnungszeitraum:<br>• `MONTHLY` (Used) |
| `roundingType` | `String` | schema | Rundungsregel:<br>• `FULL_HOUR` (Used)<br>• `HALF_HOUR` (Used) |
| `roundingTypeExceptions` | `Array` | schema | Ausnahmen von der Rundungsregel |
| `discounts` | `Array` | schema | Liste von Rabatten ([CustomerDiscount](#sub-entity-customerdiscount)) |
| `priceLists` | `Array` | schema | Zugeordnete Preislisten ([CustomerPriceList](#sub-entity-customerpricelist)) |
| `priceListsValid` | `String` | schema | Validierungshinweis für Preislisten (Freitext) |
| `dateCustomer` | `Date` | schema | Kundendatum |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `createdById` | `Long` | schema | Ersteller (Reference to [user](./user-management.md#entity-experte-expert)) |
| `dateChanged` | `Date` | schema | Änderungsdatum |
| `changedById` | `Long` | schema | Geändert von (Reference to [user](./user-management.md#entity-experte-expert)) |
| `_class` | `String` | schema | Laufzeitklassen-Marker: `de.videoclinic.model.Customer` |

The `customer` entity is referenced by:
- [`appointment`](./planning.md#entity-termine-appointments)
- [`appointmentPlan`](./planning.md#entity-sprechstundenplan-appointment-plan)
- [`consultationData`](./treatment.md#entity-konsultationsdaten-consultation-data) (as `customer` sub-entity)
- [`invoiceComponent`](./accounting.md#entity-rechnungskomponenten-invoice-components)
- [`invoiceReceiver`](./accounting.md#entity-rechnungsempf-nger-invoice-receivers)
- [`location`](#entity-standorte-locations)
- [`project`](./deprecated.md#entity-projekte-projects)
- [`treatment`](./treatment.md#entity-behandlungsverlauf-treatment)
- [`locationRoomsDto`](./treatment.md#entity-standort-snapshots-location-rooms-dto)

### Sub-entities for customer

#### Sub-entity: CustomerDiscount
Definition eines kundenindividuellen Rabatts für eine bestimmte Dienstleistung.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `job` | `Long` | schema | Reference ID to [jobId](./accounting.md#entity-dienstleistung-service) |
| `discount` | `Number` | schema | Rabattsatz |
| `comment` | `String` | schema | Kommentar |
| `dateStart` | `Date` | schema | Startdatum |
| `dateUntil` | `Date` | schema | Enddatum |

The `CustomerDiscount` sub-entity is used within:
- [`customer`](#entity-kunden-customers) (as `discounts` array)

#### Sub-entity: CustomerPriceList
Zuweisung einer Preisliste zu einem Kunden mit zeitlicher Gültigkeit.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `priceList` | `Document` | snapshot | Snapshot der Preisliste (enthält `_id` und `name`) |
| `start` | `Date` | schema | Startdatum |
| `until` | `Date` | schema | Enddatum |
| `comment` | `String` | schema | Kommentar |

The `CustomerPriceList` sub-entity is used within:
- [`customer`](#entity-kunden-customers) (as `priceLists` array)

## Entity: Standorte (Locations)
Medizinische Einrichtungen oder Standorte, an denen Konsultationen durchgeführt werden.

### Table: location
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `foreignId` | `String` | schema | Externe ID (JVA) |
| `externalId` | `String` | schema | Externe ID (ZMS) |
| `version` | `Long` | schema | Versionsnummer |
| `uid` | `String` | schema | Umsatzsteuer-ID |
| `type` | `DBRef` | schema | Reference to [locationType](#entity-standorttypen-location-types) |
| `typeEnum` | `String` | schema | Typ als Enum-String |
| `name` | `String` | schema | Name der Einrichtung |
| `building` | `String` | schema | Gebäude |
| `address` | `String` | schema | Adresse |
| `address2` | `String` | schema | Adresszusatz |
| `zip` | `String` | schema | PLZ |
| `city` | `String` | schema | Ort |
| `state` | `String` | schema | Bundesland |
| `country` | `String` | schema | Land |
| `bank` | `String` | schema | Kreditinstitut |
| `bic` | `String` | schema | BIC |
| `iban` | `String` | schema | IBAN |
| `sipAccounts` | `Array` | schema | Liste von SIP-Accounts ([SipAccount](./user-management.md#sub-entity-sipaccount)) |
| `representative` | `String` | schema | Ansprechpartner |
| `phone` | `String` | schema | Telefonnummer |
| `phoneMedical` | `String` | schema | Medizinische Telefonnummer |
| `contactMedical` | `String` | schema | Medizinischer Ansprechpartner |
| `emailMedical` | `String` | schema | Medizinische E-Mail |
| `sip1` | `String` | schema | SIP 1 |
| `sip2` | `String` | schema | SIP 2 |
| `sipMobile` | `String` | schema | SIP Mobil |
| `fax` | `String` | schema | Faxnummer |
| `medicationType` | `String` | schema | Art der Medikation |
| `patientDataType` | `String` | schema | Art der Patientendatenübermittlung:<br>• `EXTERNAL` (Used)<br>• `EXTERNAL_BASISWEB` (Used)<br>• `INTERNAL` (Used)<br>• `INTERNAL_DAV` (Used)<br>• `INTERNAL_SECUREBOX` (Used)<br>• `INTERNAL_VCCLOUD` (Used) |
| `patientDataAccess` | `Document` | schema | Konfiguration für Datenzugriff ([LocationPatientDataAccess](#sub-entity-locationpatientdataaccess)) |
| `booknumberMask` | `String` | schema | Maske für Buchnummern |
| `externalDescription` | `String` | schema | Externe Beschreibung |
| `customer` | `DBRef` | schema | Reference to [customer](#entity-kunden-customers) |
| `longitude` | `Number` | schema | Längengrad |
| `latitude` | `Number` | schema | Breitengrad |
| `_class` | `String` | schema | Laufzeitklassen-Marker: `de.videoclinic.model.Location` |

The `location` entity is referenced by:
- [`appointment`](./planning.md#entity-termine-appointments)
- [`appointmentPlan`](./planning.md#entity-sprechstundenplan-appointment-plan)
- [`consultationData`](./treatment.md#entity-konsultationsdaten-consultation-data) (as `location` sub-entity)
- [`invoiceComponent`](./accounting.md#entity-rechnungskomponenten-invoice-components)
- [`invoiceReceiver`](./accounting.md#entity-rechnungsempf-nger-invoice-receivers)
- [`project`](./deprecated.md#entity-projekte-projects)
- [`treatment`](./treatment.md#entity-behandlungsverlauf-treatment)
- [`basisWebAppointment`](./interfaces.md#entity-web-terminanfragen-basis-web-appointment)
- [`onboardingHistory`](./user-management.md#entity-onboarding-verlauf-onboarding-history)
- [`cDRCallAssignment`](./external-data.md#entity-cdr-call-zuweisungen-cdr-call-assignment)
- [`room`](./planning.md#entity-r-ume-rooms)
- [`patientData`](./treatment.md#entity-patientenerg-nzungsdaten-patient-data)

### Sub-entities for location

#### Sub-entity: LocationPatientDataAccess
Konfiguration für den Zugriff auf externe Patientendaten (z.B. SecureBox).

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `user` | `String` | schema | Benutzername |
| `password` | `String` | schema | Passwort |
| `url` | `String` | schema | Zugriff-URL |
| `backupUrl` | `String` | schema | Backup-URL |
| `host` | `String` | schema | Host |
| `email` | `String` | schema | E-mail |
| `subject` | `String` | schema | Betreff |
| `active` | `Boolean` | schema | Status des Zugangs |
| `type` | `String` | schema | Art des Datenzugriffs:<br>• `INTERNAL_SECUREBOX` (Used)<br>• `EXTERNAL` (Used) |
| `address` | `String` | schema | URL oder IP-Adresse der SecureBox |
| `port` | `Number` | schema | Portnummer |
| `secure` | `Boolean` | schema | Ob SSL verwendet wird |
| `comment` | `String` | schema | Kommentar zur Konfiguration |

The `LocationPatientDataAccess` sub-entity is used within:
- [`location`](#entity-standorte-locations) (as `patientDataAccess` field)

## Entity: Standorttypen (Location Types)
Kategorisierung von Standorten: `JVA`, `CLINIC`, `POLICE`, etc.

### Table: locationType
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `name` | `String` | schema | Name des Typs:<br>• `JVA` (Used)<br>• `MRV` (Used)<br>• `SHIP` (Used)<br>• `CLINIC` (Used)<br>• `POLICE` (Used)<br>• `OTHER` (Used)<br>• `MUKI` (Used)<br>• `INTERN` (Used)<br>• `KUR` (Used) |
| `description` | `String` | inferred | Beschreibung |
| `prio` | `Number` | schema | Sortierpriorität |
| `_class` | `String` | schema | Laufzeitklassen-Marker: `de.videoclinic.model.LocationType` |

The `locationType` entity is referenced by:
- [`location`](#entity-standorte-locations) (conceptually, though not explicitly shown in schema samples)

## Entity: Seiten/Standorte (Sites)
Allgemeine Informationen zu physischen Standorten oder Web-Präsenzen.

### Table: site
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `name` | `String` | schema | Name der Seite |
| `address` | `String` | schema | Adresse |
| `zip` | `String` | schema | PLZ |
| `city` | `String` | schema | Ort |
| `primary` | `Boolean` | schema | Hauptstandort Kennzeichnung |
| `dateCreated` | `Date` | inferred | Erstellungsdatum |
| `createdBy` | `DBRef` | inferred | Erstellt von |
| `dateChanged` | `Date` | inferred | Änderungsdatum |
| `changedBy` | `DBRef` | inferred | Geändert von |
| `_class` | `String` | schema | Laufzeitklassen-Marker: `de.videoclinic.model.Site` |

The `site` entity is used for:
- (Organizational structure and location grouping)
