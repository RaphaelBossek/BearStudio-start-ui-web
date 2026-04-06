---
title: 'Mongodb Reference'
---

# MongoDB Reference Documentation

> **Last Updated**: 2026-04-01  
> **Status**: Legacy documentation - migrating to PostgreSQL  
> **See Also**: [Data Migration Guide](./data-migration.md), [Schema Mapping](./schema-mapping.md)

---

## Overview

This directory contains reference documentation for the legacy MongoDB collections. This is kept for historical reference during the migration to PostgreSQL.

## Collection Index

### Planning Collections

| Collection | Status | PostgreSQL Table | Migration Notes |
|------------|--------|------------------|-----------------|
| `appointments` | ⚠️ Legacy | `appointments` | Core appointment data with assignments |
| `appointmentassignments` | ⚠️ Legacy | `appointment_assignments` | Assignment relationships |
| `patientappointments` | ⚠️ Legacy | `patient_appointments` | Patient-appointment links |
| `expertdays` | ⚠️ Legacy | `expert_days` | Expert availability calendar |
| `expertweeks` | ⚠️ Legacy | `expert_weeks` | Expert weekly schedules |
| `shifts` | ⚠️ Legacy | `shifts` | Shift definitions |
| `councils` | ⚠️ Legacy | `councils` | Council planning data |

### Customer Collections

| Collection | Status | PostgreSQL Table | Migration Notes |
|------------|--------|------------------|-----------------|
| `customers` | ⚠️ Legacy | `customers` | Customer master data |
| `customerlocations` | ⚠️ Legacy | `customer_locations` | Location addresses |
| `contacts` | ⚠️ Legacy | `contacts` | Contact persons |
| `rooms` | ⚠️ Legacy | `rooms` | Room definitions |
| `equipment` | ⚠️ Legacy | `equipment` | Equipment inventory |
| `invoices` | ⚠️ Legacy | `invoices` | Invoice records |
| `invoicereceivers` | ⚠️ Legacy | `invoice_receivers` | Invoice receiver configs |

### User Management Collections

| Collection | Status | PostgreSQL Table | Migration Notes |
|------------|--------|------------------|-----------------|
| `users` | ⚠️ Legacy | `users` | User accounts |
| `userprofiles` | ⚠️ Legacy | `user_profiles` | Profile data (embedded → normalized) |
| `groups` | ⚠️ Legacy | `groups` | User groups |
| `skills` | ⚠️ Legacy | `skills` | Skill definitions |
| `onboardinghistory` | ⚠️ Legacy | `onboarding_history` | Onboarding progress tracking |
| `userfiles` | ⚠️ Legacy | `user_files` | User-uploaded files |

### Treatment Collections

| Collection | Status | PostgreSQL Table | Migration Notes |
|------------|--------|------------------|-----------------|
| `consultations` | ⚠️ Legacy | `consultations` | Consultation records |
| `prescriptions` | ⚠️ Legacy | `prescriptions` | Prescription data |
| `activeingredients` | ⚠️ Legacy | `active_ingredients` | Medication ingredients |
| `warnings` | ⚠️ Legacy | `warnings` | Treatment warnings |
| `treatments` | ⚠️ Legacy | `treatments` | Treatment definitions |
| `treatmentcategories` | ⚠️ Legacy | `treatment_categories` | Category hierarchy |
| `questionnaires` | ⚠️ Legacy | `questionnaires` | Patient questionnaires |

### Accounting Collections

| Collection | Status | PostgreSQL Table | Migration Notes |
|------------|--------|------------------|-----------------|
| `invoices` | ⚠️ Legacy | `invoices` | Invoice records (duplicate?) |
| `jobs` | ⚠️ Legacy | `jobs` | Job configurations |
| `workhours` | ⚠️ Legacy | `work_hours` | Work hour categories |
| `priceLists` | ⚠️ Legacy | `price_lists` | Job price lists |
| `products` | ⚠️ Legacy | `products` | Product catalog |
| `closedmonths` | ⚠️ Legacy | `closed_months` | Accounting period locks |
| `expertworkmonthly` | ⚠️ Legacy | `expert_work_monthly` | Monthly expert work logs |
| `stornogroups` | ⚠️ Legacy | `storno_groups` | Cancellation rule groups |

### System Collections

| Collection | Status | PostgreSQL Table | Migration Notes |
|------------|--------|------------------|-----------------|
| `notifications` | ⚠️ Legacy | `notifications` | System notifications |
| `notificationtemplates` | ⚠️ Legacy | `notification_templates` | Email templates |
| `motdtemplates` | ⚠️ Legacy | `motd_templates` | Message of the day |
| `cdrassignments` | ⚠️ Legacy | `cdr_assignments` | Call detail record assignments |
| `cdrcalls` | ⚠️ Legacy | `cdr_calls` | Call detail records |
| `sysconfigs` | ⚠️ Legacy | `system_configs` | System configuration |

## Migration Status

| Domain | Collections | Migrated | Validated | Notes |
|--------|-------------|----------|-----------|-------|
| Planning | 7 | ⏳ Pending | ⏳ Pending | Core appointment data |
| Customer | 7 | ⏳ Pending | ⏳ Pending | Customer + invoicing |
| User Management | 6 | ⏳ Pending | ⏳ Pending | Users + profiles |
| Treatment | 7 | ⏳ Pending | ⏳ Pending | Consultations + prescriptions |
| Accounting | 8 | ⏳ Pending | ⏳ Pending | Billing + jobs |
| System | 6 | ⏳ Pending | ⏳ Pending | Notifications + configs |

## Denormalization Patterns

MongoDB embedded documents that were normalized in PostgreSQL:

### User Profiles
- **MongoDB**: Embedded in `users.userProfile`
- **PostgreSQL**: Separate `user_profiles` table with foreign key

### Appointment Assignments
- **MongoDB**: Embedded assignments array in `appointments`
- **PostgreSQL**: Separate `appointment_assignments` table

### Invoice Positions
- **MongoDB**: Embedded positions array in `invoices`
- **PostgreSQL**: Separate `invoice_positions` table

### Prescription Items
- **MongoDB**: Embedded items in `prescriptions`
- **PostgreSQL**: Separate `prescription_items` table

## Next Steps

1. Review collection mappings in [schema-mapping.md](./schema-mapping.md)
2. Execute migration scripts from [data-migration.md](./data-migration.md)
3. Validate data consistency
4. Update application code to use PostgreSQL
5. Archive MongoDB collections

## References

- [Schema Mapping](./schema-mapping.md) - Field-by-field mappings
- [Data Migration](./data-migration.md) - Migration scripts and validation
- [Denormalization Patterns](./denormalization-patterns.md) - What was embedded vs normalized
- [Cutover Plan](./cutover-plan.md) - Production migration strategy
