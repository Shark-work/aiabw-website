"use client";

import { useLocale, useTranslations } from "next-intl";
import { useCallback } from "react";
import { usePathname, useRouter } from "@/navigation";

const PREFERRED_LOCALE_KEY = "preferred-locale";

type AppLocale = "zh" | "en";

export default function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("nav");

  const applyLocale = useCallback(
    (next: AppLocale) => {
      if (next === locale) return;
      try {
        localStorage.setItem(PREFERRED_LOCALE_KEY, next);
      } catch {
        /* ignore */
      }
      router.replace(pathname, { locale: next });
    },
    [locale, pathname, router]
  );

  const baseBtn =
    "rounded px-2.5 py-1 text-xs font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500";
  const active = "bg-blue-600 text-white shadow-sm";
  const idle =
    "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800";

  return (
    <div
      className="flex gap-0.5 rounded-md border border-gray-200 bg-white/60 p-0.5 dark:border-neutral-700 dark:bg-neutral-900/60"
      role="group"
      aria-label={t("languageGroup")}
    >
      <button
        type="button"
        onClick={() => applyLocale("zh")}
        className={`${baseBtn} ${locale === "zh" ? active : idle}`}
        aria-pressed={locale === "zh"}
      >
        {t("langZh")}
      </button>
      <button
        type="button"
        onClick={() => applyLocale("en")}
        className={`${baseBtn} ${locale === "en" ? active : idle}`}
        aria-pressed={locale === "en"}
      >
        {t("langEn")}
      </button>
    </div>
  );
}
