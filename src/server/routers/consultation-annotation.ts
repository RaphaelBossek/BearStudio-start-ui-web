import { z } from 'zod';
import { db, dbMongoDB } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';
import { computeAnnotationDiff } from '@/server/utils/consultation-audit';

const tags = ['consultation-annotation'];

const sectionOverrideSchema = z.record(z.string(), z.unknown()).nullable().optional();

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

      const { consultationMongoId } = input;

      const overrideData = {
        commentOverride: input.commentOverride,
        requireReportingOverride: input.requireReportingOverride,
        bookNumberOverride: input.bookNumberOverride,
        dateOverride: input.dateOverride ? new Date(input.dateOverride) : input.dateOverride,
        typeOverride: input.typeOverride,
        noWarningsOverride: input.noWarningsOverride,
        archivedOverride: input.archivedOverride,
        bodyOverride: input.bodyOverride ?? undefined,
        baseOverride: input.baseOverride ?? undefined,
        onboardingOverride: input.onboardingOverride ?? undefined,
        incarcerationOverride: input.incarcerationOverride ?? undefined,
        treatmentOverride: input.treatmentOverride ?? undefined,
        standardOverride: input.standardOverride ?? undefined,
        referralOverride: input.referralOverride ?? undefined,
        warningsOverride: input.warningsOverride ?? undefined,
      };

      // Upsert annotation
      const result = await db.consultationAnnotation.upsert({
        where: { consultationMongoId },
        update: {
          ...overrideData,
          updatedById: userId,
        } as ExplicitAny,
        create: {
          consultationMongoId,
          ...overrideData,
          createdById: userId,
          updatedById: userId,
        } as ExplicitAny,
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
