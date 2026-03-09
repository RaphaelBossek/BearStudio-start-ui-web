import { z } from 'zod';

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

export const zConsultationCustomerSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
  });

export const zConsultationLocationSchema = () =>
  z.object({
    id: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    address: z.string().nullable().optional(),
  });

export const zAppointmentSchema = () =>
  z.object({
    id: z.string(),
    version: z.string().nullable().optional(),
    start: z.coerce.date().nullable().optional(),
    until: z.coerce.date().nullable().optional(),
    adjustedStart: z.coerce.date().nullable().optional(),
    adjustedUntil: z.coerce.date().nullable().optional(),
    actualStart: z.coerce.date().nullable().optional(),
    actualUntil: z.coerce.date().nullable().optional(),
    loggedStart: z.coerce.date().nullable().optional(),
    loggedUntil: z.coerce.date().nullable().optional(),
    verifiedStart: z.coerce.date().nullable().optional(),
    verifiedUntil: z.coerce.date().nullable().optional(),
    billStart: z.coerce.date().nullable().optional(),
    billUntil: z.coerce.date().nullable().optional(),
    dateStarted: z.coerce.date().nullable().optional(),
    dateDone: z.coerce.date().nullable().optional(),
    dateStorno: z.coerce.date().nullable().optional(),
    firstContact: z.coerce.date().nullable().optional(),
    dateCreated: z.coerce.date().nullable().optional(),
    dateChanged: z.coerce.date().nullable().optional(),
    title: z.string().nullable().optional(),
    comment: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    type: z.string().nullable().optional(),
    job: zConsultationJobSchema().nullable().optional(),
    billingType: z.string().nullable().optional(),
    paymentType: z.string().nullable().optional(),
    priceType: z.string().nullable().optional(),
    customer: zConsultationCustomerSchema().nullable().optional(),
    location: zConsultationLocationSchema().nullable().optional(),
    treatmentId: z.string().nullable().optional(),
    minPatients: z.number().nullable().optional(),
    actualPatients: z.number().nullable().optional(),
    billablePatients: z.number().nullable().optional(),
    payablePatients: z.number().nullable().optional(),
    billableBaseTime: z.string().nullable().optional(),
    workTimePlanned: z.string().nullable().optional(),
    workTimeActual: z.string().nullable().optional(),
    workTimeIs: z.string().nullable().optional(),
    requiredStaffCount: z.number().nullable().optional(),
    addedStaffCount: z.number().nullable().optional(),
    backlogCount: z.number().nullable().optional(),
    adjustedStaffCount: z.number().nullable().optional(),
    assignedStaffCount: z.number().nullable().optional(),
    reservedStaffCount: z.number().nullable().optional(),
    missing: z.string().nullable().optional(),
    finished: z.boolean().nullable().optional(),
    countFurtherFollowUp: z.number().nullable().optional(),
    countFurtherIfRequired: z.number().nullable().optional(),
    countFurtherReferral: z.number().nullable().optional(),
    countFurtherReferralOther: z.number().nullable().optional(),
    period: z.number().nullable().optional(),
    changedById: z.string().nullable().optional(),
    createdById: z.string().nullable().optional(),
    stornoById: z.string().nullable().optional(),
    planId: z.string().nullable().optional(),
    shiftPlanId: z.string().nullable().optional(),
    expertOnly: z.boolean().nullable().optional(),
    jobSupport: z.boolean().nullable().optional(),
    treatmentRequireReport: z.boolean().nullable().optional(),
    assignedDisplayName: z.string().nullable().optional(),
    unmatchedShiftCalls: z.number().nullable().optional(),
    unmatchedConsultationsCalls: z.number().nullable().optional(),
    class: z.string().nullable().optional(),
  });

export type Appointment = z.infer<ReturnType<typeof zAppointmentSchema>>;
