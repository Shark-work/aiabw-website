import { NextResponse } from "next/server";
import {
  createClient,
  logAnonSupabaseEnvPresence,
  MissingSupabaseAnonConfigError,
} from "@/lib/supabase";

export const dynamic = "force-dynamic";

/** POST /api/analytics/visit — 记录一次站点访问（用于看板总访问/今日访问） */
export async function POST(req: Request) {
  try {
    const db = createClient();
    let path: string | null = null;
    try {
      const body = await req.json();
      path = typeof body?.path === "string" ? body.path : null;
    } catch {
      path = null;
    }
    const { error } = await db.from("site_visits").insert({ path });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    logAnonSupabaseEnvPresence("POST /api/analytics/visit");
    if (e instanceof MissingSupabaseAnonConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
