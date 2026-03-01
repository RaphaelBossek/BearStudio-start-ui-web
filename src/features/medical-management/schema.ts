import { z } from 'zod';
import {
  AccountStatus,
  BillingModality,
  ConsultationType,
  FollowUpSetting,
  QualificationLevel,
  SkillType,
} from '@/server/db/generated/enums';

export const zDepartment = () =>
  z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

export const zSkill = () =>
  z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    type: z.nativeEnum(SkillType),
    active: z.boolean(),
    certificateRequired: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
  });

export const zService = () =>
  z.object({
    id: z.string(),
    internalName: z.string(),
    expertName: z.string(),
    invoiceName: z.string(),
    shortName: z.string(),
    color: z.string(),
    sortOrder: z.number(),
    billingModality: z.nativeEnum(BillingModality),
    departmentId: z.string(),
    consultationTypes: z.array(z.nativeEnum(ConsultationType)),
    defaultConsultationType: z.nativeEnum(ConsultationType).nullable(),
    followUpSetting: z.nativeEnum(FollowUpSetting).nullable(),
    skillLogic: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
    department: zDepartment().optional(),
  });

export const zExpertProfile = () =>
  z.object({
    id: z.string(),
    userId: z.string(),
    academicTitle: z.string().nullable(),
    salutation: z.string().nullable(),
    status: z.nativeEnum(AccountStatus),
    qualificationLevel: z.nativeEnum(QualificationLevel),
    active: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    user: z
      .object({
        name: z.string(),
        email: z.string(),
      })
      .optional(),
  });
