import { NextResponse } from "next/server";
import {
  createClient,
  logAnonSupabaseEnvPresence,
  MissingSupabaseAnonConfigError,
} from "@/lib/supabase";
import { toPublicTool } from "@/lib/mappers";
import { genericErrorPayload, postgrestErrorPayload } from "@/lib/postgrest-error";
import { listTools } from "@/lib/queries/tools";

export const dynamic = "force-dynamic";

/**
 * GET /api/tools
 * query: q, category, page, pageSize, sort=clicks|name|stars, featured=1
 */
export async function GET(req: Request) {
  try {
    const db = createClient();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? undefined;
    const category = searchParams.get("category") ?? undefined;
    const page = Number(searchParams.get("page") ?? "1");
    const pageSize = Number(searchParams.get("pageSize") ?? "12");
    const sort = (searchParams.get("sort") as "clicks" | "name" | "stars" | null) ?? "clicks";
    const featuredOnly = searchParams.get("featured") === "1";

    const { rows, total } = await listTools(db, {
      q,
      category: category || undefined,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 12,
      sort: sort === "name" || sort === "stars" ? sort : "clicks",
      featuredOnly,
    });

    return NextResponse.json({
      items: rows.map(toPublicTool),
      total,
      page: Number.isFinite(page) ? page : 1,
      pageSize: Number.isFinite(pageSize) ? pageSize : 12,
    });
  } catch (e) {
    console.error("[GET /api/tools]", e);
    logAnonSupabaseEnvPresence("GET /api/tools");
    if (e instanceof MissingSupabaseAnonConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    const pg = postgrestErrorPayload(e);
    const debug = process.env.DEBUG_SUPABASE_API === "1";
    const generic =
      "Failed to load tools from Supabase. Verify URL, API key, network, and that the `tools` table exists (run supabase/migrations/001_init.sql). If tables exist, run supabase/migrations/002_disable_rls_if_blocked.sql when RLS blocks anon access.";
    return NextResponse.json(
      {
        error: pg?.message ?? generic,
        ...(pg ? { supabase: pg } : {}),
        ...(debug && !pg ? { debug: genericErrorPayload(e) } : {}),
      },
      { status: 500 }
    );
  }
}
