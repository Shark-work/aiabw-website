import SkeletonCard from "@/components/SkeletonCard";

export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <div className="border-b bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <div className="h-10 w-64 max-w-full animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" />
          <div className="mt-3 h-6 w-96 max-w-full animate-pulse rounded-lg bg-gray-100 dark:bg-neutral-800" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 h-11 max-w-md animate-pulse rounded-lg bg-gray-200 dark:bg-neutral-800" />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
