import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/navigation";
import Layout from "@/components/Layout";
import HtmlLang from "@/components/HtmlLang";
import KoFiWidget from "@/components/KoFiWidget";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "metadata",
  });
  const title = t("title");
  const description = t("description");
  return {
    title: { default: title, template: `%s · ${title}` },
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const kofi = await getTranslations({ locale: locale as Locale, namespace: "kofi" });

  return (
    <NextIntlClientProvider messages={messages}>
      <HtmlLang />
      <Layout>{children}</Layout>
      <KoFiWidget donateButtonText={kofi("donateButtonText")} />
    </NextIntlClientProvider>
  );
}
