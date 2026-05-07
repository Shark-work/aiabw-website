"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type StatsChartProps = {
  data: { date: string; count: number }[];
};

/** 管理后台：近 14 日点击趋势（简单折线） */
export default function StatsChart({ data }: StatsChartProps) {
  if (!data.length) {
    return (
      <p className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-neutral-800 dark:text-gray-400">
        暂无趋势数据
      </p>
    );
  }
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis allowDecimals={false} width={32} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Line type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
