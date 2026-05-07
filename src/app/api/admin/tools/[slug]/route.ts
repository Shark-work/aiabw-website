import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getToolBySlug } from "@/lib/queries/tools";

async function assertAdmin() {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  try {
    await verifyAdminToken(token);
    return true;
  } catch {
    return false;
  }
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const db = createAdminClient();
  const existing = await getToolBySlug(db, slug);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let patch: Record<string, unknown> = {};
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const allowed = [
    "name",
    "description",
    "url",
    "category",
    "tags",
    "is_agent",
    "stars",
    "is_featured",
    "is_pinned",
    "sort_order",
    "logo_url",
    "slug",
  ] as const;
  const update: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in patch) update[k] = patch[k];
  }

  const { data, error } = await db
    .from("tools")
    .update(update)
    .eq("id", existing.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ tool: data });
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { slug } = await ctx.params;
  const db = createAdminClient();
  const existing = await getToolBySlug(db, slug);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { error } = await db.from("tools").delete().eq("id", existing.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
