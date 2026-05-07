"use client";

import { useCallback, useEffect, useState } from "react";

type Tool = Record<string, unknown>;

export default function AdminToolsClient() {
  const [items, setItems] = useState<Tool[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [importText, setImportText] = useState("");

  const load = useCallback(async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/tools?pageSize=100", { cache: "no-store" });
      if (!res.ok) throw new Error("加载失败");
      const j = await res.json();
      setItems(j.items ?? []);
      setTotal(j.total ?? 0);
    } catch (e) {
      console.error(e);
      setError("无法加载工具列表");
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      void load();
    });
  }, [load]);

  async function remove(slug: string) {
    if (!confirm(`删除 ${slug} ?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/tools/${encodeURIComponent(slug)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      await load();
    } catch {
      setError("删除失败");
    } finally {
      setBusy(false);
    }
  }

  async function doImport() {
    setBusy(true);
    setError(null);
    try {
      const parsed = JSON.parse(importText) as { tools?: unknown[] };
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      if (!res.ok) throw new Error(await res.text());
      setImportText("");
      await load();
    } catch (e) {
      console.error(e);
      setError("批量导入失败（请检查 JSON 格式）");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">工具管理</h1>
        <p className="text-sm text-gray-500">共 {total} 条</p>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-2 font-semibold">批量导入 JSON</h2>
        <p className="mb-2 text-xs text-gray-500">
          格式：{`{ "tools": [{ "slug","name","description","url","category","tags",... }] }`}{" "}
          （按 slug upsert）
        </p>
        <textarea
          value={importText}
          onChange={(e) => setImportText(e.target.value)}
          rows={8}
          className="mb-2 w-full rounded border border-gray-200 p-2 font-mono text-xs dark:border-neutral-700 dark:bg-neutral-950"
          placeholder='{"tools":[]}'
        />
        <button
          type="button"
          disabled={busy || !importText.trim()}
          onClick={() => void doImport()}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          导入
        </button>
      </section>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
            <tr>
              <th className="p-2">slug</th>
              <th className="p-2">名称</th>
              <th className="p-2">分类</th>
              <th className="p-2">点击</th>
              <th className="p-2">推荐</th>
              <th className="p-2">置顶</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={String(t.slug)} className="border-b dark:border-neutral-800">
                <td className="p-2 font-mono text-xs">{String(t.slug)}</td>
                <td className="p-2">{String(t.name)}</td>
                <td className="p-2">{String(t.category)}</td>
                <td className="p-2">{String(t.click_count)}</td>
                <td className="p-2">{t.is_featured ? "是" : ""}</td>
                <td className="p-2">{t.is_pinned ? "是" : ""}</td>
                <td className="p-2">
                  <button
                    type="button"
                    className="text-red-600 disabled:opacity-50"
                    disabled={busy}
                    onClick={() => void remove(String(t.slug))}
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
