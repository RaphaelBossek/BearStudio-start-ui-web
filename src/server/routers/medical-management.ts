import { z } from 'zod';
import { zService, zSkill } from '@/features/medical-management/schema';
import type { Prisma } from '@/server/db/generated/client';
import { protectedProcedure } from '@/server/orpc';

const tags = ['medical-management'];

export default {
  getAllServices: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/mcp/services',
      tags,
    })
    .input(
      z
        .object({
          searchTerm: z.string().optional(),
        })
        .prefault({})
    )
    .output(z.array(zService()))
    .handler(async ({ context, input }) => {
      const where: Prisma.ServiceWhereInput = {
        OR: [
          { internalName: { contains: input.searchTerm, mode: 'insensitive' } },
          { expertName: { contains: input.searchTerm, mode: 'insensitive' } },
        ],
      };

      return context.db.service.findMany({
        where,
        include: { department: true },
        orderBy: { sortOrder: 'asc' },
      });
    }),

  getAllSkills: protectedProcedure({ permission: null })
    .route({
      method: 'GET',
      path: '/mcp/skills',
      tags,
    })
    .input(
      z
        .object({
          searchTerm: z.string().optional(),
        })
        .prefault({})
    )
    .output(z.array(zSkill()))
    .handler(async ({ context, input }) => {
      const where: Prisma.SkillWhereInput = {
        name: { contains: input.searchTerm, mode: 'insensitive' },
      };

      return context.db.skill.findMany({
        where,
        orderBy: { name: 'asc' },
      });
    }),
};
