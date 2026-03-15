import { z } from 'zod';
import { zTreatmentSchema } from '@/features/treatment-table/schema';
import { dbMongoDB } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';

const tags = ['treatments-mongo'];

const stringifyBigInt = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'bigint') return obj.toString();
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) return obj.map(stringifyBigInt);
  if (typeof obj === 'object') {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, stringifyBigInt(v)]));
  }
  return obj;
};

export default {
  list: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/treatments-mongo',
      tags,
    })
    .input(
      z
        .object({
          page: z.coerce.number().int().min(1).optional().prefault(1),
          limit: z.coerce.number().int().min(1).max(100).optional().prefault(25),
          searchTerm: z.string().trim().optional().prefault(''),
          sortBy: z.enum(['id', 'bookNumber', 'state', 'dateStart', 'dateCreated']).optional(),
          sortOrder: z.enum(['asc', 'desc']).optional().prefault('desc'),
        })
        .prefault({})
    )
    .output(
      z.object({
        items: z.array(zTreatmentSchema()),
        total: z.number(),
      })
    )
    .handler(async ({ context, input }) => {
      context.logger.info('Fetching treatments from MongoDB');

      const where: any = {};
      if (input.searchTerm) {
        where.OR = [
          { bookNumber: { contains: input.searchTerm, mode: 'insensitive' } },
          { jNumber: { contains: input.searchTerm, mode: 'insensitive' } },
          { customer: { name: { contains: input.searchTerm, mode: 'insensitive' } } },
          { location: { name: { contains: input.searchTerm, mode: 'insensitive' } } },
          { assigned: { name: { contains: input.searchTerm, mode: 'insensitive' } } },
        ];
      }

      let orderBy: any;
      if (input.sortBy) {
        orderBy = { [input.sortBy]: input.sortOrder };
      } else {
        orderBy = { dateCreated: 'desc' };
      }

      const [total, items] = await Promise.all([
        dbMongoDB.treatment.count({ where }),
        dbMongoDB.treatment.findMany({
          where,
          take: input.limit,
          skip: (input.page - 1) * input.limit,
          orderBy,
        }),
      ]);

      const mappedItems = items.map((item) => stringifyBigInt(item));

      return {
        items: mappedItems,
        total,
      };
    }),

  get: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/treatments-mongo/{id}',
      tags,
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const item = await dbMongoDB.treatment.findUnique({
        where: { id: BigInt(input.id) },
      });
      if (!item) return null;

      return stringifyBigInt(item);
    }),

  getAppointmentsByTreatmentId: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/treatments-mongo/{id}/appointments',
      tags,
    })
    .input(z.object({ id: z.string() }))
    .output(z.array(z.any()))
    .handler(async ({ input }) => {
      const treatmentId = BigInt(input.id);

      const appointments = await dbMongoDB.appointment.findMany({
        where: { treatmentId },
        orderBy: { start: 'asc' },
      });

      return appointments.map((item) => stringifyBigInt(item));
    }),
};
