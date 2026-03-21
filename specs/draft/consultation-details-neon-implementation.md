# Consultation Details - Comprehensive Implementation Plan

**Date:** 2026-03-21
**Spec:** `specs/features/compliance/consultation-details/`
**Status:** Ready for execution

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Phase 1: Backend - Neon Schema Expansion](#3-phase-1-backend---neon-schema-expansion)
4. [Phase 2: Backend - Server-Side Merge & API Changes](#4-phase-2-backend---server-side-merge--api-changes)
5. [Phase 3: Backend - Audit Trail](#5-phase-3-backend---audit-trail)
6. [Phase 4: Frontend - Edit Flow Rewire](#6-phase-4-frontend---edit-flow-rewire)
7. [Phase 5: Backend - List Optimization](#7-phase-5-backend---list-optimization)
8. [Phase 6: Frontend/Backend - Create Consultation](#8-phase-6-frontendbackend---create-consultation)
9. [Phase 7: Frontend/Backend - Archive Consultation](#9-phase-7-frontendbackend---archive-consultation)
10. [Phase 8: Frontend - Audit Trail UI](#10-phase-8-frontend---audit-trail-ui)
11. [Verification & Cleanup](#11-verification--cleanup)

---

## 1. Executive Summary

Transform the consultation details feature from a read-only view with limited annotation overrides into a full CRUD interface. All writes go exclusively to Neon PostgreSQL (annotations), while MongoDB remains the immutable source of truth. The API merges both sources server-side before returning data to the client.

### Key Decisions

| Decision | Value |
|---|---|
| Write target | Neon PostgreSQL only |
| Read source | Server-side merge of MongoDB + Neon |
| Annotation model | Structured JSONB columns per section |
| CRUD scope | Create (template-based), Read, Update, Soft Delete (archive) |
| Access control | Doctor role only; all states except CLOSED |
| Concurrency | Last-write-wins |
| Validation | Hybrid (enums strict, optionals flexible) |
| Audit | Full field-level change log in Neon |

---

## 2. Architecture Overview

```
┌─────────────┐     ┌─────────────────┐     ┌──────────────────────┐
│  React UI   │────>│  ORPC API       │────>│  Neon PostgreSQL     │
│  (Form +    │     │  (Server-side   │     │  - ConsultationAnno. │
│   EditField)│<────│   merge)        │     │  - AuditLog          │
└─────────────┘     │                 │────>│                      │
                    │                 │     └──────────────────────┘
                    │                 │
                    │                 │────>┌──────────────────────┐
                    │                 │     │  MongoDB (read-only) │
                    │                 │<────│  - consultationData  │
                    └─────────────────┘     │  - consultation      │
                                           └──────────────────────┘
```

**Data Flow:**
- **Read (GET):** API fetches MongoDB source → fetches Neon annotation → deep merges → returns
- **Write (POST/PUT):** API validates → writes Neon annotation → computes diff for audit → returns merged result
- **List (GET):** API queries `consultation` collection (indexed) for performance
- **Create:** API creates Neon annotation row with generated ID + template data
- **Archive:** API sets `archivedOverride=true` on Neon annotation

---

## 3. Phase 1: Backend - Neon Schema Expansion

### Step 1.1: Update Prisma Schema (Neon)

**File:** `prisma/schema.prisma`

Replace the current `ConsultationAnnotation` model (lines 115-131) with:

```prisma
model ConsultationAnnotation {
  id                  String   @id @default(cuid())
  consultationMongoId String   @unique
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  createdById         String
  updatedById         String

  // Existing scalar overrides
  commentOverride          String?
  requireReportingOverride Boolean?

  // NEW: Top-level scalar overrides
  bookNumberOverride  String?
  dateOverride        DateTime?
  typeOverride        String?
  noWarningsOverride  Boolean?
  archivedOverride    Boolean?

  // NEW: Section-level JSONB overrides
  bodyOverride          Json?   @db.JsonB
  baseOverride          Json?   @db.JsonB
  onboardingOverride    Json?   @db.JsonB
  incarcerationOverride Json?   @db.JsonB
  treatmentOverride     Json?   @db.JsonB
  standardOverride      Json?   @db.JsonB
  referralOverride      Json?   @db.JsonB
  warningsOverride      Json?   @db.JsonB

  createdBy User @relation("ConsAnnotationCreatedBy", fields: [createdById], references: [id])
  updatedBy User @relation("ConsAnnotationUpdatedBy", fields: [updatedById], references: [id])

  @@index([consultationMongoId])
  @@map("consultation_annotation")
}
```

### Step 1.2: Add Audit Log Model

**File:** `prisma/schema.prisma` (add after `ConsultationAnnotation`)

```prisma
model ConsultationAuditLog {
  id               String   @id @default(cuid())
  consultationId   String
  userId           String
  userName         String
  action           String   // CREATE, UPDATE, ARCHIVE, UNARCHIVE
  fieldPath        String?  // e.g. "onboarding.generalState"
  oldValue         String?  // JSON-serialized
  newValue         String?  // JSON-serialized
  createdAt        DateTime @default(now())

  @@index([consultationId, createdAt])
  @@map("consultation_audit_log")
}
```

### Step 1.3: Add `User` model relations (if needed)

The `User` model (around line 106) has:
```prisma
consultationAnnotationsCreated ConsultationAnnotation[] @relation("ConsAnnotationCreatedBy")
consultationAnnotationsUpdated ConsultationAnnotation[] @relation("ConsAnnotationUpdatedBy")
```
These do NOT need to change since we're only adding columns to the existing model.

### Step 1.4: Run Migration

```bash
npx prisma migrate dev --name expand-consultation-annotations
npx prisma generate
```

> **WARNING (from AGENTS.md):** Running `prisma migrate dev` against the current Neon development database can fail with drift detected. Coordinate with the developer before applying. Consider updating `schema.prisma` + `prisma generate` first and running the migration separately.

---

## 4. Phase 2: Backend - Server-Side Merge & API Changes

### Step 2.1: Create Deep Merge Utility

**Create file:** `src/server/utils/consultation-merge.ts`

```typescript
/**
 * Deep merges Neon annotation overrides onto MongoDB source data.
 * Neon values take precedence. NULL annotation values fall back to MongoDB.
 */
export function mergeConsultationData(
  mongoData: Record<string, unknown>,
  annotation: Record<string, unknown> | null
): Record<string, unknown> {
  if (!annotation) return mongoData;

  const result = { ...mongoData };

  // Scalar overrides
  const scalarMap: Record<string, string> = {
    bookNumberOverride: 'bookNumber',
    dateOverride: 'date',
    typeOverride: 'type',
    commentOverride: 'comment',
    requireReportingOverride: 'requireReporting',
    noWarningsOverride: 'noWarnings',
    archivedOverride: 'archived',
  };

  for (const [annotationKey, mongoKey] of Object.entries(scalarMap)) {
    const val = annotation[annotationKey];
    if (val !== null && val !== undefined) {
      result[mongoKey] = val;
    }
  }

  // Section-level JSONB overrides (deep merge within section)
  const sectionMap: Record<string, string> = {
    bodyOverride: 'body',
    baseOverride: 'base',
    onboardingOverride: 'onboarding',
    incarcerationOverride: 'incarceration',
    treatmentOverride: 'treatment',
    standardOverride: 'standard',
    referralOverride: 'referral',
    warningsOverride: 'warnings',
  };

  for (const [annotationKey, mongoKey] of Object.entries(sectionMap)) {
    const override = annotation[annotationKey];
    if (override !== null && override !== undefined && typeof override === 'object') {
      const source = (result[mongoKey] && typeof result[mongoKey] === 'object')
        ? result[mongoKey] as Record<string, unknown>
        : {};
      result[mongoKey] = { ...source, ...(override as Record<string, unknown>) };
    }
  }

  // Inject annotation metadata
  result._annotationId = annotation.id;
  result._hasAnnotation = true;

  return result;
}
```

### Step 2.2: Update `consultationDataMongo.get` to Perform Server-Side Merge

**File:** `src/server/routers/consultation-data-mongo.ts`

Modify the `get` handler to:
1. Fetch MongoDB data
2. Fetch Neon annotation
3. Merge and return

```typescript
// Add import at top:
import { db } from '@/server/db';
import { mergeConsultationData } from '@/server/utils/consultation-merge';

// Replace the `get` handler:
get: protectedProcedure({ permission: null })
  .route({ method: 'GET', path: '/consultation-data-mongo/{id}', tags })
  .input(z.object({ id: z.string() }))
  .output(z.any())
  .handler(async ({ input }) => {
    const [mongoItem, annotation] = await Promise.all([
      dbMongoDB.consultationData.findUnique({
        where: { id: BigInt(input.id) },
      }),
      db.consultationAnnotation.findUnique({
        where: { consultationMongoId: input.id },
      }),
    ]);

    if (!mongoItem) return null;

    const serialized = stringifyBigInt(mongoItem) as Record<string, unknown>;
    const annotationRecord = annotation
      ? (stringifyBigInt(annotation) as Record<string, unknown>)
      : null;

    return mergeConsultationData(serialized, annotationRecord);
  }),
```

### Step 2.3: REMOVE the MongoDB `update` Procedure

**File:** `src/server/routers/consultation-data-mongo.ts`

Delete the entire `update` procedure block (lines ~97-110 in current file). The final router should only export `list` and `get`.

Also remove the import:
```diff
- import { consultationDataUpdateSchema } from '@/features/consultation-data/schema';
```

### Step 2.4: Expand `consultationAnnotation.upsert` Procedure

**File:** `src/server/routers/consultation-annotation.ts`

Replace the entire file with:

```typescript
import { z } from 'zod';
import { db, dbMongoDB } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';
import { computeAnnotationDiff } from '@/server/utils/consultation-audit';

const tags = ['consultation-annotation'];

const sectionOverrideSchema = z.record(z.unknown()).nullable().optional();

const annotationUpsertInputSchema = z.object({
  consultationMongoId: z.string(),

  // Scalar overrides
  commentOverride: z.string().nullable().optional(),
  requireReportingOverride: z.boolean().nullable().optional(),
  bookNumberOverride: z.string().nullable().optional(),
  dateOverride: z.string().nullable().optional(),
  typeOverride: z.string().nullable().optional(),
  noWarningsOverride: z.boolean().nullable().optional(),
  archivedOverride: z.boolean().nullable().optional(),

  // Section-level JSONB overrides
  bodyOverride: sectionOverrideSchema,
  baseOverride: sectionOverrideSchema,
  onboardingOverride: sectionOverrideSchema,
  incarcerationOverride: sectionOverrideSchema,
  treatmentOverride: sectionOverrideSchema,
  standardOverride: sectionOverrideSchema,
  referralOverride: sectionOverrideSchema,
  warningsOverride: sectionOverrideSchema,
});

export default {
  get: protectedProcedure({ permission: null })
    .route({ method: 'GET', path: '/consultation-annotation/{id}', tags })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(async ({ input }) => {
      return db.consultationAnnotation.findUnique({
        where: { consultationMongoId: input.id },
      });
    }),

  upsert: protectedProcedure({ permission: null })
    .route({ method: 'POST', path: '/consultation-annotation', tags })
    .input(annotationUpsertInputSchema)
    .output(z.any())
    .handler(async ({ context, input }) => {
      const userId = context.user.id;
      const userName = context.user.name ?? context.user.email ?? 'Unknown';

      // State check: reject edits to CLOSED consultations
      const mongoItem = await dbMongoDB.consultationData.findUnique({
        where: { id: BigInt(input.consultationMongoId) },
        select: { state: true },
      });
      if (mongoItem?.state === 'CLOSED') {
        throw new Error('Cannot edit a CLOSED consultation');
      }

      // Fetch existing annotation for diff computation
      const existingAnnotation = await db.consultationAnnotation.findUnique({
        where: { consultationMongoId: input.consultationMongoId },
      });

      const { consultationMongoId, ...updateData } = input;

      // Upsert annotation
      const result = await db.consultationAnnotation.upsert({
        where: { consultationMongoId },
        update: {
          ...updateData,
          updatedById: userId,
        },
        create: {
          consultationMongoId,
          ...updateData,
          createdById: userId,
          updatedById: userId,
        },
      });

      // Compute and write audit log entries
      const auditEntries = computeAnnotationDiff(
        existingAnnotation as Record<string, unknown> | null,
        input as Record<string, unknown>,
        consultationMongoId,
        userId,
        userName,
        existingAnnotation ? 'UPDATE' : 'CREATE'
      );

      if (auditEntries.length > 0) {
        await db.consultationAuditLog.createMany({ data: auditEntries });
      }

      return result;
    }),
};
```

### Step 2.5: Update the `annotationUpsertSchema` in Frontend Schema

**File:** `src/features/consultation-data/schema.ts`

Replace the existing `annotationUpsertSchema` at the top with one matching the expanded backend:

```typescript
export const annotationUpsertSchema = z.object({
  consultationMongoId: z.string(),
  commentOverride: z.string().nullable().optional(),
  requireReportingOverride: z.boolean().nullable().optional(),
  bookNumberOverride: z.string().nullable().optional(),
  dateOverride: z.string().nullable().optional(),
  typeOverride: z.string().nullable().optional(),
  noWarningsOverride: z.boolean().nullable().optional(),
  archivedOverride: z.boolean().nullable().optional(),
  bodyOverride: z.record(z.unknown()).nullable().optional(),
  baseOverride: z.record(z.unknown()).nullable().optional(),
  onboardingOverride: z.record(z.unknown()).nullable().optional(),
  incarcerationOverride: z.record(z.unknown()).nullable().optional(),
  treatmentOverride: z.record(z.unknown()).nullable().optional(),
  standardOverride: z.record(z.unknown()).nullable().optional(),
  referralOverride: z.record(z.unknown()).nullable().optional(),
  warningsOverride: z.record(z.unknown()).nullable().optional(),
});
```

Also **remove** `consultationDataUpdateSchema` and `ConsultationDataUpdateInput` (no longer needed - we don't write to MongoDB).

---

## 5. Phase 3: Backend - Audit Trail

### Step 3.1: Create Audit Diff Utility

**Create file:** `src/server/utils/consultation-audit.ts`

```typescript
type AuditEntry = {
  consultationId: string;
  userId: string;
  userName: string;
  action: string;
  fieldPath: string | null;
  oldValue: string | null;
  newValue: string | null;
};

const OVERRIDE_FIELDS = [
  'commentOverride', 'requireReportingOverride',
  'bookNumberOverride', 'dateOverride', 'typeOverride',
  'noWarningsOverride', 'archivedOverride',
  'bodyOverride', 'baseOverride', 'onboardingOverride',
  'incarcerationOverride', 'treatmentOverride',
  'standardOverride', 'referralOverride', 'warningsOverride',
];

export function computeAnnotationDiff(
  existing: Record<string, unknown> | null,
  incoming: Record<string, unknown>,
  consultationId: string,
  userId: string,
  userName: string,
  action: string
): AuditEntry[] {
  const entries: AuditEntry[] = [];

  for (const field of OVERRIDE_FIELDS) {
    const oldVal = existing?.[field] ?? null;
    const newVal = incoming[field];

    // Skip fields not in incoming payload
    if (newVal === undefined) continue;

    const oldStr = oldVal === null || oldVal === undefined
      ? null : JSON.stringify(oldVal);
    const newStr = newVal === null || newVal === undefined
      ? null : JSON.stringify(newVal);

    if (oldStr !== newStr) {
      entries.push({
        consultationId,
        userId,
        userName,
        action,
        fieldPath: field.replace('Override', ''),
        oldValue: oldStr,
        newValue: newStr,
      });
    }
  }

  return entries;
}
```

### Step 3.2: Create Audit Log ORPC Router

**Create file:** `src/server/routers/consultation-audit-log.ts`

```typescript
import { z } from 'zod';
import { db } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';

const tags = ['consultation-audit-log'];

export default {
  list: protectedProcedure({ permission: null })
    .route({ method: 'GET', path: '/consultation-audit-log/{consultationId}', tags })
    .input(
      z.object({
        consultationId: z.string(),
        page: z.coerce.number().int().min(1).optional().prefault(1),
        limit: z.coerce.number().int().min(1).max(100).optional().prefault(50),
      })
    )
    .output(
      z.object({
        items: z.array(z.any()),
        total: z.number(),
      })
    )
    .handler(async ({ input }) => {
      const [total, items] = await Promise.all([
        db.consultationAuditLog.count({
          where: { consultationId: input.consultationId },
        }),
        db.consultationAuditLog.findMany({
          where: { consultationId: input.consultationId },
          orderBy: { createdAt: 'desc' },
          take: input.limit,
          skip: (input.page - 1) * input.limit,
        }),
      ]);

      return { items, total };
    }),
};
```

### Step 3.3: Register Audit Log Router

**File:** `src/server/router.ts`

Add:
```typescript
import consultationAuditLogRouter from './routers/consultation-audit-log';

// In the router object:
consultationAuditLog: consultationAuditLogRouter,
```

---

## 6. Phase 4: Frontend - Edit Flow Rewire

### Step 4.1: Remove MongoDB Update References from Page

**File:** `src/features/consultation-data/consultation-data-page.tsx`

1. **Remove** the `updateMutation` that calls `orpc.consultationDataMongo.update`
2. **Remove** the `useForm` + `zodResolver` + `consultationDataUpdateSchema` setup (no longer writes to MongoDB)
3. **Remove** the `Form` wrapper around `SectionedScrollLayout`
4. **Remove** imports: `zodResolver`, `useForm`, `consultationDataUpdateSchema`, `Form`

### Step 4.2: Rewire `handleSave` to Write Neon Annotations

**File:** `src/features/consultation-data/consultation-data-page.tsx`

The `handleSave` function should now:
1. Collect all form values from `react-hook-form`
2. Transform them into section-level override objects
3. Call `consultationAnnotation.upsert` with section overrides
4. Refetch consultation data (which now returns server-merged data)

```typescript
const handleSave = async () => {
  const formData = form.getValues();

  // Build section-level overrides by comparing form values to MongoDB source
  const mongoSource = consultationQuery.data as Record<string, unknown>;

  const annotationPayload = {
    consultationMongoId: consultationId,
    commentOverride: formData.comment !== mongoSource.comment ? formData.comment : null,
    requireReportingOverride: formData.requireReporting !== mongoSource.requireReporting ? formData.requireReporting : null,
    bookNumberOverride: formData.bookNumber !== mongoSource.bookNumber ? formData.bookNumber : null,
    bodyOverride: buildSectionDiff(formData.body, mongoSource.body),
    baseOverride: buildSectionDiff(formData.base, mongoSource.base),
    onboardingOverride: buildSectionDiff(formData.onboarding, mongoSource.onboarding),
    incarcerationOverride: buildSectionDiff(formData.incarceration, mongoSource.incarceration),
    treatmentOverride: buildSectionDiff(formData.treatment, mongoSource.treatment),
    standardOverride: buildSectionDiff(formData.standard, mongoSource.standard),
    referralOverride: buildSectionDiff(formData.referral, mongoSource.referral),
    warningsOverride: buildSectionDiff(formData.warnings, mongoSource.warnings),
  };

  await saveAnnotation.mutateAsync(annotationPayload);
  await consultationQuery.refetch();
  setIsEditMode(false);
};
```

### Step 4.3: Create Section Diff Utility (Frontend)

**Create file:** `src/features/consultation-data/utils/build-section-diff.ts`

```typescript
/**
 * Compares form section to MongoDB source section.
 * Returns the override object with only changed fields, or null if no changes.
 */
export function buildSectionDiff(
  formSection: Record<string, unknown> | undefined | null,
  mongoSection: unknown
): Record<string, unknown> | null {
  if (!formSection) return null;

  const source = (mongoSection && typeof mongoSection === 'object' && !Array.isArray(mongoSection))
    ? mongoSection as Record<string, unknown>
    : {};

  const diff: Record<string, unknown> = {};
  let hasChanges = false;

  for (const [key, value] of Object.entries(formSection)) {
    if (JSON.stringify(value) !== JSON.stringify(source[key])) {
      diff[key] = value;
      hasChanges = true;
    }
  }

  return hasChanges ? diff : null;
}
```

### Step 4.4: Update `useConsultationAnnotation` Hook

**File:** `src/features/consultation-data/hooks/use-consultation-annotation.ts`

The `get` query is no longer needed separately since the `consultationDataMongo.get` now returns merged data. However, keep it for the `upsert` mutation. Update the upsert mutation to use the expanded schema.

### Step 4.5: Add State-Based Edit Restriction (Frontend)

**File:** `src/features/consultation-data/consultation-data-page.tsx`

```typescript
const canEdit = consultation.state !== 'CLOSED';

// In the top bar:
{canEdit && !isEditMode && (
  <Button variant="secondary" size="sm" onClick={() => setIsEditMode(true)}>
    Edit
  </Button>
)}
```

### Step 4.6: Keep `EditableField` and Form Infrastructure

The `EditableField` component and `react-hook-form` `useForm` setup remain as-is. The form is still needed to collect user inputs. What changes is the **save target** (Neon instead of MongoDB).

The form's `defaultValues` should use the merged data returned by `consultationDataMongo.get` (which now includes Neon overrides).

---

## 7. Phase 5: Backend - List Optimization

### Step 5.1: Add `Consultation` Model to MongoDB Schema

**File:** `prisma/schema-mongodb.prisma`

```prisma
model Consultation {
  id              BigInt    @id @map("_id")
  date            DateTime?
  timeStart       Int?
  timeEnd         Int?
  type            String?
  state           String?
  bookNumber      String?
  period          Int?
  appointmentType String?
  paymentType     String?
  archived        Boolean?
  location        Json?
  customer        Json?
  doctor          Json?
  job             Json?
  class           String?   @map("_class")

  @@map("consultation")
}
```

### Step 5.2: Run Prisma Generate

```bash
npx prisma generate
```

### Step 5.3: Create List Router

**Create file:** `src/server/routers/consultation-list-mongo.ts`

Mirror the existing `consultationDataMongo.list` but query the `consultation` collection instead of `consultationData`.

### Step 5.4: Register Router

**File:** `src/server/router.ts`

```typescript
import consultationListMongoRouter from './routers/consultation-list-mongo';

// In the router object:
consultationListMongo: consultationListMongoRouter,
```

### Step 5.5: Update Frontend List Page

**File:** `src/features/consultation-data/consultation-data-list-page.tsx`

Change the ORPC call from `consultationDataMongo.list` to `consultationListMongo.list`.

---

## 8. Phase 6: Frontend/Backend - Create Consultation

### Step 6.1: Backend - Template List Endpoint

Currently there is NO `ExpertConsultationTemplate` model in the MongoDB schema. Either:
- **Option A:** Add a `ExpertConsultationTemplate` model to `prisma/schema-mongodb.prisma` and create a list router
- **Option B:** If templates exist in MongoDB but aren't modeled, add the model

**Decision needed from developer:** Verify whether `expertConsultationTemplate` collection exists in MongoDB.

### Step 6.2: Backend - Create Consultation Endpoint

**File:** `src/server/routers/consultation-annotation.ts`

Add a `create` procedure:

```typescript
create: protectedProcedure({ permission: null })
  .route({ method: 'POST', path: '/consultation-annotation/create', tags })
  .input(z.object({
    type: z.enum(consultationTypeValues),
    templateId: z.string().optional(),
  }))
  .output(z.any())
  .handler(async ({ context, input }) => {
    const userId = context.user.id;
    const userName = context.user.name ?? context.user.email ?? 'Unknown';

    // Generate a unique consultation ID (could use cuid or timestamp-based)
    const consultationMongoId = `draft-${cuid()}`;

    let templateData = {};
    if (input.templateId) {
      // Fetch template from MongoDB and extract relevant sections
      // templateData = await dbMongoDB.expertConsultationTemplate.findUnique(...)
    }

    const annotation = await db.consultationAnnotation.create({
      data: {
        consultationMongoId,
        typeOverride: input.type,
        createdById: userId,
        updatedById: userId,
        ...templateData,
      },
    });

    // Audit LOG
    await db.consultationAuditLog.create({
      data: {
        consultationId: consultationMongoId,
        userId,
        userName,
        action: 'CREATE',
        fieldPath: null,
        oldValue: null,
        newValue: JSON.stringify({ type: input.type }),
      },
    });

    return annotation;
  }),
```

### Step 6.3: Frontend - Create Consultation Dialog

**Create file:** `src/features/consultation-data/components/create-consultation-dialog.tsx`

- Type selection step (radio group with 7 consultation types)
- Template picker (fetched from backend)
- "Blank" option always available
- On confirm: call `consultationAnnotation.create`, then navigate to detail view

### Step 6.4: Frontend - Add "New Consultation" Button to List Page

**File:** `src/features/consultation-data/consultation-data-list-page.tsx`

Add button in page header that opens the create dialog.

---

## 9. Phase 7: Frontend/Backend - Archive Consultation

### Step 7.1: Backend - Already Handled

The `archivedOverride` field is already in the expanded schema (Phase 1). The `upsert` procedure already accepts it.

### Step 7.2: Frontend - Archive Button

**File:** `src/features/consultation-data/consultation-data-page.tsx`

Add "Archive" / "Unarchive" button in the top bar:

```typescript
const isArchived = Boolean(consultation.archived);

// In top bar:
{canEdit && !isEditMode && (
  <Button
    variant="destructive"
    size="sm"
    onClick={() => setShowArchiveConfirm(true)}
  >
    {isArchived ? 'Unarchive' : 'Archive'}
  </Button>
)}
```

### Step 7.3: Frontend - Archive Confirmation Dialog

Use shadcn `AlertDialog` for confirmation before archive/unarchive.

### Step 7.4: Frontend - List Page Archive Filter

Add a filter toggle to list page to show/hide archived consultations.

---

## 10. Phase 8: Frontend - Audit Trail UI

### Step 8.1: Create Audit Trail Section Component

**Create file:** `src/features/consultation-data/sections/audit-trail-section.tsx`

- Fetch audit entries from `consultationAuditLog.list`
- Display as a timeline (most recent first)
- Each entry shows: user name, action, field, old → new values, timestamp
- Paginate if > 50 entries

### Step 8.2: Add Section to Page

**File:** `src/features/consultation-data/consultation-data-page.tsx`

Add the audit trail section to `allSections`:

```typescript
{
  id: 'audit-trail',
  label: 'Change History',
  icon: HistoryIcon,
  content: <AuditTrailSection consultationId={consultationId} />,
},
```

Show this section for all consultation types (add to `sectionVisibility`).

---

## 11. Verification & Cleanup

### Step 11.1: Remove Dead Code

- Remove `consultationDataUpdateSchema` and `ConsultationDataUpdateInput` from `schema.ts`
- Remove the `update` procedure import/usage from `consultation-data-mongo.ts`
- Remove any MongoDB update mutation references from the page

### Step 11.2: Run Type Check

```bash
npm run lint:ts
```

### Step 11.3: Run Biome Lint

```bash
npm run lint:biome
```

### Step 11.4: Full Lint

```bash
npm run lint
```

### Step 11.5: Verify Build

```bash
npm run build
```

### Step 11.6: Manual Testing Checklist

- [ ] Detail view loads and displays merged data (MongoDB + Neon)
- [ ] Edit button visible for non-CLOSED consultations
- [ ] Edit button hidden for CLOSED consultations
- [ ] Entering edit mode shows input fields
- [ ] Cancel resets form
- [ ] Save persists to Neon annotations
- [ ] After save, data refreshes with merged values
- [ ] Audit trail shows change entries
- [ ] Archive/Unarchive works with confirmation dialog
- [ ] Create new consultation from template works
- [ ] Create blank consultation works
- [ ] List page uses optimized `consultation` collection
- [ ] Pagination, filtering, sorting work on list page

---

## File Change Summary

### Files to CREATE:
| File | Purpose |
|------|---------|
| `src/server/utils/consultation-merge.ts` | Server-side deep merge utility |
| `src/server/utils/consultation-audit.ts` | Audit diff computation utility |
| `src/server/routers/consultation-audit-log.ts` | Audit log list endpoint |
| `src/server/routers/consultation-list-mongo.ts` | Optimized list using `consultation` collection |
| `src/features/consultation-data/utils/build-section-diff.ts` | Client-side section diff for save |
| `src/features/consultation-data/sections/audit-trail-section.tsx` | Audit trail UI section |
| `src/features/consultation-data/components/create-consultation-dialog.tsx` | Create consultation dialog |

### Files to MODIFY:
| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Expand `ConsultationAnnotation` model, add `ConsultationAuditLog` model |
| `prisma/schema-mongodb.prisma` | Add `Consultation` model |
| `src/server/router.ts` | Register `consultationAuditLog` and `consultationListMongo` routers |
| `src/server/routers/consultation-data-mongo.ts` | Remove `update` procedure, add server-side merge to `get` |
| `src/server/routers/consultation-annotation.ts` | Expand `upsert` with section overrides, state check, audit logging |
| `src/features/consultation-data/schema.ts` | Expand `annotationUpsertSchema`, remove `consultationDataUpdateSchema` |
| `src/features/consultation-data/consultation-data-page.tsx` | Rewire save to Neon, add archive button, add audit section, state checks |
| `src/features/consultation-data/consultation-data-list-page.tsx` | Switch to `consultationListMongo.list`, add create button + archive filter |

### Files to DELETE (code removal):
| Code to Remove | Location |
|------|---------|
| `update` procedure | `src/server/routers/consultation-data-mongo.ts` |
| `consultationDataUpdateSchema` | `src/features/consultation-data/schema.ts` |
| `updateMutation` usage | `src/features/consultation-data/consultation-data-page.tsx` |

---

## Execution Order (Recommended)

```
Phase 1 (schema)  →  Phase 2 (API)  →  Phase 3 (audit)  →  Phase 4 (frontend edit)
                                                              ↓
Phase 5 (list optimization)  →  Phase 6 (create)  →  Phase 7 (archive)  →  Phase 8 (audit UI)
                                                              ↓
                                                     Phase 11 (verify & cleanup)
```

Phases 1-4 are the critical path. Phases 5-8 can be done in parallel or incrementally after the core edit flow works.
