import { Badge } from '@/components/ui/badge';

const variantByType: Record<string, React.ComponentProps<typeof Badge>['variant']> = {
  EXTERNAL: 'secondary',
  STANDARD: 'default',
  DOCUMENT: 'warning',
  ONBOARDING: 'positive',
  ONBOARDING_SHORT: 'positive',
  INCARCERATION: 'negative',
  TREATMENT: 'warning',
};

export const ConsultationTypeBadge = ({ type }: { type: unknown }) => {
  const text = type ? String(type) : '—';
  return <Badge variant={variantByType[text] ?? 'secondary'}>{text}</Badge>;
};
