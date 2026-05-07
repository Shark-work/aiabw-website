import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { Link } from "@/navigation";
import PopularTools from "@/components/PopularTools";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale: locale as Locale, namespace: "home" });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-950">
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl dark:text-gray-50">
          {t("title")}
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-600 md:text-2xl dark:text-gray-300">
          {t("subtitle")}
        </p>
        <Link
          href="/tools"
          className="inline-block transform rounded-lg bg-blue-600 px-8 py-3 text-lg text-white transition hover:scale-105 hover:bg-blue-700"
        >
          {t("cta")}
        </Link>
      </div>
      <PopularTools />
    </div>
  );
}
