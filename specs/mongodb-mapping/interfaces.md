# Interfaces

[← Back to Index](./README.md)

This file covers the Interfaces category: data exchange and integration with external systems like BasisWeb.

---

## ER Diagram

External data exchange with BasisWeb (JVA patient systems).

```mermaid
erDiagram
    basisWebData {
        bigint _id PK
        string uuid
        bigint jva
        string jnumber
        string familienname
        string vorname
        datetime dateDecrypted
    }
    basisWebAppointment {
        bigint _id PK
        string uuid
        bigint location_id FK
        bigint jva
        string jnumber
        datetime start
    }
    BasisWebMedication {
        string date
        string type
        string content
        string entry
    }
    BasisWebWarning {
        string date
        string type
        string content
    }
    BasisWebEntry {
        string date
        string type
        string content
    }

    basisWebData ||--o{ BasisWebMedication : "embeds[]"
    basisWebData ||--o{ BasisWebWarning : "embeds[]"
    basisWebData ||--o{ BasisWebEntry : "embeds[]"
```

---

## Entities in This Category

| Table Name (DBML) | Business Entity | Description Summary |
| :--- | :--- | :--- |
| [`basisWebData`](#entity-jva-patientendaten-basis-web-data) | JVA Patientendaten (Basis Web Data) | Encrypted patient information from external JVA systems. |
| [`basisWebAppointment`](#entity-web-terminanfragen-basis-web-appointment) | Web-Terminanfragen (Basis Web Appointment) | External appointment requests originating from BasisWeb. |

---

## Entity: JVA Patientendaten (Basis Web Data)
Vom JVA-System übermittelte Patientendaten, die verschlüsselt in der Datenbank abgelegt werden.

### Table: basisWebData
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `uuid` | `String` | schema | Eindeutige ID der Übermittlung |
| `jva` | `Long` | schema | ID der JVA |
| `jnummer` | `String` | schema | J-Nummer des Gefangenen |
| `buchnummer` | `String` | schema | Buchnummer des Gefangenen |
| `familienname` | `String` | schema | Familienname |
| `geburtsname` | `String` | schema | Geburtsname |
| `vorname` | `String` | schema | Vorname |
| `geburtsdatum` | `String` | schema | Geburtsdatum |
| `staatsangehoerigkeit` | `String` | schema | Staatsangehörigkeit |
| `geburtsland` | `String` | schema | Geburtsland |
| `geschlecht` | `String` | schema | Geschlecht |
| `medication` | `Array` | schema | Liste übermittelter Medikamente ([BasisWebMedication](#sub-entity-basiswebmedication)) |
| `warning` | `Array` | schema | Liste übermittelter Warnhinweise ([BasisWebWarning](#sub-entity-basiswebwarning)) |
| `dateDecrypted` | `Date` | inferred | Entschlüsselungszeitpunkt |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `appointment` | `DBRef` | schema | Associated appointment (Reference to [appointment](./planning.md#entity-termine-appointments)) |
| `_class` | `String` | schema | Laufzeitklassen-Marker: `de.videoclinic.model.BasisWebData` |

The `basisWebData` entity is referenced by:
- [`consultationData`](./treatment.md#entity-konsultationsdaten-consultation-data) (via `basisWebDataId`)

### Sub-entities for basisWebData

#### Sub-entity: BasisWebMedication
Übermitteltes Medikament aus dem JVA-System.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `date` | `String` | schema | Datum |
| `type` | `String` | schema | Art des Medikaments (Encrypted/Hashed) |
| `content` | `String` | schema | Inhalt/Wirkstoff |
| `entry` | `String` | schema | Eintragstext |
| `note` | `String` | schema | Notiz |
| `until` | `String` | schema | Gültig bis |

The `BasisWebMedication` sub-entity is used within:
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data) (as `medication` array)

#### Sub-entity: BasisWebWarning
Übermittelter Warnhinweis aus dem JVA-System.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `date` | `String` | schema | Datum |
| `active` | `String` | schema | Status (Encrypted/Hashed) |
| `type` | `String` | schema | Art der Warnung (Encrypted/Hashed) |
| `content` | `String` | schema | Inhaltstext |

The `BasisWebWarning` sub-entity is used within:
- [`basisWebData`](#entity-jva-patientendaten-basis-web-data) (as `warning` array)

#### Sub-entity: BasisWebEntry
Allgemeiner medizinischer Eintrag aus dem JVA-System.

| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `String` | inferred | Internal identifier |
| `date` | `String` | schema | Datum |
| `active` | `String` | schema | Status (Encrypted/Hashed) |
| `type` | `String` | schema | Art des Eintrags (Encrypted/Hashed) |
| `content` | `String` | schema | Inhaltstext |

The `BasisWebEntry` sub-entity is used within:
- (Internal JVA patient data processing)

## Entity: Web-Terminanfragen (Basis Web Appointment)
Vom Web-System übermittelte Terminanfragen.

### Table: basisWebAppointment
| Column | Type | Field Type | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `Long` | schema | Interner Bezeichner |
| `version` | `Long` | schema | Versionsnummer |
| `uuid` | `String` | schema | Eindeutige ID der Anfrage |
| `start` | `Date` | schema | Gewünschter Startzeitpunkt |
| `location` | `Long` | schema | Reference to [location](./customer.md#entity-standorte-locations) |
| `jva` | `Long` | schema | ID der JVA |
| `dateCreated` | `Date` | schema | Erstellungsdatum |
| `_class` | `String` | schema | Laufzeitklassen-Marker: `de.videoclinic.model.BasisWebAppointment` |

The `basisWebAppointment` entity is referenced by:
- [`appointment`](./planning.md#entity-termine-appointments) (implicitly when converted to an appointment)
