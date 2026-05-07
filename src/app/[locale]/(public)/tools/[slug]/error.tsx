"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ToolSlugError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container mx-auto max-w-lg px-4 py-16 text-center">
      <h2 className="text-xl font-semibold">{t("title")}</h2>
      <button
        type="button"
        onClick={() => reset()}
        className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white"
      >
        {t("retry")}
      </button>
    </div>
  );
}
