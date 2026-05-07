"use client";

export type PaginationProps = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
  pageLabel: string;
  navLabel: string;
};

export default function Pagination({
  page,
  totalPages,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
  pageLabel,
  navLabel,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav
      className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 pt-6 dark:border-neutral-800"
      aria-label={navLabel}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={page <= 1}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200"
      >
        {prevLabel}
      </button>
      <span className="text-sm text-gray-600 dark:text-gray-300">{pageLabel}</span>
      <button
        type="button"
        onClick={onNext}
        disabled={page >= totalPages}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200"
      >
        {nextLabel}
      </button>
    </nav>
  );
}
