export const logger = {
  info: (...args: any[]) => {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.SSR &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).serverLogger
    ) {
      (globalThis as any).serverLogger.info(...args);
    } else {
      console.info(...args);
    }
  },
  warn: (...args: any[]) => {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.SSR &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).serverLogger
    ) {
      (globalThis as any).serverLogger.warn(...args);
    } else {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.SSR &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).serverLogger
    ) {
      (globalThis as any).serverLogger.error(...args);
    } else {
      console.error(...args);
    }
  },
  debug: (...args: any[]) => {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.SSR &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).serverLogger
    ) {
      (globalThis as any).serverLogger.debug(...args);
    } else {
      console.debug(...args);
    }
  },
  trace: (...args: any[]) => {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.SSR &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).serverLogger
    ) {
      (globalThis as any).serverLogger.trace(...args);
    } else {
      console.trace(...args);
    }
  },
  fatal: (...args: any[]) => {
    if (
      typeof import.meta !== 'undefined' &&
      import.meta.env &&
      import.meta.env.SSR &&
      typeof globalThis !== 'undefined' &&
      (globalThis as any).serverLogger
    ) {
      (globalThis as any).serverLogger.fatal(...args);
    } else {
      console.error(...args); // console doesn't have fatal, map to error
    }
  },
};

export const checkLoggerMessages = () => {
  logger.fatal('Fatal logs are working');
  logger.error('Error logs are working');
  logger.warn('Warn logs are working');
  logger.info('Info logs are working');
  logger.debug('Debug logs are working');
  logger.trace('Trace logs are working');
};
