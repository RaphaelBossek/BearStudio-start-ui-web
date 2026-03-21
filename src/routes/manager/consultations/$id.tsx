import { createFileRoute } from '@tanstack/react-router';
import { ConsultationDataPage } from '@/features/consultation-data/consultation-data-page';

export const Route = createFileRoute('/manager/consultations/$id')({
  staticData: {
    breadcrumb: (match) => ['layout:nav.consultations', `#${match.params.id}`],
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  return <ConsultationDataPage consultationId={id} />;
}
