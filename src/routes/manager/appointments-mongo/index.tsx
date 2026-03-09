import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { z } from 'zod';
import { PageAppointmentsMongo } from '@/features/appointment-table/manager/page-appointments-mongo';

export const Route = createFileRoute('/manager/appointments-mongo/')({
  component: RouteComponent,
  validateSearch: zodValidator(
    z.object({
      searchTerm: z.string().optional().default(''),
      limit: z.coerce.number().int().min(1).max(100).optional().default(25),
      page: z.coerce.number().int().min(1).optional().default(1),
      sortBy: z.enum(['id', 'title', 'start', 'state']).optional(),
      sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
    })
  ),
  search: {
    middlewares: [stripSearchParams({ searchTerm: '', limit: 25, page: 1, sortOrder: 'asc' })],
  },
});

function RouteComponent() {
  const search = Route.useSearch();
  return <PageAppointmentsMongo search={search as any} />;
}
