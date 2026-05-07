import { useMemo } from "react";

export type Categorized = { categoryKey: string };

/**
 * 按分类筛选；`all` 表示不过滤。
 */
export function useCategoryFilter<T extends Categorized>(
  items: T[],
  category: "all" | string
): T[] {
  return useMemo(() => {
    if (category === "all") return items;
    return items.filter((item) => item.categoryKey === category);
  }, [items, category]);
}
