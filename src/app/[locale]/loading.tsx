"use client";

import { useTranslations } from "next-intl";

export default function LocaleLoading() {
  const t = useTranslations("loading");

  return (
    <div className="container mx-auto px-4 py-24 text-center text-gray-600 dark:text-gray-300">
      <p className="text-sm font-medium">{t("message")}</p>
    </div>
  );
}
