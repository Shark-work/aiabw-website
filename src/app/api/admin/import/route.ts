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

type ImportTool = {
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

/** POST /api/admin/import — body: { tools: ImportTool[] } */
export async function POST(req: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { tools?: ImportTool[] };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!Array.isArray(body.tools) || body.tools.length === 0) {
    return NextResponse.json({ error: "tools[] required" }, { status: 400 });
  }

  const db = createAdminClient();
  const rows = body.tools.map((t) => ({
    slug: t.slug,
    name: t.name,
    description: t.description,
    url: t.url,
    category: t.category,
    tags: t.tags ?? [],
    is_agent: t.is_agent ?? false,
    stars: t.stars ?? 0,
    is_featured: t.is_featured ?? false,
    is_pinned: t.is_pinned ?? false,
    sort_order: t.sort_order ?? 0,
    logo_url: t.logo_url ?? null,
  }));

  const { data, error } = await db.from("tools").upsert(rows, { onConflict: "slug" }).select("slug");
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, imported: data?.length ?? 0 });
}
