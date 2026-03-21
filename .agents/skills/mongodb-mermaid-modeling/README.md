# MongoDB Mermaid Modeling Skill

A project-specific skill capturing the principles for reading and generating Mermaid ER diagrams from the Videoclinic MongoDB schema.

## Purpose

This skill provides the conceptual framework needed to correctly interpret the `videoclinic.dbml` schema and `specs/mongodb-mapping/` domain mapping files, and to represent them as Mermaid ER diagrams.

## Core Principles

- **Collections vs sub-documents**: camelCase = MongoDB collection; PascalCase = embedded sub-document
- **Field types**: `schema` (direct field) | `snapshot` (denormalized copy) | `inferred` (observed in data)
- **`__ref_snapshot_*_id` convention**: signals a full embedded document snapshot, not a plain FK
- **Snapshots are frozen**: embedded copies do not update when the source document changes
- **Multi-level nesting**: a snapshot can itself contain another snapshot (e.g., `PlanLocation` → `PlanCustomer`)
- **Context-shaped snapshots**: the same source entity produces differently-named snapshot types per context

## When to Use

- Reading or generating diagrams from `specs/draft/videoclinic.dbml`
- Designing new MongoDB document models that embed denormalized data
- Explaining data lineage for a field that uses the `__ref_snapshot_` convention
- Answering questions about why a value in a nested document differs from the current source collection

## Diagram Reference

ER diagrams are embedded at the top of each domain file in [`specs/mongodb-mapping/`](../../../specs/mongodb-mapping/):
`customer.md`, `planning.md`, `capabilities.md`, `user-management.md`, `treatment.md`, `academy.md`, `news.md`, `interfaces.md`, `external-data.md`, `accounting.md`, `system.md`, `deprecated.md`

## Source Documents

- Schema: `specs/draft/videoclinic.dbml`
- Mapping: `specs/mongodb-mapping/` (one file per domain)
