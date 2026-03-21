import { z } from 'zod';

export const annotationUpsertSchema = z.object({
  consultationMongoId: z.string(),
  commentOverride: z.string().nullable().optional(),
  requireReportingOverride: z.boolean().nullable().optional(),
  bookNumberOverride: z.string().nullable().optional(),
  dateOverride: z.string().nullable().optional(),
  typeOverride: z.string().nullable().optional(),
  noWarningsOverride: z.boolean().nullable().optional(),
  archivedOverride: z.boolean().nullable().optional(),
  bodyOverride: z.record(z.string(), z.unknown()).nullable().optional(),
  baseOverride: z.record(z.string(), z.unknown()).nullable().optional(),
  onboardingOverride: z.record(z.string(), z.unknown()).nullable().optional(),
  incarcerationOverride: z.record(z.string(), z.unknown()).nullable().optional(),
  treatmentOverride: z.record(z.string(), z.unknown()).nullable().optional(),
  standardOverride: z.record(z.string(), z.unknown()).nullable().optional(),
  referralOverride: z.record(z.string(), z.unknown()).nullable().optional(),
  warningsOverride: z.record(z.string(), z.unknown()).nullable().optional(),
});

export type AnnotationUpsertInput = z.infer<typeof annotationUpsertSchema>;

// Section schemas (used for form validation)

const consultationBodySchema = z.object({
  gender: z.string().optional(),
  birthday: z.string().optional(),
  age: z.coerce.number().optional(),
  bodyHeight: z.coerce.number().optional(),
  bodyWeight: z.coerce.number().optional(),
  rr: z.string().optional(),
  pulse: z.string().optional(),
});

const consultationBaseSchema = z.object({
  communicationType: z.string().optional(),
  medicalTrainedPersonel: z.boolean().optional(),
  timeContact: z.coerce.number().optional(),
  furtherTreatment: z.string().optional(),
  dateFurtherTreatment: z.string().optional(),
});

const consultationOnboardingSchema = z.object({
  generalState: z.string().optional(),
  weightState: z.string().optional(),
  stateInfo: z.string().optional(),
  previousPhysician: z.string().optional(),
  preexistingState: z.string().optional(),
  preexistingCondition: z.string().optional(),
  allergies: z.boolean().optional(),
  currentState: z.string().optional(),
  hepatitis: z.string().optional(),
  lungTuberculosis: z.string().optional(),
  std: z.string().optional(),
  hiv: z.string().optional(),
  transmittalInfo: z.string().optional(),
  skinCondition: z.string().optional(),
  senseCondition: z.string().optional(),
  eyeCondition: z.string().optional(),
  earCondition: z.string().optional(),
  alcoholUsage: z.string().optional(),
  tabaccoUsage: z.string().optional(),
  drugUsage: z.string().optional(),
  additionalPrescription: z.boolean().optional(),
  heartCondition: z.string().optional(),
  lungCondition: z.string().optional(),
  abdomenCondition: z.string().optional(),
  kidneyCondition: z.string().optional(),
  extremitiesCondition: z.string().optional(),
  centralNerveSystemCondition: z.string().optional(),
  psychologicalCondition: z.string().optional(),
  otherConditions: z.string().optional(),
  incarcerationSuitability: z.boolean().optional(),
  singleRoomSuitability: z.boolean().optional(),
  workSuitability: z.string().optional(),
  outDoorWorkSuitability: z.boolean().optional(),
  sportSuitability: z.string().optional(),
  requireTreatment: z.boolean().optional(),
  treatmentInfo: z.string().optional(),
  suicidal: z.boolean().optional(),
  dangerous: z.boolean().optional(),
  suitabilityInfo: z.string().optional(),
});

const consultationIncarcerationSchema = z.object({
  type: z.string().optional(),
  examinationCapability: z.boolean().optional(),
  incarcerationCapability: z.boolean().optional(),
  checkupRequirement: z.string().optional(),
  healthImprovementTime: z.string().optional(),
  improvementControlInterval: z.string().optional(),
  specialDiataryRequirement: z.boolean().optional(),
  requireVideo: z.boolean().optional(),
  otherRequirements: z.string().optional(),
  consumedAlcohol: z.boolean().optional(),
  consumedMedication: z.boolean().optional(),
  consumedOtherIntoxicatingSubstances: z.boolean().optional(),
  dateConsumedLastTime: z.string().optional(),
  timeConsumedLastTime: z.string().optional(),
  consumedLastTimeAmount: z.string().optional(),
  generalConditionNoticeable: z.boolean().optional(),
  intox: z.boolean().optional(),
  abnormalPupils: z.boolean().optional(),
  abnormalPupilsDescription: z.string().optional(),
  knownAllergiesIntolerances: z.boolean().optional(),
  knownAllergiesIntolerancesDescription: z.string().optional(),
  knownAddictionDisorder: z.boolean().optional(),
  knownAddictionDisorderDescription: z.string().optional(),
  nerologyDescription: z.string().optional(),
  intoxication: z.string().optional(),
  intoxicationDescription: z.string().optional(),
  reflexBehaviorNoticeable: z.boolean().optional(),
  abnormalHeadNeck: z.boolean().optional(),
  abnormalChestOrgans: z.boolean().optional(),
  abnormalLimbsJoints: z.boolean().optional(),
  abnormalHeartAuscultatory: z.boolean().optional(),
  abnormalCirculation: z.boolean().optional(),
  pulseFrequency: z.coerce.number().optional(),
  tachykard: z.boolean().optional(),
  bradycard: z.boolean().optional(),
  bloodPressure: z.string().optional(),
  skinColor: z.string().optional(),
  intoxicationComment: z.string().optional(),
  respiratoryTract: z.string().optional(),
  respiratoryFrequency: z.string().optional(),
  bodyTemperature: z.coerce.number().optional(),
  saturation: z.coerce.number().optional(),
  signsOfSuicidalityAtExamination: z.boolean().optional(),
  signsOfSuicidalityDescription: z.string().optional(),
  bodyCheckComment: z.string().optional(),
});

const consultationTreatmentSchema = z.object({
  anamnesisSocial: z.string().optional(),
  anamnesisEducationJob: z.string().optional(),
  anamnesisFamily: z.string().optional(),
  anamnesisSelf: z.string().optional(),
  specificDiseaseDevelopment: z.string().optional(),
  anamnesisVegetative: z.string().optional(),
  anamnesisSubstance: z.string().optional(),
  anamnesisDelinquency: z.string().optional(),
  medication: z.string().optional(),
  reportPsychDiagnostic: z.string().optional(),
  reportsPsychopathologicalAdmission: z.string().optional(),
  medicalAdmissiontelepsychotherapy: z.string().optional(),
  history: z.array(z.any()).optional(),
  furtherTreatmentRecommendations: z.string().optional(),
  furtherGoals: z.string().optional(),
});

const consultationReferralSchema = z.object({
  referPsychotherapy: z.boolean().optional(),
  psychoTherapy: z
    .object({
      comment: z.string().optional(),
    })
    .optional(),
});

const anamnesisSchema = z.object({
  type: z.string(),
  documentation: z.string().optional(),
});

const patientReportSchema = z.object({
  type: z.string(),
  documentation: z.string().optional(),
});

const diagnosisSchema = z.object({
  localization: z.string().optional(),
  level: z.string().optional(),
  title: z.string().optional(),
  icd10: z.any().optional(),
  comment: z.string().optional(),
});

const prescriptionSchema = z.object({
  medication: z.any().optional(),
  type: z.string().optional(),
  packages: z.coerce.number().optional(),
  product: z.any().optional(),
  morning: z.coerce.number().optional(),
  lunch: z.coerce.number().optional(),
  evening: z.coerce.number().optional(),
  night: z.coerce.number().optional(),
  amountEveryXDays: z.coerce.number().optional(),
  everyXDays: z.coerce.number().optional(),
  start: z.string().optional(),
  dosageRequirement: z.string().optional(),
  dosageAmount: z.string().optional(),
  initialDosageGiven: z.boolean().optional(),
  comment: z.string().optional(),
});

const workIncapacitySchema = z.object({
  documentation: z.string().optional(),
  start: z.string().optional(),
  end: z.string().optional(),
});

const consultationStandardSchema = z.object({
  medicationAnamnesis: z
    .object({
      documentation: z.string().optional(),
    })
    .optional(),
  anamnesis: z.array(anamnesisSchema).optional(),
  patientReport: z.array(patientReportSchema).optional(),
  diagnosis: z.array(diagnosisSchema).optional(),
  prescription: z.array(prescriptionSchema).optional(),
  workIncapacity: z.array(workIncapacitySchema).optional(),
  procedureReport: z.string().optional(),
  referralTo: z.string().optional(),
});

const consultationWarningSchema = z.object({
  applies: z.boolean().optional(),
  comment: z.string().optional(),
  dateStart: z.string().optional(),
  warning: z.any().optional(),
});

// Form validation schema for editing consultation data
export const consultationFormSchema = z.object({
  bookNumber: z.string().optional(),
  date: z.string().optional(),
  timeStart: z.coerce.number().optional(),
  timeEnd: z.coerce.number().optional(),
  type: z.string().optional(),
  comment: z.string().optional(),
  requireReporting: z.boolean().optional(),
  noWarnings: z.boolean().optional(),

  base: consultationBaseSchema.optional(),
  body: consultationBodySchema.optional(),
  onboarding: consultationOnboardingSchema.optional(),
  incarceration: consultationIncarcerationSchema.optional(),
  treatment: consultationTreatmentSchema.optional(),
  standard: consultationStandardSchema.optional(),
  referral: consultationReferralSchema.optional(),
  warnings: z.array(consultationWarningSchema).optional(),
});

export type ConsultationFormInput = z.infer<typeof consultationFormSchema>;
