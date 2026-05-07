"use client";

import Image from "next/image";
import type { PublicTool } from "@/types/ui";
import { Link } from "@/navigation";
import OutboundLink from "./OutboundLink";

export type ToolCardProps = {
  tool: PublicTool;
  badgeAgentLabel: string;
  detailLabel: string;
  visitLabel: string;
  viewsLabel: string;
  starsLabel: string;
  favoriteLabel: string;
  favoritedLabel: string;
  isFavorite: boolean;
  onToggleFavorite: () => void;
};

export default function ToolCard({
  tool,
  badgeAgentLabel,
  detailLabel,
  visitLabel,
  viewsLabel,
  starsLabel,
  favoriteLabel,
  favoritedLabel,
  isFavorite,
  onToggleFavorite,
}: ToolCardProps) {
  const detailHref = `/tools/${tool.slug}`;

  return (
    <article className="flex h-full flex-col rounded-lg border border-gray-100 bg-white p-6 shadow-md transition hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/50">
      <div className="mb-3 flex gap-3">
        {tool.logoUrl ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-100 dark:bg-neutral-950 dark:ring-neutral-800">
            <Image
              src={tool.logoUrl}
              alt={tool.name}
              width={48}
              height={48}
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-lg font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200"
            aria-hidden
          >
            {tool.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="truncate text-xl font-semibold text-gray-900 dark:text-gray-50">
              {tool.name}
            </h3>
            {tool.isAgent && (
              <span className="shrink-0 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-200">
                {badgeAgentLabel}
              </span>
            )}
          </div>
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-500 dark:text-gray-400">
            <span>
              {viewsLabel}: {tool.clickCount.toLocaleString()}
            </span>
            <span>
              {starsLabel}: {tool.stars.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <p className="mb-3 line-clamp-3 flex-1 text-sm text-gray-600 dark:text-gray-300">
        {tool.description}
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600 dark:bg-neutral-800 dark:text-gray-300"
          >
            #{tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onToggleFavorite}
          className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${
            isFavorite
              ? "border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-100"
              : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-200 dark:hover:bg-neutral-800"
          }`}
          aria-pressed={isFavorite}
        >
          {isFavorite ? favoritedLabel : favoriteLabel}
        </button>
        <Link
          href={detailHref}
          className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-white"
        >
          {detailLabel}
        </Link>
        <OutboundLink
          href={tool.url}
          toolSlug={tool.slug}
          className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          {visitLabel}
        </OutboundLink>
      </div>
    </article>
  );
}
