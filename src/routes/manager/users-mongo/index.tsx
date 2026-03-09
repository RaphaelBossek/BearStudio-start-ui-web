import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import { PageUsersMongo } from '@/features/user-table/manager/page-users-mongo';

export const Route = createFileRoute('/manager/users-mongo/')({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      searchTerm: z.string().optional().default(''),
      limit: z.coerce.number().int().min(1).max(100).optional().default(25),
      page: z.coerce.number().int().min(1).optional().default(1),
      sortBy: z
        .enum(['id', 'username', 'email', 'userProfile.displayName', 'lastLogin'])
        .optional(),
      sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    })
  ),
  search: {
    middlewares: [stripSearchParams({ searchTerm: '', limit: 25, page: 1, sortOrder: 'asc' })],
  },
});

function RouteComponent() {
  const search = Route.useSearch();
  return <PageUsersMongo search={search as any} />;
}
