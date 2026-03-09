import { z } from 'zod';

export const zFileMetadata = z.object({
  id: z.string().optional().nullable(),
  name: z.string().optional().nullable(),
  mime: z.string().optional().nullable(),
  size: z.coerce.string().optional().nullable(),
  checksum: z.string().optional().nullable(),
  type: z.string().optional().nullable(),
  dateCreated: z.date().optional().nullable(),
});

export const zUserAddress = z.object({
  id: z.coerce.string().optional().nullable(),
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
  notificationPerMail: z.boolean().optional().nullable(),
  photo: zFileMetadata.optional().nullable(),
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
  lastLogin: z.date().optional().nullable(),
  lastIP: z.string().optional().nullable(),
  countLogin: z.number().optional().nullable(),
  invalidLogins: z.array(zLoginEvent).optional().nullable(),
  successfulLogins: z.array(zLoginEvent).optional().nullable(),
});

export type UserMongoSchema = z.infer<ReturnType<typeof zUserMongoSchema>>;
export const zUserMongoSchema = () => zUserMongo;
