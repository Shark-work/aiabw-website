"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { PublicTool } from "@/types/ui";
import { Link } from "@/navigation";
import Image from "next/image";

/**
 * 首页热门：推荐 + 点击量（API `featured=1` + 排序由服务端处理）
 */
export default function PopularTools() {
  const tHome = useTranslations("home");
  const tUi = useTranslations("toolsUi");
  const [items, setItems] = useState<PublicTool[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          "/api/tools?featured=1&pageSize=6&page=1&sort=clicks",
          { cache: "no-store" }
        );
        const json = await res.json();
        if (!cancelled && json?.items) setItems(json.items);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) return null;
  if (!items.length) return null;

  return (
    <section className="container mx-auto max-w-5xl px-4 pb-20">
      <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-50">
        {tHome("popularTitle")}
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((tool) => (
          <li key={tool.id}>
            <Link
              href={`/tools/${tool.slug}`}
              className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-blue-700"
            >
              {tool.logoUrl ? (
                <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-white ring-1 ring-gray-100 dark:bg-neutral-950 dark:ring-neutral-800">
                  <Image
                    src={tool.logoUrl}
                    alt={tool.name}
                    width={44}
                    height={44}
                    className="object-contain"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-sm font-bold text-blue-700 dark:bg-blue-950 dark:text-blue-200">
                  {tool.name.slice(0, 1).toUpperCase()}
                </div>
              )}
              <div className="min-w-0 flex-1 text-left">
                <p className="truncate font-semibold text-gray-900 dark:text-gray-50">
                  {tool.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {tUi("views")}: {tool.clickCount.toLocaleString()}
                </p>
                <p className="mt-0.5 line-clamp-2 text-xs text-gray-600 dark:text-gray-300">
                  {tool.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
