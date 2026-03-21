import type { Outputs } from '@/server/router';

export type ConsultationListItem = Outputs['consultationListMongo']['list']['items'][number];
export type ConsultationData = NonNullable<Outputs['consultationDataMongo']['get']>;
export type ConsultationAnnotation = Outputs['consultationAnnotation']['get'];

export const consultationTypes = [
  'EXTERNAL',
  'STANDARD',
  'DOCUMENT',
  'ONBOARDING',
  'ONBOARDING_SHORT',
  'INCARCERATION',
  'TREATMENT',
] as const;

export type ConsultationType = (typeof consultationTypes)[number];

export const consultationStates = [
  'OPEN',
  'CREATED',
  'CLOSED',
  'REPORTED',
  'TRANSMITTED',
  'VERIFIED',
] as const;

export type ConsultationState = (typeof consultationStates)[number];

export const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

export const asArray = (value: unknown): Record<string, unknown>[] =>
  Array.isArray(value) ? (value as Record<string, unknown>[]) : [];

export const asString = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  return String(value);
};

export const asBoolText = (value: unknown): string => {
  if (value === null || value === undefined) return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return asString(value);
};

export const formatDate = (value: unknown): string => {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return asString(value);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const formatDateTime = (value: unknown): string => {
  if (!value) return '—';
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return asString(value);
  return date.toLocaleString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatSecondsTime = (value: unknown): string => {
  if (value === null || value === undefined || value === '') return '—';
  const seconds = Number(value);
  if (Number.isNaN(seconds)) return asString(value);
  const normalized = ((seconds % 86400) + 86400) % 86400;
  const hours = Math.floor(normalized / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((normalized % 3600) / 60)
    .toString()
    .padStart(2, '0');
  return `${hours}:${minutes}`;
};
