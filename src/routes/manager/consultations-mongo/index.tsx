import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import { ConsultationDataListPage } from '@/features/consultation-data/consultation-data-list-page';

export const Route = createFileRoute('/manager/consultations-mongo/')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'layout:nav.consultations',
  },
  validateSearch: zodValidator(
    z.object({
      searchTerm: z.string().optional().default(''),
      limit: z.coerce.number().int().min(1).max(100).optional().default(25),
      page: z.coerce.number().int().min(1).optional().default(1),
      sortBy: z.enum(['id', 'date', 'bookNumber', 'state', 'type']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    })
  ),
  search: {
    middlewares: [stripSearchParams({ searchTerm: '', limit: 25, page: 1, sortOrder: 'desc' })],
  },
});

function RouteComponent() {
  const search = Route.useSearch();
  return <ConsultationDataListPage search={search} />;
}
