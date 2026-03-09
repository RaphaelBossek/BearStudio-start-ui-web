import { z } from 'zod';
import { zUserMongoSchema } from '@/features/user-table/schema';
import { dbMongoDB } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';

const tags = ['users-mongo'];

export default {
  list: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/users-mongo',
      tags,
    })
    .input(
      z
        .object({
          page: z.coerce.number().int().min(1).optional().prefault(1),
          limit: z.coerce.number().int().min(1).max(100).optional().prefault(25),
          searchTerm: z.string().trim().optional().prefault(''),
          sortBy: z
            .enum(['id', 'username', 'email', 'userProfile.displayName', 'lastLogin'])
            .optional(),
          sortOrder: z.enum(['asc', 'desc']).optional().prefault('asc'),
        })
        .prefault({})
    )
    .output(
      z.object({
        items: z.array(zUserMongoSchema()),
        total: z.number(),
      })
    )
    .handler(async ({ context, input }) => {
      context.logger.info('Fetching users from MongoDB');

      const where: any = {};
      if (input.searchTerm) {
        where.OR = [
          { username: { contains: input.searchTerm, mode: 'insensitive' } },
          { email: { contains: input.searchTerm, mode: 'insensitive' } },
          {
            userProfile: {
              is: {
                displayName: { contains: input.searchTerm, mode: 'insensitive' },
              },
            },
          },
        ];
      }

      // Handle custom sorting for nested field if needed
      let orderBy: any;
      if (input.sortBy) {
        if (input.sortBy === 'userProfile.displayName') {
          orderBy = { userProfile: { displayName: input.sortOrder } };
        } else {
          orderBy = { [input.sortBy]: input.sortOrder };
        }
      } else {
        orderBy = { id: 'asc' };
      }

      const [total, items] = await Promise.all([
        dbMongoDB.userMongo.count({ where }),
        dbMongoDB.userMongo.findMany({
          where,
          take: input.limit,
          skip: (input.page - 1) * input.limit,
          orderBy,
        }),
      ]);

      const mappedItems = items.map((user) => ({
        ...user,
        id: user.id.toString(),
        invalidLogins: user.invalidLogins?.slice(0, 3) || null,
        successfulLogins: user.successfulLogins?.slice(0, 3) || null,
      }));

      return {
        items: mappedItems as any[],
        total,
      };
    }),

  get: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/users-mongo/{id}',
      tags,
    })
    .input(z.object({ id: z.string() }))
    .output(z.any())
    .handler(async ({ input }) => {
      const user = await dbMongoDB.userMongo.findUnique({
        where: { id: BigInt(input.id) },
      });
      if (!user) return null;

      // Deeply convert BigInt to string and handle dates
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

      return stringifyBigInt(user);
    }),
};
