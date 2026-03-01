# AI Coding Agent Requirements: Database Mapping Generation

This document defines the requirements for an AI coding agent to generate the `specs/draft/db-mapping.md` file by mapping business entities to a database schema.

## Goal
Automatically generate a structured Markdown document (`db-mapping.md`) that maps business requirements from `specs/draft/all-together.md` to the database schema defined in `specs/draft/videoclinic.dbml`.

## Input Sources
1.  **Business Requirements:** `specs/draft/all-together.md` - Contains definitions of entities like "Sprechstundenplan", "Dienstleistung", "Fähigkeiten", "Experte", etc., along with functional rules.
2.  **Database Schema (Static):** `specs/draft/videoclinic.dbml` - Contains the technical table and column definitions. This file must be kept synchronized with any new discoveries from live database analysis.
3.  **Collection Name Mapping:** If a collection is renamed for better clarity (e.g., `warning` -> `patientAlerts`), the mapping must be documented.
4.  **Live Database Analysis (Dynamic):** MongoDB tools - When mapping to an existing database, the agent must use MongoDB MCP tools (e.g., `collection-schema`, `find`) to verify the actual structure, especially for nested documents and fields not fully defined in DBML.

## Output Structure (`db-mapping.md`)
The output must be a Markdown file with the following structure:

1.  **Header:** A title "Database Mapping Specification" and a brief introduction mentioning the source files.
2.  **Database Overview:** A H2 chapter "Database Overview" containing a Markdown table listing all top-level collections/tables with their Business Name, a brief Summary, and the associated Java Model.
    *   **Model Column:** The "Model" column should contain the Java class name (from the `_class` field in MongoDB).
    *   **Prefix Rule:** The common package prefix `de.videoclinic.model.` must be omitted (e.g., use `AppointmentPlan` instead of `de.videoclinic.model.AppointmentPlan`).
    *   **Sub-packages:** If the class is in a sub-package, include it (e.g., `dto.LocationRoomsDto`).
3.  **Collection Name Mapping:** A dedicated chapter (H2 header) listing the mapping between the original MongoDB collection names and the newly introduced business-friendly names.
4.  **Chapters:** One chapter (H2 header) for each major business entity identified in `all-together.md`.
4.  **Table Mapping:**
    *   Under each H2 chapter, a brief description of the database table's purpose.
    *   An H3 header specifying the table name and its original name if renamed (e.g., `### Table: patientAlerts (former: warning)`).
    *   A Markdown table listing the columns.
4.  **Column Table Format:**
    | Column | Type | Description (from all-together.md) |
    | :--- | :--- | :--- |
    | `column_name` | `data_type` | Business description or mapping from requirements |
5.  **Functionality Details:** An H3 header "Functionality Details" following the mapping table, containing additional logic, constraints, or business rules from `all-together.md` related to that entity.
6.  **Sub-entities (Nested Documents):** If a table contains complex nested JSON documents, an H3 header "Sub-entities for [TableName]" must be added. Each complex nested structure must be documented as an H4 sub-entity (e.g., `#### Sub-entity: SkillRule`).

## Logic & Mapping Rules
1.  **Entity Identification:** Parse `all-together.md` to identify primary business entities (e.g., "Sprechstundenplan", "Dienstleistung").
2.  **Table Matching:** Match identified business entities to their corresponding tables in `videoclinic.dbml` (e.g., "Sprechstundenplan" -> `appointmentPlan`, "Experte" -> `user`).
3.  **Column Mapping:**
    *   Map list elements or properties from `all-together.md` to the most relevant columns in the matched table.
    *   The "Description" column in the output table must use the wording from `all-together.md`.
    *   The "Type" column must reflect the data type defined in the DBML file or discovered via MongoDB analysis (e.g., `varchar`, `number`, `timestamp`, `boolean`, `Document`, `Array`, `DBRef`).
    *   **Primary Keys:** Every table and sub-entity MUST include an `_id` field (usually `Long` or `number [pk]`) to enable cross-referencing and relationship resolution in tools like dbdiagram.io. This is a MANDATORY principle for all structures.
    *   **Field Type Deep Analysis Principle:** If a data structure is discovered and a field is of type `String` or its name contains the substring "type" or "status" (case-insensitive), the agent MUST perform a deep analysis (e.g., using `distinct` or `aggregate`) to identify all possible enum/categorical values before proceeding with further mapping or documentation.
        - If the analysis reveals a repetitive pattern (enum), list all discovered values marked as `(Used)`.
        - If the field contains non-repetitive text, classify it as `Freitext` or `Strukturierter Text` (e.g., for progress messages or descriptions).
        - If the field uses systematic classification codes, mark it as `Systematische Kodierung`.
    *   **Complex Fields:** For `Document` or `Array` types that represent a specific nested structure, provide a Markdown link to the corresponding sub-entity definition (e.g., `[SkillRule](#sub-entity-skillrule)`).
    *   **Sub-entity Naming:** Use CamelCase for all sub-entity names (e.g., `#### Sub-entity: UserProfile`).
4.  **Nested Structure & Enum Analysis:**
    *   Deeply analyze nested JSON documents discovered via MongoDB.
    *   **Enum/Categorical Analysis:** For any field that acts as an enum, set of roles, or categorical value (regardless of whether it's an `Array` or a single `String`), the agent must scan the database to identify all unique values and their types. All possible values must be listed in the documentation.
        - **Deep Dive Strategy:** Use `db.collection.distinct('fieldName')` or `aggregate` with `$group` to find all possible values. 
        - **Value Discovery:** Document even those values that are not part of the initial business specs but exist in the live data.
    *   If a value's usage status can be determined (e.g., in use vs. present but unused in the dataset), it should be marked accordingly (e.g., `VALUE (Used)`, `OTHER (Not used)`).
    *   **Nested Document Analysis:** Identify complex JSON structures within fields (e.g., `doctor`, `job`, `location`) and promote them to dedicated sub-entities.
        - **Sub-entity Mapping:** Map each field of the nested document to its own sub-entity table in the Markdown documentation and DBML.
    *   Identify recurring structures across different fields or tables and merge them into reusable sub-entity definitions to avoid redundancy.
    *   **DBML Update:** Any newly discovered table or nested structure must also be added to `specs/draft/videoclinic.dbml` to maintain a consistent technical schema representation. This includes:
        - Defining the new `Table` with an `_id` field.
        - Establishing relationships using `Ref` syntax for `DBRef` fields or logical pointers (e.g., `Ref: user.userProfile > UserProfile._id`).
        - Adding notes for enum values using a consistent format (e.g., `[note: 'Values: VAL1, VAL2']`).
        - Ensuring all nested documents discovered in MongoDB are formally defined as tables instead of using generic `object` types.
5.  **Functional Integration:** Extract any detailed explanations (e.g., shift times for `appointmentPlan`, billing types for `jobId`) and place them in the "Functionality Details" section.
6.  **Consistency:** Ensure all entities described in `all-together.md` are covered in the mapping.
7.  **Unmatched Tables:** Any tables in `videoclinic.dbml` or discovered in the live database that cannot be matched with information in `all-together.md` must be added at the end of the document.
    *   Each unmatched table must have its own chapter (H2 header).
    *   The chapter title must be marked as unknown (e.g., `## Unknown: TableName`).
    *   Include the column mapping table for these unknown chapters as well, even if the description remains empty or generic.

## Formatting Constraints
- Use standard Markdown.
- Ensure horizontal separators (`---`) between major chapters.
- Maintain consistency with the existing style of `db-mapping.md`.
- **Enum Documentation:** For enums or restricted string sets, list all verified values in bullet points or comma-separated lists within the "Column" or "Description" fields of the mapping table, or within a `[note: '...']` in the DBML file.
