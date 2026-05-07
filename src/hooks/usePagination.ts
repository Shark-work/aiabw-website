import { useCallback, useMemo, useState } from "react";

export type PaginationResult<T> = {
  page: number;
  setPage: (p: number) => void;
  totalPages: number;
  /** 当前页数据切片 */
  slice: T[];
  pageSize: number;
  /** 总数（过滤后） */
  total: number;
  goPrev: () => void;
  goNext: () => void;
};

/**
 * 客户端分页：每页固定条数，页码从 1 开始。
 */
export function usePagination<T>(items: T[], pageSize: number): PaginationResult<T> {
  const [page, setPageState] = useState(1);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const pageClamped = Math.min(Math.max(1, page), totalPages);

  const slice = useMemo(() => {
    const start = (pageClamped - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, pageClamped, pageSize]);

  const setPage = useCallback(
    (p: number) => {
      setPageState(Math.min(Math.max(1, p), totalPages));
    },
    [totalPages]
  );

  const goPrev = useCallback(() => {
    setPageState((p) => Math.max(1, p - 1));
  }, []);

  const goNext = useCallback(() => {
    setPageState((p) => Math.min(totalPages, p + 1));
  }, [totalPages]);

  return {
    page: pageClamped,
    setPage,
    totalPages,
    slice,
    pageSize,
    total,
    goPrev,
    goNext,
  };
}
