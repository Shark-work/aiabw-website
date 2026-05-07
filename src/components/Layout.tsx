"use client";

import type { ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import LanguageSwitcher from "./LanguageSwitcher";
import VisitTracker from "./VisitTracker";

export type SiteLayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: SiteLayoutProps) {
  const tNav = useTranslations("nav");
  const tLayout = useTranslations("layout");
  const year = new Date().getFullYear();
  const brand = tLayout("siteName");

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-neutral-950">
      <VisitTracker />
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/90">
        <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-50"
          >
            {tLayout("siteName")}
          </Link>
          <div className="flex flex-1 flex-wrap items-center justify-end gap-4 sm:justify-end">
            <nav className="flex items-center gap-5 text-sm font-medium">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
              >
                {tNav("home")}
              </Link>
              <Link
                href="/tools"
                className="text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
              >
                {tNav("tools")}
              </Link>
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-gray-200 bg-white py-8 text-center dark:border-neutral-800 dark:bg-neutral-950">
        <div className="container mx-auto px-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {tLayout("copyright", { year, brand })}
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            {tLayout("footerNote")}
          </p>
        </div>
      </footer>
    </div>
  );
}
