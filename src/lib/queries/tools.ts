import type { ToolRow } from "@/types/database";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ListToolsParams = {
  q?: string;
  category?: string;
  page?: number;
  pageSize?: number;
  sort?: "clicks" | "name" | "stars";
  featuredOnly?: boolean;
};

export async function listTools(
  db: SupabaseClient,
  params: ListToolsParams
): Promise<{ rows: ToolRow[]; total: number }> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 12));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let countQ = db.from("tools").select("*", { count: "exact", head: true });
  if (params.category) countQ = countQ.eq("category", params.category);
  if (params.featuredOnly) countQ = countQ.eq("is_featured", true);
  if (params.q?.trim()) {
    const raw = params.q.trim().replace(/%/g, "").replace(/"/g, "");
    if (raw.length > 0) {
      const pattern = `%${raw}%`;
      countQ = countQ.or(`name.ilike."${pattern}",description.ilike."${pattern}"`);
    }
  }
  const { count, error: countError } = await countQ;
  if (countError) throw countError;

  let dataQ = db.from("tools").select("*");
  if (params.category) dataQ = dataQ.eq("category", params.category);
  if (params.featuredOnly) dataQ = dataQ.eq("is_featured", true);
  if (params.q?.trim()) {
    const raw = params.q.trim().replace(/%/g, "").replace(/"/g, "");
    if (raw.length > 0) {
      const pattern = `%${raw}%`;
      dataQ = dataQ.or(`name.ilike."${pattern}",description.ilike."${pattern}"`);
    }
  }

  const sort = params.sort ?? "clicks";
  if (sort === "name") {
    dataQ = dataQ.order("name", { ascending: true });
  } else if (sort === "stars") {
    dataQ = dataQ.order("stars", { ascending: false });
  } else {
    dataQ = dataQ.order("click_count", { ascending: false });
  }

  dataQ = dataQ
    .order("is_pinned", { ascending: false })
    .order("sort_order", { ascending: true })
    .range(from, to);

  const { data, error } = await dataQ;
  if (error) throw error;
  return { rows: (data ?? []) as ToolRow[], total: count ?? 0 };
}

export async function getToolBySlug(
  db: SupabaseClient,
  slug: string
): Promise<ToolRow | null> {
  const { data, error } = await db
    .from("tools")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data as ToolRow | null) ?? null;
}

export async function getToolById(
  db: SupabaseClient,
  id: string
): Promise<ToolRow | null> {
  const { data, error } = await db
    .from("tools")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data as ToolRow | null) ?? null;
}

/** 累加 click_count 并写入 tool_clicks（用于外跳统计） */
export async function incrementToolClick(
  db: SupabaseClient,
  tool: ToolRow
): Promise<number> {
  const nextCount = (tool.click_count ?? 0) + 1;
  const { error: upErr } = await db
    .from("tools")
    .update({ click_count: nextCount })
    .eq("id", tool.id);
  if (upErr) throw upErr;
  const { error: insErr } = await db.from("tool_clicks").insert({ tool_id: tool.id });
  if (insErr) throw insErr;
  return nextCount;
}
