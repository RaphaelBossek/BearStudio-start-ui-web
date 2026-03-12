import type { AnyRouteMatch } from '@tanstack/react-router';

export type RouteBreadcrumbValue =
  | string
  | string[]
  | ((match: AnyRouteMatch) => string | string[]);

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    breadcrumb?: RouteBreadcrumbValue;
  }
}
