import { z } from 'zod';
import { zShiftPlanSchema } from '@/features/shift-plan-table/schema';
import { dbMongoDB } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';

const tags = ['shift-plans-mongo'];

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
      path: '/shift-plans-mongo',
      tags,
    })
    .input(
      z
        .object({
          page: z.coerce.number().int().min(1).optional().prefault(1),
          limit: z.coerce.number().int().min(1).max(100).optional().prefault(25),
          searchTerm: z.string().trim().optional().prefault(''),
          sortBy: z.enum(['id', 'name', 'day', 'timeStart', 'priceType']).optional(),
          sortOrder: z.enum(['asc', 'desc']).optional().prefault('asc'),
        })
        .prefault({})
    )
    .output(
      z.object({
        items: z.array(zShiftPlanSchema()),
        total: z.number(),
      })
    )
    .handler(async ({ context, input }) => {
      context.logger.info('Fetching shift plans from MongoDB');

      const where: any = {};
      if (input.searchTerm) {
        where.OR = [
          { name: { contains: input.searchTerm, mode: 'insensitive' } },
          { comment: { contains: input.searchTerm, mode: 'insensitive' } },
        ];
      }

      let orderBy: any;
      if (input.sortBy) {
        orderBy = { [input.sortBy]: input.sortOrder };
      } else {
        orderBy = { dateCreated: 'desc' };
      }

      const [total, items] = await Promise.all([
        dbMongoDB.shiftPlan.count({ where }),
        dbMongoDB.shiftPlan.findMany({
          where,
          take: input.limit,
          skip: (input.page - 1) * input.limit,
          orderBy,
        }),
      ]);

      const mappedItems = items.map((item) => stringifyBigInt(item));

      return {
        items: mappedItems as any[],
        total,
      };
    }),

  get: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/shift-plans-mongo/{id}',
      tags,
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const item = await dbMongoDB.shiftPlan.findUnique({
        where: { id: BigInt(input.id) },
      });
      if (!item) return null;

      return stringifyBigInt(item);
    }),
};
