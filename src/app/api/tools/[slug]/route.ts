import { NextResponse } from "next/server";
import {
  createClient,
  logAnonSupabaseEnvPresence,
  MissingSupabaseAnonConfigError,
} from "@/lib/supabase";
import { toPublicTool } from "@/lib/mappers";
import { getToolById, getToolBySlug } from "@/lib/queries/tools";
import { isUuid } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** GET /api/tools/[slug] — slug 或工具 UUID */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await ctx.params;
    const db = createClient();
    const row = isUuid(slug)
      ? await getToolById(db, slug)
      : await getToolBySlug(db, slug);
    if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ tool: toPublicTool(row) });
  } catch (e) {
    console.error(e);
    logAnonSupabaseEnvPresence("GET /api/tools/[slug]");
    if (e instanceof MissingSupabaseAnonConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to load tool" }, { status: 500 });
  }
}
