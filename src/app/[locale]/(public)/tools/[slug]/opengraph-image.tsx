import { ImageResponse } from "next/og";
import { createClient } from "@/lib/supabase";
import { getToolBySlug } from "@/lib/queries/tools";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  let title = "AI Agent Hub";
  let desc = "";
  try {
    const db = createClient();
    const row = await getToolBySlug(db, slug);
    if (row) {
      title = row.name;
      desc = row.description.slice(0, 120);
    }
  } catch {
    /* ignore */
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 64,
          background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
          color: "white",
          fontFamily: "system-ui,sans-serif",
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 24, fontSize: 28, opacity: 0.9 }}>{desc}</div>
        <div style={{ marginTop: 48, fontSize: 22, opacity: 0.7 }}>aiabw.com</div>
      </div>
    ),
    { ...size }
  );
}
