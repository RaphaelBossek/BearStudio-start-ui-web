---
title: 'Migration'
---

# Migration Directory

This directory contains data migration guides and documentation.

## Contents

- **mongodb-reference.md** - Quick index to legacy MongoDB collections
- **schema-mapping.md** - MongoDB → PostgreSQL field-by-field mapping
- **data-migration.md** - Migration scripts, validation, rollback
- **denormalization-patterns.md** - What was embedded, what is normalized
- **cutover-plan.md** - Production migration strategy
- **migration-status.md** - Tracks progress per collection

## Migration Status

| Collection | Status | Migrated To | Notes |
|------------|--------|-------------|-------|
| appointments | 🔄 | appointments | In progress |
| consultations | 🔄 | consultations | In progress |
| users | 🔄 | users | In progress |

🔄 In Progress | ✅ Complete | ⏳ Pending
