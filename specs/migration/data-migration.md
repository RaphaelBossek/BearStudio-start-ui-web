# Data Migration Guide

> **Last Updated**: 2026-04-01  
> **Status**: Draft  
> **See Also**: [MongoDB Reference](./mongodb-reference.md), [Schema Mapping](./schema-mapping.md), [Cutover Plan](./cutover-plan.md)

---

## Overview

This guide describes the process for migrating data from MongoDB to PostgreSQL. The migration is performed in phases to minimize risk and ensure data integrity.

## Migration Phases

### Phase 1: Schema Setup

**Goal**: Create PostgreSQL schema with all tables, indexes, and constraints.

```bash
# Generate Prisma schema from MongoDB
prisma db pull --url mongodb://...

# Transform to PostgreSQL schema
# (manual transformation based on schema-mapping.md)

# Apply schema to PostgreSQL
prisma migrate dev --name initial_schema
```

### Phase 2: Data Export

**Goal**: Export all MongoDB collections to JSON files.

```bash
# Export collections
mongoexport --db bearstudio --collection appointments --out appointments.json
mongoexport --db bearstudio --collection customers --out customers.json
# ... repeat for all collections
```

### Phase 3: Data Transformation

**Goal**: Transform MongoDB JSON to PostgreSQL-compatible format.

```typescript
// Example transformation script
import { MongoClient } from 'mongodb';
import { PrismaClient } from '@prisma/client';

const mongo = new MongoClient('mongodb://...');
const prisma = new PrismaClient();

async function migrateAppointments() {
  const appointments = await mongo.db('bearstudio')
    .collection('appointments')
    .find({})
    .toArray();
  
  for (const appointment of appointments) {
    await prisma.appointment.create({
      data: {
        id: appointment._id.toString(),
        customerId: appointment.customerId.toString(),
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        state: appointment.state,
        // ... map all fields
      },
    });
  }
}
```

### Phase 4: Data Import

**Goal**: Import transformed data into PostgreSQL.

```bash
# Run migration script
node scripts/migrate-data.js

# Verify row counts
psql -c "SELECT COUNT(*) FROM appointments;"
```

### Phase 5: Validation

**Goal**: Validate data integrity and consistency.

```sql
-- Check row counts match
SELECT 'appointments' as table, COUNT(*) FROM appointments
UNION ALL
SELECT 'customers', COUNT(*) FROM customers
UNION ALL
-- ... for all tables

-- Check foreign key integrity
SELECT a.id, a.customer_id
FROM appointments a
LEFT JOIN customers c ON a.customer_id = c.id
WHERE c.id IS NULL;

-- Check data quality
SELECT state, COUNT(*) 
FROM appointments 
GROUP BY state;
```

### Phase 6: Dual Write

**Goal**: Write to both MongoDB and PostgreSQL simultaneously.

```typescript
// Example dual-write pattern
async function createAppointment(data) {
  // Write to PostgreSQL (primary)
  const pgAppointment = await prisma.appointment.create({ data });
  
  // Write to MongoDB (fallback)
  await mongo.db('bearstudio')
    .collection('appointments')
    .insertOne({ ...data, _id: new ObjectId(pgAppointment.id) });
  
  return pgAppointment;
}
```

### Phase 7: Read Migration

**Goal**: Migrate read operations to PostgreSQL one by one.

```typescript
// Example read migration with fallback
async function getAppointment(id: string) {
  try {
    // Try PostgreSQL first
    return await prisma.appointment.findUnique({ where: { id } });
  } catch (error) {
    // Fallback to MongoDB
    console.error('PostgreSQL read failed, using MongoDB fallback', error);
    return await mongo.db('bearstudio')
      .collection('appointments')
      .findOne({ _id: new ObjectId(id) });
  }
}
```

### Phase 8: Write Migration

**Goal**: Migrate write operations to PostgreSQL.

```typescript
// Switch to PostgreSQL-only writes
async function updateAppointment(id: string, data: Partial<Appointment>) {
  // PostgreSQL only (no more MongoDB writes)
  return await prisma.appointment.update({
    where: { id },
    data,
  });
}
```

### Phase 9: Cutover

**Goal**: Switch all traffic to PostgreSQL, archive MongoDB.

See [cutover-plan.md](./cutover-plan.md) for detailed cutover procedure.

## Rollback Plan

If issues are discovered during migration:

1. **Stop the migration**: Halt all migration scripts
2. **Assess the issue**: Determine scope and impact
3. **Rollback data**: Restore from PostgreSQL backup
4. **Revert code**: Switch back to MongoDB-only code paths
5. **Fix and retry**: Address the issue and restart migration

### Rollback Commands

```bash
# Restore PostgreSQL from backup
pg_restore -d bearstudio_prod backup_20260401.dump

# Revert code to MongoDB-only
git checkout main -- src/database/
git commit -m "Revert to MongoDB after migration issue"
```

## Validation Checklist

- [ ] All collections exported from MongoDB
- [ ] All data transformed correctly
- [ ] Row counts match between MongoDB and PostgreSQL
- [ ] Foreign key relationships intact
- [ ] No NULL values in required fields
- [ ] Date/time values converted correctly
- [ ] Enum values mapped correctly
- [ ] Dual-write working for all operations
- [ ] Read operations validated
- [ ] Write operations validated
- [ ] Performance acceptable
- [ ] Rollback tested

## Migration Scripts Location

Migration scripts are located in:
- `scripts/migration/` - Data migration scripts
- `scripts/validation/` - Validation scripts
- `scripts/rollback/` - Rollback scripts

## References

- [MongoDB Reference](./mongodb-reference.md) - Collection index
- [Schema Mapping](./schema-mapping.md) - Field-by-field mappings
- [Denormalization Patterns](./denormalization-patterns.md) - Embedded vs normalized
- [Cutover Plan](./cutover-plan.md) - Production migration strategy
- [Migration Status](./migration-status.md) - Progress tracking
