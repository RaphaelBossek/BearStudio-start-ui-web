import { Badge } from '@/components/ui/badge';

const variantByState: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
  OPEN: 'warning',
  CREATED: 'secondary',
  CLOSED: 'positive',
  REPORTED: 'positive',
  TRANSMITTED: 'default',
  VERIFIED: 'positive',
};

export const ConsultationStateBadge = ({ state }: { state: unknown }) => {
  const text = state ? String(state) : '—';
  return <Badge variant={variantByState[text] ?? 'secondary'}>{text}</Badge>;
};
