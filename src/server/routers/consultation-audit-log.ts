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
