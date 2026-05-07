"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import type { PublicTool } from "@/types/ui";
import { useToolLocalState } from "@/hooks/useToolLocalState";
import { Link } from "@/navigation";
import OutboundLink from "./OutboundLink";

export type ToolDetailBodyProps = {
  tool: PublicTool;
  categoryLabel: string;
};

export default function ToolDetailBody({ tool, categoryLabel }: ToolDetailBodyProps) {
  const locale = useLocale();
  const t = useTranslations("tools");
  const tUi = useTranslations("toolsUi");
  const { isFavorite, toggleFavorite } = useToolLocalState();

  const dateLocale = locale === "zh" ? "zh-CN" : "en-US";

  return (
    <article className="container mx-auto max-w-3xl px-4 py-10">
      <Link
        href="/tools"
        className="mb-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400"
      >
        ← {tUi("backToTools")}
      </Link>

      <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start">
        {tool.logoUrl ? (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white ring-1 ring-gray-100 dark:bg-neutral-950 dark:ring-neutral-800">
            <Image
              src={tool.logoUrl}
              alt={tool.name}
              width={64}
              height={64}
              className="object-contain"
              unoptimized
            />
          </div>
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
            {tool.name.slice(0, 1).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
              {tool.name}
            </h1>
            {tool.isAgent && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/50 dark:text-green-200">
                {t("badgeAgent")}
              </span>
            )}
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {tUi("category")}: {categoryLabel}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-300">
            <span>
              {tUi("views")}: {tool.clickCount.toLocaleString()}
            </span>
            <span>
              {tUi("stars")}: {tool.stars.toLocaleString()}
            </span>
          </div>
        </div>
      </header>

      <p className="mb-8 text-lg leading-relaxed text-gray-700 dark:text-gray-200">
        {tool.description}
      </p>

      <div className="mb-8 flex flex-wrap gap-2">
        {tool.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-700 dark:bg-neutral-800 dark:text-gray-200"
          >
            #{tag}
          </span>
        ))}
      </div>

      <dl className="mb-8 grid gap-2 rounded-xl border border-gray-100 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 sm:grid-cols-2">
        <div>
          <dt className="text-gray-500 dark:text-gray-400">{tUi("createdAt")}</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">
            {new Date(tool.createdAt).toLocaleDateString(dateLocale)}
          </dd>
        </div>
        <div>
          <dt className="text-gray-500 dark:text-gray-400">{tUi("updatedAt")}</dt>
          <dd className="font-medium text-gray-900 dark:text-gray-100">
            {new Date(tool.updatedAt).toLocaleDateString(dateLocale)}
          </dd>
        </div>
      </dl>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => toggleFavorite(tool.id)}
          className={`rounded-lg border px-4 py-2.5 text-sm font-semibold transition ${
            isFavorite(tool.id)
              ? "border-amber-400 bg-amber-50 text-amber-950 dark:border-amber-600 dark:bg-amber-950/50 dark:text-amber-100"
              : "border-gray-200 bg-white text-gray-800 hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-gray-100 dark:hover:bg-neutral-800"
          }`}
        >
          {isFavorite(tool.id) ? tUi("favorited") : tUi("favorite")}
        </button>
        <OutboundLink
          href={tool.url}
          toolSlug={tool.slug}
          className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          {tUi("visit")}
        </OutboundLink>
      </div>
    </article>
  );
}
