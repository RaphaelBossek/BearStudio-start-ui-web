import type { InferRouterInputs, InferRouterOutputs } from '@orpc/server';

import accountRouter from './routers/account';
import appointmentMongoRouter from './routers/appointment-mongo';
import bookRouter from './routers/book';
import configRouter from './routers/config';
import consultationAnnotationRouter from './routers/consultation-annotation';
import consultationAuditLogRouter from './routers/consultation-audit-log';
import consultationDataMongoRouter from './routers/consultation-data-mongo';
import consultationListMongoRouter from './routers/consultation-list-mongo';
import expertWeekRouter from './routers/expert-week';
import genreRouter from './routers/genre';
import medicalManagementRouter from './routers/medical-management';
import shiftPlanMongoRouter from './routers/shift-plan-mongo';
import treatmentMongoRouter from './routers/treatment-mongo';
import userRouter from './routers/user';
import userMongoRouter from './routers/user-mongo';

export type Router = typeof router;
export type Inputs = InferRouterInputs<typeof router>;
export type Outputs = InferRouterOutputs<typeof router>;
export const router = {
  account: accountRouter,
  book: bookRouter,
  genre: genreRouter,
  user: userRouter,
  userMongo: userMongoRouter,
  config: configRouter,
  medicalManagement: medicalManagementRouter,
  expertWeek: expertWeekRouter,
  appointmentMongo: appointmentMongoRouter,
  shiftPlanMongo: shiftPlanMongoRouter,
  treatmentMongo: treatmentMongoRouter,
  consultationDataMongo: consultationDataMongoRouter,
  consultationListMongo: consultationListMongoRouter,
  consultationAnnotation: consultationAnnotationRouter,
  consultationAuditLog: consultationAuditLogRouter,
};
