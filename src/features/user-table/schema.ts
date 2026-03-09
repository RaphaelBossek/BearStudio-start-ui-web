import { z } from 'zod';

export const zFileMetadata = z.object({
  id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  mime: z.string().optional().nullable(),
  size: z.coerce.string().optional().nullable(), // BigInt in Prisma
  checksum: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  dateCreated: z.date().optional().nullable(),
});

export const zUserAddress = z.object({
  id: z.coerce.string().optional().nullable(), // BigInt in Prisma
  name: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  address2: z.string().optional().nullable(),
  zip: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
});

export const zUserProfile = z.object({
  id: z.string().optional().nullable(),
  firstName: z.string().optional().nullable(),
  lastName: z.string().optional().nullable(),
  displayName: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
  salutation: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  birthday: z.date().optional().nullable(),
  mainAddress: zUserAddress.optional().nullable(),
  cellularNumber: z.string().optional().nullable(),
  shiftPhoneNumber: z.string().optional().nullable(),
  homePhone: z.string().optional().nullable(),
  faxNumber: z.string().optional().nullable(),
  workPhone: z.string().optional().nullable(),
  notificationPerMail: z.boolean().optional().nullable(),
  photo: zFileMetadata.optional().nullable(),
});

export const zEmployeeSkillAssignment = z.object({
  id: z.string().optional().nullable(),
  active: z.boolean().optional().nullable(),
  dateCertification: z.date().optional().nullable(),
  certification: zFileMetadata.optional().nullable(),
});

export const zWatchedCategory = z.object({
  categoryId: z.coerce.string().optional().nullable(),
  date: z.date().optional().nullable(),
});

export const zBayernBoxAccess = z.object({
  username: z.string().optional().nullable(),
  password: z.string().optional().nullable(),
});

export const zEmployeeProfile = z.object({
  id: z.string().optional().nullable(),
  email2: z.string().optional().nullable(),
  activeSince: z.date().optional().nullable(),
  bank: z.string().optional().nullable(),
  iban: z.string().optional().nullable(),
  bic: z.string().optional().nullable(),
  taxid: z.string().optional().nullable(),
  uid: z.string().optional().nullable(),
  mailInvoice: z.boolean().optional().nullable(),
  postInvoice: z.boolean().optional().nullable(),
  shift: z.string().optional().nullable(),
  appointment: z.string().optional().nullable(),
  therapy: z.string().optional().nullable(),
  skills: z.array(zEmployeeSkillAssignment).optional().nullable(),
  exclusionCriteria: z.array(z.string()).optional().nullable(),
  imageSignature: zFileMetadata.optional().nullable(),
  bayernBoxAccess: zBayernBoxAccess.optional().nullable(),
  categoriesWatched: z.array(zWatchedCategory).optional().nullable(),
});

export const zEmployerProfile = z.object({
  id: z.string().optional().nullable(),
  konto: z.string().optional().nullable(),
  gkto: z.string().optional().nullable(),
  efn: z.string().optional().nullable(),
  level: z.string().optional().nullable(),
  activeSince: z.date().optional().nullable(),
  activeUntil: z.date().optional().nullable(),
  activeSinceVC: z.date().optional().nullable(),
  activeUntilVC: z.date().optional().nullable(),
  currentIncome: z.number().optional().nullable(),
  inctiveReason: z.string().optional().nullable(),
});

export const zTotpDevice = z.object({
  ip: z.string().optional().nullable(),
  dateRegistered: z.date().optional().nullable(),
  secret: z.string().optional().nullable(),
  activated: z.date().optional().nullable(),
});

export const zTotpActivity = z.object({
  dateAccess: z.date().optional().nullable(),
  ip: z.string().optional().nullable(),
  ua: z.string().optional().nullable(),
  action: z.string().optional().nullable(),
});

export const zLoginEvent = z.object({
  ip: z.string().optional().nullable(),
  date: z.date().optional().nullable(),
  first: z.date().optional().nullable(),
  ua: z.string().optional().nullable(),
  count: z.number().optional().nullable(),
});

export const zUserMongo = z.object({
  id: z.string(),
  username: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  enabled: z.boolean().optional().nullable(),
  role: z.string().optional().nullable(),
  userProfile: zUserProfile.optional().nullable(),
  employeeProfile: zEmployeeProfile.optional().nullable(),
  employerProfile: zEmployerProfile.optional().nullable(),
  totpDevice: zTotpDevice.optional().nullable(),
  totpActivity: zTotpActivity.optional().nullable(),
  requireTotp: z.boolean().optional().nullable(),
  lastLogin: z.date().optional().nullable(),
  lastIP: z.string().optional().nullable(),
  countLogin: z.number().optional().nullable(),
  invalidLogins: z.array(zLoginEvent).optional().nullable(),
  successfulLogins: z.array(zLoginEvent).optional().nullable(),
  dateCreated: z.date().optional().nullable(),
  dateChanged: z.date().optional().nullable(),
});

export type UserMongoSchema = z.infer<ReturnType<typeof zUserMongoSchema>>;
export const zUserMongoSchema = () => zUserMongo;
