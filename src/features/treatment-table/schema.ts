import { z } from 'zod';

export const zTreatmentAssignedSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    formalDisplayName: z.string().nullable().optional(),
  });

export const zTreatmentJobSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    code: z.string().nullable().optional(),
    remoteCode: z.string().nullable().optional(),
    title: z.string().nullable().optional(),
    expertTitle: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    color: z.string().nullable().optional(),
  });

export const zTreatmentCustomerSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
  });

export const zTreatmentLocationSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    patientDataType: z.string().nullable().optional(),
    booknumberMask: z.string().nullable().optional(),
    customer: zTreatmentCustomerSchema().nullable().optional(),
  });

export const zTreatmentPositionSchema = () =>
  z.object({
    appointmentId: z.string().nullable().optional(),
    start: z.coerce.date().nullable().optional(),
    until: z.coerce.date().nullable().optional(),
    state: z.string().nullable().optional(),
    requireReport: z.boolean().nullable().optional(),
    forceReport: z.boolean().nullable().optional(),
  });

export const zTreatmentSchema = () =>
  z.object({
    id: z.string(),
    version: z.string().nullable().optional(),
    bookNumber: z.string().nullable().optional(),
    jNumber: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    hour: z.number().nullable().optional(),
    day: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
    archived: z.boolean().nullable().optional(),
    countTotal: z.number().nullable().optional(),
    countFinished: z.number().nullable().optional(),
    countPlanned: z.number().nullable().optional(),
    reportCountInitial: z.number().nullable().optional(),
    reportCountRhytm: z.number().nullable().optional(),
    minutes: z.number().nullable().optional(),
    dateCreated: z.coerce.date().nullable().optional(),
    dateChanged: z.coerce.date().nullable().optional(),
    dateStart: z.coerce.date().nullable().optional(),
    dateStarted: z.coerce.date().nullable().optional(),
    dateInitial: z.coerce.date().nullable().optional(),
    dateStorno: z.coerce.date().nullable().optional(),
    closed: z.coerce.date().nullable().optional(),
    dateLastAppointment: z.coerce.date().nullable().optional(),
    dateAcceptedPTLeitung: z.coerce.date().nullable().optional(),
    dateAcceptedPT: z.coerce.date().nullable().optional(),
    dateAcceptedLocation: z.coerce.date().nullable().optional(),
    assigned: zTreatmentAssignedSchema().nullable().optional(),
    job: zTreatmentJobSchema().nullable().optional(),
    jobReport: zTreatmentJobSchema().nullable().optional(),
    jobReportPobatorik: zTreatmentJobSchema().nullable().optional(),
    customer: zTreatmentCustomerSchema().nullable().optional(),
    location: zTreatmentLocationSchema().nullable().optional(),
    positions: z.array(zTreatmentPositionSchema()).nullable().optional(),
    reportingPath: z.string().nullable().optional(),
  });

export type Treatment = z.infer<ReturnType<typeof zTreatmentSchema>>;
