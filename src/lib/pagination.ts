export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}

export const routePageToPageIndex = (page: number | undefined | null): number => {
  const routePage = Number.isFinite(page) ? Number(page) : 1;
  return Math.max(0, Math.floor(routePage) - 1);
};

export const calculatePageCount = (total: number, pageSize: number): number => {
  if (!Number.isFinite(total) || total <= 0) return 0;
  if (!Number.isFinite(pageSize) || pageSize <= 0) return 0;
  return Math.ceil(total / pageSize);
};

export const normalizePageCount = (pageCount: number | undefined | null): number => {
  if (!Number.isFinite(pageCount) || Number(pageCount) <= 0) return 0;
  return Math.floor(Number(pageCount));
};

export const clampPageIndex = (requestedPageIndex: number, pageCount: number): number => {
  const safePageCount = normalizePageCount(pageCount);
  const safeRequested = Number.isFinite(requestedPageIndex) ? Math.floor(requestedPageIndex) : 0;

  if (safePageCount === 0) return 0;

  return Math.max(0, Math.min(safeRequested, safePageCount - 1));
};

export const pageIndexToRoutePage = (pageIndex: number, pageCount: number): number => {
  const safePageIndex = clampPageIndex(pageIndex, pageCount);
  return safePageIndex + 1;
};
