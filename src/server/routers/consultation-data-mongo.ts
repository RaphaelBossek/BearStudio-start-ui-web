import { z } from 'zod';
import { db, dbMongoDB } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';
import { mergeConsultationData } from '@/server/utils/consultation-merge';

const tags = ['consultation-data-mongo'];

const consultationTypeValues = [
  'EXTERNAL',
  'STANDARD',
  'DOCUMENT',
  'ONBOARDING',
  'ONBOARDING_SHORT',
  'INCARCERATION',
  'TREATMENT',
] as const;

const consultationStateValues = [
  'OPEN',
  'CREATED',
  'CLOSED',
  'REPORTED',
  'TRANSMITTED',
  'VERIFIED',
] as const;

const stringifyBigInt = (obj: unknown): unknown => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map((item) => stringifyBigInt(item));
  if (typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, stringifyBigInt(v)]));
  }
  return obj;
};

export default {
  list: protectedProcedure({ permission: null })
    .route({ method: 'GET', path: '/consultation-data-mongo', tags })
    .input(
      z
        .object({
          page: z.coerce.number().int().min(1).optional().prefault(1),
          limit: z.coerce.number().int().min(1).max(100).optional().prefault(25),
          searchTerm: z.string().trim().optional().prefault(''),
          type: z.enum(consultationTypeValues).optional(),
          state: z.enum(consultationStateValues).optional(),
          sortBy: z.enum(['id', 'date', 'bookNumber', 'state', 'type']).optional(),
          sortOrder: z.enum(['asc', 'desc']).optional().prefault('desc'),
        })
        .prefault({})
    )
    .output(
      z.object({
        items: z.array(z.any()),
        total: z.number(),
      })
    )
    .handler(async ({ input }) => {
      const where: {
        bookNumber?: { contains: string };
        type?: (typeof consultationTypeValues)[number];
        state?: (typeof consultationStateValues)[number];
      } = {};

      if (input.searchTerm) where.bookNumber = { contains: input.searchTerm };
      if (input.type) where.type = input.type;
      if (input.state) where.state = input.state;

      const orderBy = input.sortBy
        ? { [input.sortBy]: input.sortOrder }
        : { date: 'desc' as const };

      const [total, items] = await Promise.all([
        dbMongoDB.consultationData.count({ where }),
        dbMongoDB.consultationData.findMany({
          where,
          take: input.limit,
          skip: (input.page - 1) * input.limit,
          orderBy,
        }),
      ]);

      return { items: items.map((item: unknown) => stringifyBigInt(item)), total };
    }),

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
};
