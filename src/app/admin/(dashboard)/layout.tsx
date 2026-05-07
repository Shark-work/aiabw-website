import type { ReactNode } from "react";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950">
        <AdminNav />
        <div className="container mx-auto px-4 py-8">{children}</div>
      </div>
    </AdminGuard>
  );
}
