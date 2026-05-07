import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

/** URL 始终无 /en、/zh 前缀；中间件按 Cookie + Accept-Language 解析语言并内部 rewrite 到 `[locale]`。 */
export const routing = defineRouting({
  locales: ["zh", "en"],
  defaultLocale: "zh",
  localePrefix: "never",
  localeCookie: {
    maxAge: 60 * 60 * 24 * 365,
  },
});

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
