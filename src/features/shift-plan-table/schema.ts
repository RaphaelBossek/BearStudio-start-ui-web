import { z } from 'zod';

export const zConsultationDoctorSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
  });

export const zConsultationJobSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    shortcode: z.string().nullable().optional(),
    expertTitle: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
  });

export const zShiftPlanSchema = () =>
  z.object({
    id: z.string(),
    version: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    day: z.string().nullable().optional(),
    scheduling: z.string().nullable().optional(),
    schedulingMulitplier: z.number().nullable().optional(),
    timeStart: z.number().nullable().optional(),
    timeEnd: z.number().nullable().optional(),
    job: zConsultationJobSchema().nullable().optional(),
    minPatients: z.number().nullable().optional(),
    count: z.number().nullable().optional(),
    lastDate: z.coerce.date().nullable().optional(),
    priceType: z.string().nullable().optional(),
    dateChanged: z.coerce.date().nullable().optional(),
    changedBy: zConsultationDoctorSchema().nullable().optional(),
    dateCreated: z.coerce.date().nullable().optional(),
    createdBy: zConsultationDoctorSchema().nullable().optional(),
    comment: z.string().nullable().optional(),
    class: z.string().nullable().optional(),
  });

export type ShiftPlan = z.infer<ReturnType<typeof zShiftPlanSchema>>;
