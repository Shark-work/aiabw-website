import SkeletonCard from "@/components/SkeletonCard";

export default function ToolSlugLoading() {
  return (
    <div className="container mx-auto max-w-3xl px-4 py-10">
      <div className="mb-6 h-5 w-32 animate-pulse rounded bg-gray-200 dark:bg-neutral-800" />
      <SkeletonCard />
    </div>
  );
}
