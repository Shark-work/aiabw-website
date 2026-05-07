import { useMemo } from "react";

export type SearchableTool = {
  name: string;
  description: string;
};

/**
 * 按名称与描述子串匹配（不区分大小写）。
 */
export function useSearch<T extends SearchableTool>(items: T[], query: string): T[] {
  return useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q)
    );
  }, [items, query]);
}
