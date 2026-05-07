"use client";

import { useEffect, useState } from "react";
import StatsChart from "@/components/StatsChart";

type Stats = {
  totalVisits: number;
  todayVisits: number;
  topTools: { id: string; slug: string; name: string; click_count: number }[];
  clickTrend: { date: string; count: number }[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/stats", { cache: "no-store" });
        if (!res.ok) throw new Error("加载失败");
        setData(await res.json());
      } catch (e) {
        console.error(e);
        setError("无法加载统计数据（请确认已登录且 Supabase 可用）");
      }
    })();
  }, []);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!data) return <p className="text-gray-500">加载中…</p>;

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-gray-500">总访问量</p>
          <p className="text-2xl font-bold">{data.totalVisits}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-gray-500">今日访问</p>
          <p className="text-2xl font-bold">{data.todayVisits}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <p className="text-sm text-gray-500">热门 Top 10</p>
          <p className="text-2xl font-bold">{data.topTools.length}</p>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 font-semibold">近 14 日点击趋势</h2>
        <StatsChart data={data.clickTrend} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        <h2 className="mb-4 font-semibold">热门工具</h2>
        <ol className="list-decimal space-y-1 pl-5 text-sm">
          {data.topTools.map((t) => (
            <li key={t.id}>
              {t.name}{" "}
              <span className="text-gray-500">({t.click_count} 点击)</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
