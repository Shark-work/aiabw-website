import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase";

const defaultUrl = "https://aiabw.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? defaultUrl;
  const staticPaths = ["", "/tools"];

  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${base.replace(/\/$/, "")}${p || "/"}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  try {
    const db = createClient();
    const { data } = await db.from("tools").select("slug, updated_at");
    for (const row of data ?? []) {
      const slug = (row as { slug: string }).slug;
      const lastModified = new Date((row as { updated_at?: string }).updated_at ?? Date.now());
      entries.push({
        url: `${base.replace(/\/$/, "")}/tools/${slug}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  } catch {
    /* Supabase 未配置时仅输出静态路径 */
  }

  return entries;
}
