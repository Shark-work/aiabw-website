"use client";

import { useCallback, useEffect, useState } from "react";
import { readFavoriteIds, writeFavoriteIds } from "@/lib/tool-storage";

/**
 * 仅客户端收藏（与 Supabase click_count 分离）。
 */
export function useToolLocalState() {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setFavoriteIds(readFavoriteIds());
      setReady(true);
    });
  }, []);

  const isFavorite = useCallback(
    (id: string) => favoriteIds.includes(id),
    [favoriteIds]
  );

  const toggleFavorite = useCallback((id: string) => {
    setFavoriteIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      writeFavoriteIds(next);
      return next;
    });
  }, []);

  return {
    ready,
    isFavorite,
    toggleFavorite,
    favoriteIds,
  };
}
