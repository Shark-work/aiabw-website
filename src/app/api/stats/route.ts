import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/admin-auth";
import {
  createAdminClient,
  logServiceSupabaseEnvPresence,
  MissingSupabaseServiceConfigError,
} from "@/lib/supabase/admin";
import { getStats } from "@/lib/queries/stats";

export const dynamic = "force-dynamic";

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

/** GET /api/stats — 管理看板数据（需登录） */
export async function GET() {
  const ok = await assertAdmin();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const db = createAdminClient();
    const stats = await getStats(db);
    return NextResponse.json(stats);
  } catch (e) {
    console.error(e);
    logServiceSupabaseEnvPresence("GET /api/stats");
    if (e instanceof MissingSupabaseServiceConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
