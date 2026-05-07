"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "看板" },
  { href: "/admin/tools", label: "工具" },
  { href: "/admin/categories", label: "分类" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <div className="border-b bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <span className="font-semibold text-gray-900 dark:text-gray-50">AIABW 管理</span>
        <nav className="flex flex-wrap gap-4 text-sm font-medium">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={
                pathname === l.href
                  ? "text-blue-600"
                  : "text-gray-600 hover:text-blue-600 dark:text-gray-300"
              }
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          className="text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
          onClick={async () => {
            await fetch("/api/admin/logout", { method: "POST" });
            window.location.href = "/admin/login";
          }}
        >
          退出
        </button>
      </div>
    </div>
  );
}
