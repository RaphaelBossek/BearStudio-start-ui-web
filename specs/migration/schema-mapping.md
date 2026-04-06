---
title: 'Schema Mapping'
---

# Schema Mapping: MongoDB → PostgreSQL

> **Last Updated**: 2026-04-01  
> **Status**: Draft  
> **See Also**: [MongoDB Reference](./mongodb-reference.md), [Data Migration](./data-migration.md)

---

## Overview

This document provides field-by-field mappings from MongoDB collections to PostgreSQL tables. Use this guide when migrating data or updating application code.

## Naming Conventions

### MongoDB → PostgreSQL

| MongoDB | PostgreSQL | Example |
|---------|------------|---------|
| camelCase | snake_case | `userName` → `user_name` |
| Embedded docs | Separate tables | `user.profile` → `user_profiles` |
| Object IDs (`ObjectId`) | UUID (`uuid`) | `_id: ObjectId(...)` → `id: uuid` |
| Arrays | Join tables | `appointments: []` → `appointment_assignments` |
| Date strings | `TIMESTAMPTZ` | `"2024-01-01T00:00:00Z"` → `timestamptz` |

---

## Planning Domain

### Appointments

**MongoDB Collection**: `appointments`  
**PostgreSQL Table**: `appointments`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `customerId` | ObjectId | `customer_id` | uuid | FK → customers |
| `locationId` | ObjectId | `location_id` | uuid | FK → customer_locations |
| `startTime` | Date | `start_time` | timestamptz | Appointment start |
| `endTime` | Date | `end_time` | timestamptz | Appointment end |
| `state` | string | `state` | varchar(50) | Appointment state enum |
| `type` | string | `type` | varchar(50) | Appointment type |
| `createdAt` | Date | `created_at` | timestamptz | Auto-generated |
| `updatedAt` | Date | `updated_at` | timestamptz | Auto-updated |

### Appointment Assignments

**MongoDB Collection**: `appointmentassignments`  
**PostgreSQL Table**: `appointment_assignments`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `appointmentId` | ObjectId | `appointment_id` | uuid | FK → appointments |
| `userId` | ObjectId | `user_id` | uuid | FK → users |
| `state` | string | `state` | varchar(50) | Assignment state enum |
| `assignedAt` | Date | `assigned_at` | timestamptz | Assignment timestamp |

### Expert Days

**MongoDB Collection**: `expertdays`  
**PostgreSQL Table**: `expert_days`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `userId` | ObjectId | `user_id` | uuid | FK → users |
| `date` | Date | `date` | date | Calendar date |
| `availability` | string | `availability` | varchar(50) | available/unavailable |
| `slots` | array | - | - | Normalized to `expert_day_slots` |

---

## Customer Domain

### Customers

**MongoDB Collection**: `customers`  
**PostgreSQL Table**: `customers`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `name` | string | `name` | varchar(255) | Customer name |
| `email` | string | `email` | varchar(255) | Primary contact email |
| `phone` | string | `phone` | varchar(50) | Primary phone |
| `active` | boolean | `active` | boolean | Active status |
| `createdAt` | Date | `created_at` | timestamptz | Auto-generated |

### Customer Locations

**MongoDB Collection**: `customerlocations`  
**PostgreSQL Table**: `customer_locations`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `customerId` | ObjectId | `customer_id` | uuid | FK → customers |
| `name` | string | `name` | varchar(255) | Location name |
| `street` | string | `street` | varchar(255) | Street address |
| `city` | string | `city` | varchar(255) | City |
| `zipCode` | string | `zip_code` | varchar(20) | Postal code |
| `country` | string | `country` | varchar(2) | ISO country code |

### Contacts

**MongoDB Collection**: `contacts`  
**PostgreSQL Table**: `contacts`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `customerId` | ObjectId | `customer_id` | uuid | FK → customers |
| `firstName` | string | `first_name` | varchar(255) | First name |
| `lastName` | string | `last_name` | varchar(255) | Last name |
| `email` | string | `email` | varchar(255) | Contact email |
| `phone` | string | `phone` | varchar(50) | Contact phone |
| `type` | string | `type` | varchar(50) | business/private/other |

---

## User Management Domain

### Users

**MongoDB Collection**: `users`  
**PostgreSQL Table**: `users`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `email` | string | `email` | varchar(255) | Unique email |
| `passwordHash` | string | `password_hash` | varchar(255) | Bcrypt hash |
| `active` | boolean | `active` | boolean | Account status |
| `emailVerified` | boolean | `email_verified` | boolean | Email verification |
| `createdAt` | Date | `created_at` | timestamptz | Auto-generated |

### User Profiles

**MongoDB**: Embedded in `users.userProfile`  
**PostgreSQL Table**: `user_profiles`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `firstName` | string | `first_name` | varchar(255) | First name |
| `lastName` | string | `last_name` | varchar(255) | Last name |
| `signature` | string | `signature` | text | Base64 signature image |
| `title` | string | `title` | varchar(100) | Academic/professional title |

---

## Treatment Domain

### Consultations

**MongoDB Collection**: `consultations`  
**PostgreSQL Table**: `consultations`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `appointmentId` | ObjectId | `appointment_id` | uuid | FK → appointments |
| `userId` | ObjectId | `user_id` | uuid | FK → users (consulting user) |
| `type` | string | `type` | varchar(50) | standard/onboarding/incarceration |
| `state` | string | `state` | varchar(50) | Consultation state |
| `icd10Codes` | array | - | - | Normalized to `consultation_icd10` |
| `notes` | string | `notes` | text | Consultation notes |
| `createdAt` | Date | `created_at` | timestamptz | Auto-generated |

### Prescriptions

**MongoDB Collection**: `prescriptions`  
**PostgreSQL Table**: `prescriptions`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `consultationId` | ObjectId | `consultation_id` | uuid | FK → consultations |
| `medicationName` | string | `medication_name` | varchar(255) | Medication name |
| `dosage` | string | `dosage` | varchar(255) | Dosage instructions |
| `frequency` | string | `frequency` | varchar(100) | Frequency |
| `duration` | string | `duration` | varchar(100) | Treatment duration |

---

## Accounting Domain

### Invoices

**MongoDB Collection**: `invoices`  
**PostgreSQL Table**: `invoices`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `customerId` | ObjectId | `customer_id` | uuid | FK → customers |
| `invoiceNumber` | string | `invoice_number` | varchar(50) | Unique invoice number |
| `amount` | number | `amount` | numeric(10,2) | Invoice amount |
| `currency` | string | `currency` | varchar(3) | EUR/USD/etc |
| `dueDate` | Date | `due_date` | date | Payment due date |
| `state` | string | `state` | varchar(50) | draft/sent/paid/overdue |
| `createdAt` | Date | `created_at` | timestamptz | Auto-generated |

### Jobs

**MongoDB Collection**: `jobs`  
**PostgreSQL Table**: `jobs`

| MongoDB Field | Type | PostgreSQL Column | Type | Notes |
|---------------|------|-------------------|------|-------|
| `_id` | ObjectId | `id` | uuid | Primary key |
| `name` | string | `name` | varchar(255) | Job name |
| `description` | string | `description` | text | Job description |
| `defaultPrice` | number | `default_price` | numeric(10,2) | Default price |
| `active` | boolean | `active` | boolean | Active status |

---

## Migration Scripts

See [data-migration.md](./data-migration.md) for migration scripts that implement these mappings.

## References

- [MongoDB Reference](./mongodb-reference.md) - Collection index
- [Data Migration](./data-migration.md) - Migration scripts
- [Denormalization Patterns](./denormalization-patterns.md) - Embedded vs normalized
- [Cutover Plan](./cutover-plan.md) - Production migration strategy
