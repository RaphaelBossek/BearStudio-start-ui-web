import type { InferRouterInputs, InferRouterOutputs } from '@orpc/server';

import accountRouter from './routers/account';
import appointmentMongoRouter from './routers/appointment-mongo';
import bookRouter from './routers/book';
import configRouter from './routers/config';
import expertWeekRouter from './routers/expert-week';
import genreRouter from './routers/genre';
import medicalManagementRouter from './routers/medical-management';
import shiftPlanMongoRouter from './routers/shift-plan-mongo';
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
};
