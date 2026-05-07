export type SkeletonCardProps = {
  className?: string;
};

export default function SkeletonCard({ className = "" }: SkeletonCardProps) {
  return (
    <div
      className={`animate-pulse rounded-lg border border-gray-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 ${className}`}
      aria-hidden
    >
      <div className="mb-4 flex gap-3">
        <div className="h-12 w-12 shrink-0 rounded-lg bg-gray-200 dark:bg-neutral-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-gray-200 dark:bg-neutral-700" />
          <div className="h-3 w-1/3 rounded bg-gray-100 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="mb-3 space-y-2">
        <div className="h-3 w-full rounded bg-gray-100 dark:bg-neutral-800" />
        <div className="h-3 w-5/6 rounded bg-gray-100 dark:bg-neutral-800" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-14 rounded bg-gray-100 dark:bg-neutral-800" />
        <div className="h-6 w-14 rounded bg-gray-100 dark:bg-neutral-800" />
      </div>
      <div className="mt-4 h-9 w-24 rounded bg-gray-200 dark:bg-neutral-700" />
    </div>
  );
}
