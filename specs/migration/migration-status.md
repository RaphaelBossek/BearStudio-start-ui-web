---
title: 'Migration Status'
---

# Migration Status

> **Last Updated**: 2026-04-01  
> **Status**: In Progress

---

## Overall Progress

| Phase | Status | Completion | Notes |
|-------|--------|------------|-------|
| Schema Design | ✅ Complete | 100% | Prisma schema defined |
| Migration Scripts | ⏳ In Progress | 25% | Basic scripts created |
| Data Validation | ⏳ Pending | 0% | Waiting for scripts |
| Dual Write | ⏳ Pending | 0% | Not started |
| Read Migration | ⏳ Pending | 0% | Not started |
| Write Migration | ⏳ Pending | 0% | Not started |
| Cutover | ⏳ Pending | 0% | Not started |

## Collection Migration Status

### Planning Domain

| Collection | Schema | Migration Script | Validated | Notes |
|------------|--------|------------------|-----------|-------|
| appointments | ✅ | ⏳ In Progress | ⏳ Pending | Core table |
| appointment_assignments | ✅ | ⏳ Pending | ⏳ Pending | |
| patient_appointments | ✅ | ⏳ Pending | ⏳ Pending | |
| expert_days | ✅ | ⏳ Pending | ⏳ Pending | |
| expert_weeks | ✅ | ⏳ Pending | ⏳ Pending | |
| shifts | ✅ | ⏳ Pending | ⏳ Pending | |
| councils | ✅ | ⏳ Pending | ⏳ Pending | |

### Customer Domain

| Collection | Schema | Migration Script | Validated | Notes |
|------------|--------|------------------|-----------|-------|
| customers | ✅ | ⏳ Pending | ⏳ Pending | |
| customer_locations | ✅ | ⏳ Pending | ⏳ Pending | |
| contacts | ✅ | ⏳ Pending | ⏳ Pending | |
| rooms | ✅ | ⏳ Pending | ⏳ Pending | |
| equipment | ✅ | ⏳ Pending | ⏳ Pending | |
| invoices | ✅ | ⏳ Pending | ⏳ Pending | |
| invoice_receivers | ✅ | ⏳ Pending | ⏳ Pending | |

### User Management Domain

| Collection | Schema | Migration Script | Validated | Notes |
|------------|--------|------------------|-----------|-------|
| users | ✅ | ⏳ Pending | ⏳ Pending | |
| user_profiles | ✅ | ⏳ Pending | ⏳ Pending | Embedded → normalized |
| groups | ✅ | ⏳ Pending | ⏳ Pending | |
| skills | ✅ | ⏳ Pending | ⏳ Pending | |
| onboarding_history | ✅ | ⏳ Pending | ⏳ Pending | |
| user_files | ✅ | ⏳ Pending | ⏳ Pending | S3 storage preferred |

### Treatment Domain

| Collection | Schema | Migration Script | Validated | Notes |
|------------|--------|------------------|-----------|-------|
| consultations | ✅ | ⏳ Pending | ⏳ Pending | |
| prescriptions | ✅ | ⏳ Pending | ⏳ Pending | |
| active_ingredients | ✅ | ⏳ Pending | ⏳ Pending | |
| warnings | ✅ | ⏳ Pending | ⏳ Pending | |
| treatments | ✅ | ⏳ Pending | ⏳ Pending | |
| treatment_categories | ✅ | ⏳ Pending | ⏳ Pending | |
| questionnaires | ✅ | ⏳ Pending | ⏳ Pending | |

### Accounting Domain

| Collection | Schema | Migration Script | Validated | Notes |
|------------|--------|------------------|-----------|-------|
| jobs | ✅ | ⏳ Pending | ⏳ Pending | |
| work_hours | ✅ | ⏳ Pending | ⏳ Pending | |
| price_lists | ✅ | ⏳ Pending | ⏳ Pending | |
| products | ✅ | ⏳ Pending | ⏳ Pending | |
| closed_months | ✅ | ⏳ Pending | ⏳ Pending | |
| expert_work_monthly | ✅ | ⏳ Pending | ⏳ Pending | |
| storno_groups | ✅ | ⏳ Pending | ⏳ Pending | |

### System Domain

| Collection | Schema | Migration Script | Validated | Notes |
|------------|--------|------------------|-----------|-------|
| notifications | ✅ | ⏳ Pending | ⏳ Pending | |
| notification_templates | ✅ | ⏳ Pending | ⏳ Pending | |
| motd_templates | ✅ | ⏳ Pending | ⏳ Pending | |
| cdr_assignments | ✅ | ⏳ Pending | ⏳ Pending | |
| cdr_calls | ✅ | ⏳ Pending | ⏳ Pending | |
| system_configs | ✅ | ⏳ Pending | ⏳ Pending | |

## Issues and Blockers

| Issue | Impact | Status | Resolution |
|-------|--------|--------|------------|
| None currently | - | - | - |

## Next Steps

1. Complete migration scripts for all collections
2. Run validation scripts on migrated data
3. Implement dual-write pattern
4. Begin read migration
5. Plan cutover window

## References

- [MongoDB Reference](./mongodb-reference.md) - Collection index
- [Schema Mapping](./schema-mapping.md) - Field-by-field mappings
- [Data Migration](./data-migration.md) - Migration scripts
- [Cutover Plan](./cutover-plan.md) - Production migration strategy
