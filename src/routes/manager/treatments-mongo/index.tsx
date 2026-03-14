import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import { PageTreatmentsMongo } from '@/features/treatment-table/manager/page-treatments-mongo';

export const Route = createFileRoute('/manager/treatments-mongo/')({
  component: RouteComponent,
  staticData: {
    breadcrumb: 'layout:nav.treatmentsMongo',
  },
  validateSearch: zodValidator(
    z.object({
      searchTerm: z.string().optional().default(''),
      limit: z.coerce.number().int().min(1).max(100).optional().default(25),
      page: z.coerce.number().int().min(1).optional().default(1),
      sortBy: z.enum(['id', 'bookNumber', 'state', 'dateStart', 'dateCreated']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    })
  ),
  search: {
    middlewares: [stripSearchParams({ searchTerm: '', limit: 25, page: 1, sortOrder: 'desc' })],
  },
});

function RouteComponent() {
  const search = Route.useSearch();
  return <PageTreatmentsMongo search={search as any} />;
}
