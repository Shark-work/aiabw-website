import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { listTools } from "@/lib/queries/tools";

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

/** GET — 管理端列表（大分页） */
export async function GET(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") ?? "1");
  const pageSize = Number(searchParams.get("pageSize") ?? "50");
  const db = createAdminClient();
  const { rows, total } = await listTools(db, { page, pageSize, sort: "clicks" });
  return NextResponse.json({ items: rows, total, page, pageSize });
}

type CreateBody = {
  slug: string;
  name: string;
  description: string;
  url: string;
  category: string;
  tags?: string[];
  is_agent?: boolean;
  stars?: number;
  is_featured?: boolean;
  is_pinned?: boolean;
  sort_order?: number;
  logo_url?: string | null;
};

/** POST — 新增工具 */
export async function POST(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: CreateBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.slug || !body.name || !body.description || !body.url || !body.category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const db = createAdminClient();
  const { data, error } = await db
    .from("tools")
    .insert({
      slug: body.slug,
      name: body.name,
      description: body.description,
      url: body.url,
      category: body.category,
      tags: body.tags ?? [],
      is_agent: body.is_agent ?? false,
      stars: body.stars ?? 0,
      is_featured: body.is_featured ?? false,
      is_pinned: body.is_pinned ?? false,
      sort_order: body.sort_order ?? 0,
      logo_url: body.logo_url ?? null,
    })
    .select("*")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ tool: data });
}
