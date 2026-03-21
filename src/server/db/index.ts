import { envServer } from '@/env/server';
import { timingStore } from '@/server/timing-store';

import { PrismaClient } from './generated/client';
import { PrismaClient as PrismaClientMongo } from './generated-mongodb/client';

const levels = {
  trace: ['query', 'error', 'warn', 'info'],
  debug: ['error', 'warn', 'info'],
  info: ['error', 'warn', 'info'],
  warn: ['error', 'warn'],
  error: ['error'],
  fatal: ['error'],
} satisfies Record<string, ('query' | 'error' | 'warn' | 'info')[]>;

function createPrisma() {
  return new PrismaClient({
    log: levels[envServer.LOGGER_LEVEL],
  }).$extends({
    name: 'server-timing',
    query: {
      $allModels: {
        async $allOperations({ query, args, model, operation }) {
          const start = performance.now();

          let result: unknown;
          try {
            result = await query(args);
          } catch (error: unknown) {
            // Better Auth's sign-out calls session.delete() unconditionally.
            // If the session is already gone (expired/cleaned up), Prisma throws P2025.
            // Swallow this specific case to avoid crashing the sign-out flow.
            if (
              model === 'Session' &&
              operation === 'delete' &&
              error instanceof Error &&
              'code' in error &&
              (error as { code: string }).code === 'P2025'
            ) {
              result = null;
            } else {
              throw error;
            }
          }

          const duration = performance.now() - start;

          const store = timingStore.getStore();
          if (store) {
            store.prisma.push({
              model,
              operation,
              duration,
            });
          }

          return result;
        },
      },
    },
  });
}

function createPrismaMongo() {
  return new PrismaClientMongo({
    log: levels[envServer.LOGGER_LEVEL],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrisma> | undefined;
  prismaMongo: ReturnType<typeof createPrismaMongo> | undefined;
  serverTiming?: Array<{ key: string; duration: string }>;
};

export const db = globalForPrisma.prisma ?? createPrisma();
export const dbMongoDB = globalForPrisma.prismaMongo ?? createPrismaMongo();

if (import.meta.env.DEV) {
  globalForPrisma.prisma = db;
  globalForPrisma.prismaMongo = dbMongoDB;
}
