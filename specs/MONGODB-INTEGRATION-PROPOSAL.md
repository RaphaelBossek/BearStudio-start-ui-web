# MongoDB Mapping Integration Proposal

> **Date**: 2026-03-31  
> **Purpose**: Integrate existing MongoDB schema documentation into migration plan  
> **Status**: For Review & Decision

---

## Current Situation Analysis

### What We Have

**`specs/mongodb-mapping/`** contains:
- ✅ **14 detailed schema documents** (250KB total)
- ✅ **ER diagrams** for each domain (Mermaid format)
- ✅ **Field-level documentation** with types and relationships
- ✅ **CQRS pattern documentation** (consultation vs consultationData)
- ✅ **Well-organized structure** by business domain

**Current Organization**:
```
mongodb-mapping/
├── README.md (index with collection tables)
├── planning.md (appointment, shift, expert availability)
├── treatment.md (consultations, treatments, patients)
├── user-management.md (users, groups, sessions)
├── customer.md (customers, locations, rooms)
├── accounting.md (invoices, jobs, worklog)
├── academy.md (videos, categories)
├── news.md (notifications, MOTD)
├── interfaces.md (BasisWeb integration)
├── external-data.md (ICD-10, medications)
├── capabilities.md (skills)
├── system.md (system collections)
├── deprecated.md (legacy collections)
└── analysis-consultation-vs-consultationData.md (CQRS pattern)
```

### How Analysis Documents Use MongoDB Mapping

**Example from analysis documents**:

```markdown
# Appointment List Analysis

## Data Model

See `../mongodb-mapping/planning.md` for:
- `appointment` collection schema
- `appointmentAssignment` relationships
- State machine (READY → STARTED → ACTIVE → DONE)

## Key Fields

From `mongodb-mapping/planning.md`:
- `appointment.state` - 12 possible values
- `appointment.type` - APPOINTMENT|SHIFT|COUNCIL|TREATMENT
- `appointmentAssignment.state` - 12 assignment states
```

**Current Reference Pattern**:
- Analysis docs reference `../mongodb-mapping/{domain}.md`
- MongoDB docs have ER diagrams + field types
- Analysis docs have business logic + workflows

---

## Integration Options

### Option A: Keep Separate, Enhance Cross-References ✅ RECOMMENDED

**Structure**:
```
specs/
├── mongodb-mapping/ (RETAIN AS-IS - Schema Reference)
│   ├── README.md
│   ├── planning.md
│   ├── treatment.md
│   └── ...
│
├── analysis/ (NEW - Functional Analysis)
│   ├── appointments/
│   │   ├── README.md
│   │   ├── list.md → References mongodb-mapping/planning.md
│   │   └── details.md → References mongodb-mapping/planning.md
│   └── consultations/
│       ├── README.md
│       ├── list.md → References mongodb-mapping/treatment.md
│       └── standard-form.md → References mongodb-mapping/treatment.md
│
└── migration/ (NEW - Migration Active Docs)
    ├── schema-mapping.md → Links to both mongodb-mapping/ and analysis/
    └── mongodb-reference.md → Index with migration status
```

**How It Works**:
1. **MongoDB Mapping** = **Schema Reference** (WHAT exists in database)
   - ER diagrams
   - Field types and constraints
   - Collection relationships
   - CQRS patterns

2. **Analysis Documents** = **Functional Specs** (HOW business uses it)
   - Business logic
   - Workflows
   - UI requirements
   - State machines

3. **Migration Docs** = **Transformation Guide** (HOW to migrate)
   - MongoDB → PostgreSQL mapping
   - Denormalization decisions
   - Migration scripts

**Cross-Reference Pattern**:
```markdown
# In analysis/appointments/list.md

## Data Model

For MongoDB schema details, see:
- [`../../mongodb-mapping/planning.md`](../../mongodb-mapping/planning.md#entity-termine-appointments)
- [`../../mongodb-mapping/planning.md`](../../mongodb-mapping/planning.md#entity-terminzuweisungen-appointment-assignments)

## Key Fields

| Field | Type | Source |
|-------|------|--------|
| `state` | enum (12 values) | mongodb-mapping/planning.md |
| `type` | enum (4 values) | mongodb-mapping/planning.md |
```

**Pros**:
- ✅ **No duplication** - Single source of truth for schema
- ✅ **Clear separation** - Schema vs Function vs Migration
- ✅ **Preserves existing work** - 250KB of detailed docs retained
- ✅ **Easy navigation** - Clear links between layers
- ✅ **Migration-friendly** - Can track what's migrated vs legacy

**Cons**:
- ⚠️ **Three places to look** - But clear cross-references mitigate
- ⚠️ **Need discipline** - Must maintain cross-references

**Effort**: **Minimal** (1-2 days to add cross-references)

---

### Option B: Merge into Domain Folders

**Structure**:
```
specs/
└── domains/
    └── appointments/
        ├── README.md
        ├── analysis/
        │   ├── list.md
        │   └── details.md
        ├── schema/
        │   └── mongodb.md (copied from mongodb-mapping/planning.md)
        └── migration/
            └── postgresql-mapping.md
```

**How It Works**:
- Split mongodb-mapping/ by domain
- Copy relevant schema docs into each domain folder
- Domain becomes self-contained

**Pros**:
- ✅ **Everything in one place** - Domain folder has all info
- ✅ **Good for navigation** - No cross-directory links

**Cons**:
- ❌ **Duplication** - planning.md referenced by appointments + shifts + dashboard
- ❌ **Hard to maintain** - Schema changes must update multiple copies
- ❌ **Breaks existing links** - All current references break
- ❌ **Loses big picture** - Can't see all MongoDB collections at once

**Effort**: **High** (5-7 days to split, copy, update all references)

---

### Option C: Integrate into Analysis Documents

**Structure**:
```
specs/
└── analysis/
    └── appointments/
        ├── README.md
        ├── list.md (includes schema section from mongodb-mapping)
        └── details.md (includes schema section)
```

**How It Works**:
- Copy schema sections from mongodb-mapping into each analysis doc
- Merge ER diagrams into analysis documents
- Delete mongodb-mapping/ after migration

**Pros**:
- ✅ **Single file per feature** - Analysis has everything

**Cons**:
- ❌ **Massive duplication** - planning.md schema copied to 10+ analysis files
- ❌ **ER diagrams duplicated** - Same diagram in multiple places
- ❌ **Maintenance nightmare** - Schema change = update 10+ files
- ❌ **Loses schema overview** - Can't see full database structure

**Effort**: **Very High** (10-14 days to merge, then ongoing maintenance burden)

---

### Option D: Create New Unified Schema Docs

**Structure**:
```
specs/
├── schema/
│   ├── README.md (new unified schema docs)
│   ├── appointments-schema.md (rewritten from scratch)
│   └── consultations-schema.md
│
├── mongodb-mapping/ (ARCHIVE after migration)
└── analysis/
```

**How It Works**:
- Write new schema documentation from scratch
- Combine MongoDB schema + PostgreSQL target
- Archive old mongodb-mapping/ after migration

**Pros**:
- ✅ **Fresh start** - Clean, consistent format
- ✅ **Forward-looking** - Includes PostgreSQL target

**Cons**:
- ❌ **Wastes existing work** - 250KB of detailed docs abandoned
- ❌ **High effort** - Rewrite everything (20-30 days)
- ❌ **Risk of errors** - Manual rewrite may miss details
- ❌ **Delays migration** - Must wait for new docs

**Effort**: **Very High** (20-30 days to rewrite all)

---

## Recommendation: Option A (Keep Separate, Enhance)

### Why Option A is Best

1. **Respects Existing Investment**
   - 250KB of detailed, well-written schema docs
   - ER diagrams already complete
   - Field-level documentation done

2. **Clear Separation of Concerns**
   ```
   mongodb-mapping/  =  WHAT (schema exists)
   analysis/         =  HOW (business uses it)
   migration/        =  TRANSFORM (A → B)
   ```

3. **Migration-Friendly**
   - Can mark collections as "migrated" progressively
   - Legacy schema remains for reference
   - New PostgreSQL schema documented separately

4. **Minimal Effort**
   - Add cross-references in analysis docs: 1-2 days
   - Create migration index: 0.5 days
   - Update mongodb-mapping README: 0.5 days
   - **Total: 2-3 days** vs 10-30 days for other options

5. **Scalable**
   - Easy to add new domains
   - Clear pattern for future docs
   - No duplication to maintain

---

## Implementation Plan (Option A)

### Phase 1: Add Cross-References (Week 1)

**Task 1.1**: Update analysis documents to reference mongodb-mapping

```markdown
# Template for analysis/{domain}/{feature}.md

## Data Model

For MongoDB schema and ER diagrams, see:
- [`../../mongodb-mapping/{domain}.md`](../../mongodb-mapping/{domain}.md#entity-{entity-name})

### Key Collections

| Collection | Purpose | Schema |
|------------|---------|--------|
| `appointment` | Individual appointments | [`mongodb-mapping/planning.md`](../../mongodb-mapping/planning.md#entity-termine-appointments) |
| `appointmentAssignment` | Expert assignments | [`mongodb-mapping/planning.md`](../../mongodb-mapping/planning.md#entity-terminzuweisungen-appointment-assignments) |

### Field Reference

| Field | Type | Values | Source |
|-------|------|--------|--------|
| `state` | enum | 12 states | [`mongodb-mapping/planning.md`](../../mongodb-mapping/planning.md#appointmentstate) |
| `type` | enum | 4 types | [`mongodb-mapping/planning.md`](../../mongodb-mapping/planning.md#appointmenttype) |
```

**Task 1.2**: Add "Related Analysis" sections to mongodb-mapping

```markdown
# At end of mongodb-mapping/planning.md

## Related Analysis Documents

- [Appointment List Analysis](../../analysis/appointments/list.md) - MonthTable grid, filters
- [Appointment Details](../../analysis/appointments/details.md) - 5-tab dialog, state machine
- [Shift Plan Analysis](../../analysis/shifts/list.md) - Shift plan management
```

---

### Phase 2: Create Migration Index (Week 1)

**Task 2.1**: Create `migration/mongodb-reference.md`

```markdown
# MongoDB Schema Reference

Quick index to legacy MongoDB collections with migration status.

## Planning Domain

| Collection | Schema | Analysis | Migration Status |
|------------|--------|----------|------------------|
| `appointment` | [`mongodb-mapping/planning.md`](../mongodb-mapping/planning.md#entity-termine-appointments) | [`analysis/appointments/list.md`](../analysis/appointments/list.md) | 🟡 In Progress |
| `appointmentAssignment` | [`mongodb-mapping/planning.md`](../mongodb-mapping/planning.md#entity-terminzuweisungen) | [`analysis/appointments/details.md`](../analysis/appointments/details.md) | 🟡 In Progress |
| `shiftPlan` | [`mongodb-mapping/planning.md`](../mongodb-mapping/planning.md#entity-schichtplan) | [`analysis/shifts/list.md`](../analysis/shifts/list.md) | 📋 Planned |

## Treatment Domain

| Collection | Schema | Analysis | Migration Status |
|------------|--------|----------|------------------|
| `consultationData` | [`mongodb-mapping/treatment.md`](../mongodb-mapping/treatment.md#entity-konsultationsdaten) | [`analysis/consultations/list.md`](../analysis/consultations/list.md) | 🔴 Not Started |
| `consultation` | [`mongodb-mapping/treatment.md`](../mongodb-mapping/treatment.md#entity-konsultationen) | [`analysis/consultations/list.md`](../analysis/consultations/list.md) | 🔴 Not Started |
```

**Task 2.2**: Create `migration/schema-mapping.md`

```markdown
# MongoDB → PostgreSQL Schema Mapping

Field-by-field transformation rules.

## appointment Collection

### MongoDB Schema
```javascript
{
  _id: ObjectId,
  state: "READY" | "STARTED" | ...,
  type: "APPOINTMENT" | "SHIFT" | ...,
  date: "2026-04-15",
  timeStart: "09:00",
  timeEnd: "10:00"
}
```

### PostgreSQL Schema
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  state appointment_state_enum NOT NULL,
  type appointment_type_enum NOT NULL,
  date DATE NOT NULL,
  time_start TIME NOT NULL,
  time_end TIME NOT NULL
);
```

### Transformation Rules
- `_id` (ObjectId) → `id` (UUID): Generate UUID v4
- `state` (string) → `state` (enum): Map to appointment_state_enum
- `date` (string) → `date` (date): Parse ISO string
```

---

### Phase 3: Update mongodb-mapping README (Week 2)

**Task 3.1**: Add migration status to mongodb-mapping/README.md

```markdown
# Videoclinic MongoDB Mapping

> **Status**: Legacy Reference (being migrated to PostgreSQL)  
> **Last Updated**: 2026-03-31  
> **Migration Progress**: 3/50 collections migrated

## Migration Status

| Domain | Collections | Migrated | Status |
|--------|-------------|----------|--------|
| Planning | 9 | 2 | 🟡 In Progress |
| Treatment | 11 | 0 | 🔴 Not Started |
| User Management | 9 | 1 | 🟡 In Progress |
| Customer | 7 | 0 | 🔴 Not Started |

## Active Migration Documentation

For migration progress and PostgreSQL mapping:
- [`../migration/mongodb-reference.md`](../migration/mongodb-reference.md) - Quick index
- [`../migration/schema-mapping.md`](../migration/schema-mapping.md) - Field-by-field mapping
- [`../migration/migration-status.md`](../migration/migration-status.md) - Progress tracking
```

---

### Phase 4: Validate Cross-References (Week 2)

**Task 4.1**: Create validation script

```bash
#!/bin/bash
# scripts/verify-cross-references.sh

echo "Verifying mongodb-mapping cross-references..."

errors=0

# Check all analysis docs reference valid mongodb-mapping files
for file in specs/analysis/*/*.md; do
  grep -oP 'mongodb-mapping/[^)]+' "$file" | while read ref; do
    if [ ! -f "specs/$ref" ]; then
      echo "❌ Broken reference in $file: $ref"
      errors=$((errors + 1))
    fi
  done
done

if [ $errors -eq 0 ]; then
  echo "✅ All mongodb-mapping references valid"
  exit 0
else
  echo "❌ Found $errors broken references"
  exit 1
fi
```

**Task 4.2**: Manual spot-check

- Pick 5 random analysis documents
- Verify all mongodb-mapping links work
- Verify ER diagrams render correctly
- Check field references are accurate

---

## Timeline

| Week | Phase | Tasks | Effort |
|------|-------|-------|--------|
| 1 | Cross-References | Update analysis docs, add related sections | 2 days |
| 1 | Migration Index | Create mongodb-reference.md, schema-mapping.md | 1 day |
| 2 | Update README | Add migration status to mongodb-mapping/ | 0.5 days |
| 2 | Validation | Verify all links, spot-checks | 0.5 days |
| **Total** | | | **4 days** |

---

## Comparison Summary

| Option | Effort | Duplication | Maintains Existing Work | Migration-Friendly | Recommendation |
|--------|--------|-------------|------------------------|-------------------|----------------|
| **A: Keep Separate** | 4 days | None | ✅ Yes | ✅ Yes | ⭐⭐⭐⭐⭐ |
| B: Merge into Domains | 7 days | Low | ⚠️ Partially | ⚠️ Moderate | ⭐⭐⭐ |
| C: Integrate into Analysis | 14 days | High | ❌ No | ❌ No | ⭐⭐ |
| D: Rewrite Unified | 30 days | None | ❌ No | ⚠️ Moderate | ⭐⭐ |

---

## Decision Required

**Please choose one option:**

- **Option A** (Recommended): Keep `mongodb-mapping/` separate, add cross-references
- **Option B**: Merge schema docs into domain folders
- **Option C**: Integrate schema into analysis documents
- **Option D**: Rewrite unified schema documentation

**Default**: If no decision is made by {date}, we will proceed with **Option A** as it provides the best balance of:
- Respecting existing work (250KB of detailed docs)
- Minimal effort (4 days vs 10-30 days)
- Clear separation of concerns
- Migration-friendly structure

---

**Related Documents**:
- [`MIGRATION-PLAN.md`](./MIGRATION-PLAN.md) - Overall migration strategy
- [`DOCUMENTATION-IMPROVEMENTS.md`](./DOCUMENTATION-IMPROVEMENTS.md) - Documentation best practices
- [`mongodb-mapping/README.md`](./mongodb-mapping/README.md) - Current MongoDB schema docs
