import type { SupabaseClient } from "@supabase/supabase-js";

function startOfUtcDay(d = new Date()) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x.toISOString();
}

export async function getStats(db: SupabaseClient) {
  const today = startOfUtcDay();

  const [{ count: totalVisits }, { count: todayVisits }, topRes, clicksRes] =
    await Promise.all([
      db.from("site_visits").select("*", { count: "exact", head: true }),
      db
        .from("site_visits")
        .select("*", { count: "exact", head: true })
        .gte("created_at", today),
      db
        .from("tools")
        .select("id, slug, name, click_count")
        .order("click_count", { ascending: false })
        .limit(10),
      db
        .from("tool_clicks")
        .select("created_at")
        .gte("created_at", new Date(Date.now() - 14 * 864e5).toISOString()),
    ]);

  const clicksByDay = new Map<string, number>();
  for (const row of clicksRes.data ?? []) {
    const d = new Date((row as { created_at: string }).created_at);
    const key = d.toISOString().slice(0, 10);
    clicksByDay.set(key, (clicksByDay.get(key) ?? 0) + 1);
  }
  const chart = [...clicksByDay.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  return {
    totalVisits: totalVisits ?? 0,
    todayVisits: todayVisits ?? 0,
    topTools: topRes.data ?? [],
    clickTrend: chart,
  };
}
