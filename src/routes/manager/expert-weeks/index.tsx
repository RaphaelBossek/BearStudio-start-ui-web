import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';

import { PageExpertWeeks } from '@/features/expert-week/manager/page-expert-weeks';

export const Route = createFileRoute('/manager/expert-weeks/')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'layout:nav.expertWeeks',
  },
  validateSearch: zodValidator(
    z.object({
      searchTerm: z.string().optional().prefault(''),
      limit: z.coerce.number().int().min(1).max(100).optional().prefault(25),
      page: z.coerce.number().int().min(1).optional().prefault(1),
      sortBy: z.enum(['dateCreated', 'dateChanged', 'userDisplayName']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional(),
      history: z.array(z.string()).optional(),
    })
  ),
  search: {
    middlewares: [stripSearchParams({ searchTerm: '', limit: 25, page: 1 })],
  },
});

function RouteComponent() {
  const search = Route.useSearch();
  return <PageExpertWeeks search={search as any} />;
}
