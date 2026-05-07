import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import ToolsExplorer from "@/components/ToolsExplorer";
import { createClient } from "@/lib/supabase";
import { listCategories } from "@/lib/queries/categories";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "tools",
  });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale: locale as Locale, namespace: "tools" });

  let categoryOptions: { key: string; label: string }[] = [];
  try {
    const db = createClient();
    const cats = await listCategories(db);
    categoryOptions = cats.map((c) => ({ key: c.slug, label: c.name }));
  } catch {
    categoryOptions = [
      { key: "dev", label: t("categories.dev" as never) },
      { key: "site-builder", label: t("categories.siteBuilder" as never) },
      { key: "agent", label: t("categories.agent" as never) },
    ];
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
      <header className="border-b bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900 dark:text-gray-50">
            {t("title")}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">{t("subtitle")}</p>
        </div>
      </header>
      <ToolsExplorer initialCategoryOptions={categoryOptions} />
    </div>
  );
}
