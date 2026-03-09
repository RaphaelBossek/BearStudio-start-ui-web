import { z } from 'zod';
import { zExpertWeek } from '@/features/expert-week/schema';
import { dbMongoDB } from '@/server/db';
import { protectedProcedure } from '@/server/orpc';

const tags = ['expert-weeks'];

export default {
  list: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/expert-weeks',
      tags,
    })
    .input(
      z
        .object({
          page: z.coerce.number().int().min(1).optional().prefault(1),
          limit: z.coerce.number().int().min(1).max(100).prefault(25),
          searchTerm: z.string().trim().optional().prefault(''),
          sortBy: z.enum(['dateCreated', 'dateChanged', 'userDisplayName']).optional(),
          sortOrder: z.enum(['asc', 'desc']).optional(),
        })
        .prefault({})
    )
    .output(
      z.object({
        items: z.array(zExpertWeek()),
        total: z.number(),
      })
    )
    .handler(async ({ context, input }) => {
      context.logger.info('Getting expert weeks from database');

      let userIdFilter: bigint[] | undefined;
      const orConditions: any[] = [];

      // 1. Resolve users matching the search term (case and diacritic insensitive if db supports it)
      if (input.searchTerm) {
        try {
          const users = await dbMongoDB.userMongo.findMany({
            where: {
              userProfile: {
                is: {
                  displayName: {
                    contains: input.searchTerm,
                    mode: 'insensitive',
                  },
                },
              },
            },
            select: { id: true },
          });
          userIdFilter = users.map((u: { id: bigint }) => u.id);
        } catch (e) {
          context.logger.warn('Failed querying UserMongo composite type for searchTerm', e);
        }

        orConditions.push({
          type: {
            contains: input.searchTerm,
            mode: 'insensitive',
          },
        });

        if (userIdFilter && userIdFilter.length > 0) {
          orConditions.push({
            userId: { in: userIdFilter },
          });
        }
      }

      const where = orConditions.length > 0 ? { OR: orConditions } : {};

      const [total, items] = await Promise.all([
        dbMongoDB.expertWeek.count({
          where,
        }),
        dbMongoDB.expertWeek.findMany({
          take: input.limit,
          skip: (input.page - 1) * input.limit,
          where,
          orderBy:
            input.sortBy && input.sortBy !== 'userDisplayName'
              ? { [input.sortBy]: input.sortOrder || 'asc' }
              : undefined,
        }),
      ]);

      // Resolve display names
      const userIdsToFetch = Array.from(
        new Set(items.map((i: any) => i.userId).filter(Boolean))
      ) as bigint[];
      let userMap = new Map<string, string>();
      if (userIdsToFetch.length > 0) {
        const userProfiles = await dbMongoDB.userMongo.findMany({
          where: { id: { in: userIdsToFetch } },
          select: { id: true, userProfile: true },
        });
        userMap = new Map(
          userProfiles.map((u: any) => [u.id.toString(), u.userProfile?.displayName])
        );
      }

      const mappedItems = items.map((item: any) => ({
        id: item.id.toString(),
        userId: item.userId?.toString(),
        userDisplayName: item.userId
          ? userMap.get(item.userId.toString()) || `Unknown User #${item.userId.toString()}`
          : null,
        type: item.type,
        slotsMo: item.slotsMo,
        slotsTu: item.slotsTu,
        slotsWe: item.slotsWe,
        slotsTh: item.slotsTh,
        slotsFr: item.slotsFr,
        slotsSa: item.slotsSa,
        slotsSu: item.slotsSu,
        dateChanged: item.dateChanged,
        dateCreated: item.dateCreated,
      }));

      // In-memory sort for userDisplayName
      if (input.sortBy === 'userDisplayName') {
        mappedItems.sort((a, b) => {
          const nameA = a.userDisplayName || '';
          const nameB = b.userDisplayName || '';
          if (nameA < nameB) return input.sortOrder === 'asc' ? -1 : 1;
          if (nameA > nameB) return input.sortOrder === 'asc' ? 1 : -1;
          return 0;
        });
      }

      return {
        items: mappedItems as any[],
        total,
      };
    }),
};
