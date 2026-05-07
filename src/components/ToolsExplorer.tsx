"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { PublicTool } from "@/types/ui";
import { useToolLocalState } from "@/hooks/useToolLocalState";
import CategoryFilter, { type CategoryOption } from "./CategoryFilter";
import Pagination from "./Pagination";
import SearchBar from "./SearchBar";
import SkeletonCard from "./SkeletonCard";
import ToolCard from "./ToolCard";

const PAGE_SIZE = 12;

type SortKey = "clicks" | "name" | "stars";

type ApiList = {
  items: PublicTool[];
  total: number;
  page: number;
  pageSize: number;
};

/**
 * 工具库：调用 `/api/tools` 分页 + 搜索 + 分类 + 排序。
 */
export default function ToolsExplorer({
  initialCategoryOptions,
}: {
  initialCategoryOptions: CategoryOption[];
}) {
  const t = useTranslations("tools");
  const tUi = useTranslations("toolsUi");
  const { isFavorite, toggleFavorite, ready } = useToolLocalState();

  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [category, setCategory] = useState<"all" | string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("clicks");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ApiList | null>(null);

  useEffect(() => {
    const tmr = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(tmr);
  }, [q]);

  useEffect(() => {
    queueMicrotask(() => setPage(1));
  }, [debouncedQ, category, sortBy]);

  const fetchList = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams();
      sp.set("page", String(page));
      sp.set("pageSize", String(PAGE_SIZE));
      sp.set("sort", sortBy);
      if (debouncedQ.trim()) sp.set("q", debouncedQ.trim());
      if (category !== "all") sp.set("category", category);
      const res = await fetch(`/api/tools?${sp.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const json = (await res.json()) as ApiList;
      setData(json);
    } catch (e) {
      console.error(e);
      setError(tUi("loadError"));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedQ, category, sortBy, tUi]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchList();
    });
  }, [fetchList]);

  const totalPages = useMemo(() => {
    if (!data) return 1;
    return Math.max(1, Math.ceil(data.total / data.pageSize));
  }, [data]);

  const sortBtn = (key: SortKey, label: string) => (
    <button
      key={key}
      type="button"
      onClick={() => setSortBy(key)}
      className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
        sortBy === key
          ? "bg-blue-600 text-white shadow-sm"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-700"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 space-y-4">
        <SearchBar
          value={q}
          onChange={setQ}
          placeholder={tUi("searchPlaceholder")}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {tUi("sortLabel")}
          </span>
          {sortBtn("name", tUi("sortName"))}
          {sortBtn("clicks", tUi("sortViews"))}
          {sortBtn("stars", tUi("sortStars"))}
        </div>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-52">
          <CategoryFilter
            options={initialCategoryOptions}
            value={category}
            onChange={setCategory}
            allLabel={tUi("allCategories")}
          />
        </aside>

        <section className="min-w-0 flex-1">
          {error && (
            <p className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
              {error}
            </p>
          )}
          {loading || !ready ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : !data?.items.length ? (
            <p className="rounded-lg border border-dashed border-gray-200 bg-white py-16 text-center text-gray-500 dark:border-neutral-800 dark:bg-neutral-900 dark:text-gray-400">
              {tUi("noResults")}
            </p>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                {tUi("resultCount", { count: data.total })}
              </div>
              <ul className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {data.items.map((tool) => (
                  <li key={tool.id} className="h-full">
                    <ToolCard
                      tool={tool}
                      badgeAgentLabel={t("badgeAgent")}
                      detailLabel={tUi("detail")}
                      visitLabel={tUi("visit")}
                      viewsLabel={tUi("views")}
                      starsLabel={tUi("stars")}
                      favoriteLabel={tUi("favorite")}
                      favoritedLabel={tUi("favorited")}
                      isFavorite={isFavorite(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                    />
                  </li>
                ))}
              </ul>
              <Pagination
                page={page}
                totalPages={totalPages}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                prevLabel={tUi("prev")}
                nextLabel={tUi("next")}
                pageLabel={tUi("pageOf", { current: page, total: totalPages })}
                navLabel={tUi("paginationNav")}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
