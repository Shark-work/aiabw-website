import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import ToolDetailBody from "@/components/ToolDetailBody";
import ToolJsonLd from "@/components/ToolJsonLd";
import { createClient } from "@/lib/supabase";
import { toPublicTool } from "@/lib/mappers";
import { getToolBySlug } from "@/lib/queries/tools";
import type { ToolRow } from "@/types/database";
import { listCategories } from "@/lib/queries/categories";
import { routing } from "@/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const db = createClient();
    const { data } = await db.from("tools").select("slug");
    const slugs = (data ?? []).map((r: { slug: string }) => r.slug);
    return routing.locales.flatMap((locale) =>
      slugs.map((slug) => ({ locale, slug }))
    );
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const tMeta = await getTranslations({
    locale: locale as Locale,
    namespace: "metadata",
  });
  try {
    const db = createClient();
    const row = await getToolBySlug(db, slug);
    if (!row) return { title: "Not Found" };
    return {
      title: `${row.name} | ${tMeta("title")}`,
      description: row.description,
      openGraph: {
        title: row.name,
        description: row.description,
        type: "article",
      },
    };
  } catch {
    return { title: tMeta("title") };
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  let categoryLabel = slug;
  let row: ToolRow;
  try {
    const db = createClient();
    const found = await getToolBySlug(db, slug);
    if (!found) notFound();
    row = found;
    const cats = await listCategories(db);
    categoryLabel = cats.find((c) => c.slug === row.category)?.name ?? row.category;
  } catch {
    notFound();
  }

  const publicTool = toPublicTool(row);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aiabw.com";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <ToolJsonLd tool={publicTool} siteUrl={siteUrl} />
      <ToolDetailBody tool={publicTool} categoryLabel={categoryLabel} />
    </div>
  );
}
