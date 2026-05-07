/**
 * 用户收藏（仅客户端持久化）。
 */

export const FAVORITES_STORAGE_KEY = "aiabw-tool-favorites-v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function readFavoriteIds(): string[] {
  if (typeof window === "undefined") return [];
  return safeParse<string[]>(localStorage.getItem(FAVORITES_STORAGE_KEY), []);
}

export function writeFavoriteIds(ids: string[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids));
}
