import { z } from 'zod';

export type ExpertWeek = z.infer<ReturnType<typeof zExpertWeek>>;

export const zExpertWeek = () =>
  z.object({
    id: z.string(),
    userId: z.string().nullish(),
    userDisplayName: z.string().nullish(),
    type: z.string().nullish(),
    slotsMo: z.array(z.number()),
    slotsTu: z.array(z.number()),
    slotsWe: z.array(z.number()),
    slotsTh: z.array(z.number()),
    slotsFr: z.array(z.number()),
    slotsSa: z.array(z.number()),
    slotsSu: z.array(z.number()),
    dateChanged: z.date().nullish(),
    dateCreated: z.date().nullish(),
  });
