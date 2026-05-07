"use client";

import { useCallback, useEffect, useState } from "react";

type Cat = { id: string; name: string; slug: string; sort_order: number };

export default function AdminCategoriesClient() {
  const [items, setItems] = useState<Cat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [sort, setSort] = useState(0);

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/categories", { cache: "no-store" });
      if (!res.ok) throw new Error();
      const j = await res.json();
      setItems(j.items ?? []);
    } catch {
      setError("加载失败");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  async function add() {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, sort_order: sort }),
      });
      if (!res.ok) throw new Error();
      setName("");
      setSlug("");
      setSort(0);
      await load();
    } catch {
      setError("新增失败");
    }
  }

  async function remove(slug: string) {
    if (!confirm(`删除分类 ${slug}?`)) return;
    try {
      const res = await fetch(`/api/admin/categories/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError("删除失败");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">分类管理</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex flex-wrap gap-2 rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <input
          placeholder="名称"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <input
          placeholder="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className="rounded border px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <input
          type="number"
          placeholder="排序"
          value={sort}
          onChange={(e) => setSort(Number(e.target.value))}
          className="w-24 rounded border px-2 py-1 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <button
          type="button"
          onClick={() => void add()}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
        >
          新增
        </button>
      </div>

      <ul className="space-y-2">
        {items.map((c) => (
          <li
            key={c.id}
            className="flex items-center justify-between rounded border border-gray-100 px-3 py-2 dark:border-neutral-800"
          >
            <span>
              {c.name} <span className="text-gray-400">({c.slug})</span> — sort {c.sort_order}
            </span>
            <button type="button" className="text-red-600 text-sm" onClick={() => void remove(c.slug)}>
              删除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
