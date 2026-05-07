import { NextResponse } from "next/server";
import {
  createClient,
  logAnonSupabaseEnvPresence,
  MissingSupabaseAnonConfigError,
} from "@/lib/supabase";
import { listCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const db = createClient();
    const rows = await listCategories(db);
    return NextResponse.json({ items: rows });
  } catch (e) {
    console.error(e);
    logAnonSupabaseEnvPresence("GET /api/categories");
    if (e instanceof MissingSupabaseAnonConfigError) {
      return NextResponse.json({ error: e.message }, { status: 503 });
    }
    return NextResponse.json({ error: "Failed to load categories" }, { status: 500 });
  }
}
