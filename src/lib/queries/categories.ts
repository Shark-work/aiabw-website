import type { CategoryRow } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function listCategories(db: SupabaseClient): Promise<CategoryRow[]> {
  const { data, error } = await db
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CategoryRow[];
}
