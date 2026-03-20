Based on a deep analysis of the `de.videoclinic.model` definitions, `de.videoclinic.service` implementations, and direct inspection of the MongoDB `videoclinic` database via MCP tools, here is a comprehensive breakdown of the architectural split between `ConsultationData` and `Consultation`.

### 1. Architectural Intent: Vertical Partitioning (CQRS Lite)
The system employs a **Vertical Partitioning** (or CQRS-lite) pattern by splitting the Consultation aggregate root into two distinct persistence models and MongoDB collections.
- **`Consultation`** acts as the lightweight "Header" or "Summary Projection". It contains only essential metadata required for search, filtering, and reporting.
- **`ConsultationData`** extends `Consultation` and acts as the fully inflated "Payload" or "Detailed Record". It contains all medical domain details, file metadata, historical logs, and specialized structures.

### 2. Database Layer (MongoDB)
When inspecting the database schema and storage through MCP, we find:
- **Two Distinct Collections**: Spring Data MongoDB maps these two models to separate collections: `consultation` (101,923 documents) and `consultationData` (101,913 documents). They maintain a strict 1:1 relationship with matching `_id` values.
- **Storage Footprint**: The `consultation` collection is **~130 MB**, while `consultationData` is **~212 MB**. Because raw files are stored in an external WebDAV/GridFS handler (referenced via `ConsultationFile`), the size discrepancy is entirely composed of heavy embedded JSON sub-documents (e.g., medical anamnesis, logs, and long histories).
- **Index Strategy**: The `consultation` collection contains specialized compound indexes (e.g., `{ "location._id": 1, "period": 1 }`) designed for efficient list queries and filtering. The `consultationData` collection lacks these list-based indexes because it is strictly retrieved by its primary key `_id`.

### 3. Model Separation (`@core/src/main/java/de/videoclinic/model/`)
- **`Consultation.java` (Base Model)**
  - **Contents**: Basic IDs, statuses (`ConsultationState`, `ConsultationType`), timestamps (`timeStart`, `timeEnd`, `dateTransmitted`), user references (`doctor`, `reportingExpert`), tags, and lightweight flattened DTOs like `LocationView` or `JobView`.
  - **Purpose**: Used heavily by list endpoints, administrative dashboards, scheduling aggregations, and Excel export services.
- **`ConsultationData.java` (Extended Model)**
  - **Contents**: Inherits everything from `Consultation` and introduces heavy sub-documents: `ConsultationBodyData` (patient physicals), `ConsultationDocumentData` (notes/docs), `ConsultationStandardData` (diagnoses, medical prescriptions, anamnesis), `ConsultationReporting`, `ConsultationHistory`, `logs`, and `List<ConsultationFile> attachments`.
  - **Purpose**: Used when a doctor or system needs to execute business logic, edit a medical record, process file uploads, or perform data validation against the full medical state.

### 4. Service Layer Implementation (`ConsultationService.java`)
The implementation orchestrates dual writes and selective reads to optimize performance:

#### The Dual Write Mechanism
In `ConsultationService.java`, the `doSave(ConsultationData c)` method ensures both collections are synchronized manually:
```java
ConsultationData doSave(ConsultationData c) {
    // 1. Saves the fully inflated payload to the consultationData collection
    dao.getConsultationDataDao().save(c);

    // 2. Uses a copy-constructor (new Consultation(c)) that intentionally drops 
    // the heavy payload fields, mapping only the base metadata.
    // 3. Forcefully overwrites the document with the same _id in the consultation collection.
    dao.getConsultationDao().forceSave(new Consultation(c));
    return c;
}
```
This forces all updates to go through `ConsultationData` to prevent data drift between the two collections.

#### Read Operations
- **`dao.getConsultationDao()` (`Consultation`)**: Used by `getAll()`, `downloadExport()`, `AdminService`, and `WorkExportService`. Querying the smaller `consultation` collection drastically lowers network bandwidth and minimizes the MongoDB memory working set during large table scans and aggregations (e.g., `getCountPerDay`).
- **`dao.getConsultationDataDao()` (`ConsultationData`)**: Used by `get(id)`, `start()`, file attachment operations, and synchronization jobs. When a specific record is opened by a user, the system queries this DAO to load the complete object graph needed for medical context manipulation.

### Summary: Why this approach?
Loading a list of 5,000 consultations for an export or an administrative table view would cause severe performance bottlenecks (memory bloat and deserialization lag) if the system had to fetch the heavy anamnesis text, medical logs, and attachment lists for every record. 

By mirroring the base metadata into a separate `consultation` collection, the system achieves fast list queries and aggregations, while keeping the heavy transactional boundaries constrained to the `consultationData` collection accessed via single `_id` lookups.
