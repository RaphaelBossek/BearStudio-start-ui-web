import { ThemeProvider } from 'next-themes';
import type { ReactNode } from 'react';
import '@/lib/dayjs/config';
import '@/lib/i18n';
import '@fontsource-variable/inter';

import { Sonner } from '@/components/ui/sonner';
import { envClient } from '@/env/client';
import { DemoModeDrawer, useIsDemoModeDrawerVisible } from '@/features/demo/demo-mode-drawer';
import { QueryClientProvider } from '@/lib/tanstack-query/provider';

export const Providers = (props: { children: ReactNode; forcedTheme?: string }) => {
  const isDemoModeDrawerVisible = useIsDemoModeDrawerVisible();
  return (
    <ThemeProvider
      attribute="class"
      storageKey="theme"
      disableTransitionOnChange
      forcedTheme={props.forcedTheme}
    >
      <QueryClientProvider>
        {props.children}
        {!isDemoModeDrawerVisible && <Sonner />}
        {envClient.VITE_IS_DEMO && <DemoModeDrawer />}
      </QueryClientProvider>
    </ThemeProvider>
  );
};
