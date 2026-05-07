import { NextResponse } from "next/server";
import {
  createClient,
  logAnonSupabaseEnvPresence,
  MissingSupabaseAnonConfigError,
} from "@/lib/supabase";
import { getToolById, getToolBySlug, incrementToolClick } from "@/lib/queries/tools";
import { isUuid } from "@/lib/utils";

export const dynamic = "force-dynamic";

/**
 * POST /api/tools/[slug]/click — slug 或 UUID；增加 click_count 并写入 tool_clicks
 */
export async function POST(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;
    const db = createClient();
    const tool = isUuid(slug)
      ? await getToolById(db, slug)
      : await getToolBySlug(db, slug);
    if (!tool) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const nextCount = await incrementToolClick(db, tool);
    return NextResponse.json({ ok: true, clickCount: nextCount });
  } catch (e) {
    console.error(e);
    logAnonSupabaseEnvPresence("POST /api/tools/[slug]/click");
    if (e instanceof MissingSupabaseAnonConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to record click" }, { status: 500 });
  }
}
