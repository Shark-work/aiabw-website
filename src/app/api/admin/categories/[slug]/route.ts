import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

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
  const { data: existing, error: findErr } = await db
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (findErr) return NextResponse.json({ error: findErr.message }, { status: 400 });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let patch: Record<string, unknown> = {};
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const update: Record<string, unknown> = {};
  if ("name" in patch) update.name = patch.name;
  if ("sort_order" in patch) update.sort_order = patch.sort_order;
  if ("slug" in patch) update.slug = patch.slug;

  const { data, error } = await db
    .from("categories")
    .update(update)
    .eq("id", existing.id)
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ category: data });
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
  const { error } = await db.from("categories").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
