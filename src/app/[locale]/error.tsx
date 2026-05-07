"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function LocaleError({ error, reset }: Props) {
  const t = useTranslations("errors");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto max-w-lg px-4 py-16 text-center">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
        {t("title")}
      </h2>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        {t("retry")}
      </button>
    </div>
  );
}
