import { Link, useMatches } from '@tanstack/react-router';
import { Fragment } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type ResolvedBreadcrumb = {
  id: string;
  label: string;
  href: string;
};

const normalizeLabels = (value: string | string[]) => (Array.isArray(value) ? value : [value]);

export function ManagerBreadcrumbs() {
  const { t } = useTranslation(['layout']);
  const matches = useMatches();

  const breadcrumbs: ResolvedBreadcrumb[] = matches.flatMap((match) => {
    const raw = match.staticData?.breadcrumb;
    if (!raw) return [];

    const value = typeof raw === 'function' ? raw(match) : raw;
    const labels = normalizeLabels(value);

    return labels.filter(Boolean).map((label, index) => ({
      id: `${match.id}-${index}`,
      label: t(label, label),
      href: match.pathname,
    }));
  });

  if (breadcrumbs.length <= 1) return null;

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((item, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <Fragment key={item.id}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{item.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={item.href} />}>{item.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
