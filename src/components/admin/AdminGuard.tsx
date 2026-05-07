import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { ADMIN_SESSION_COOKIE, verifyAdminToken } from "@/lib/admin-auth";

/**
 * 服务端组件：未登录或 JWT 无效时重定向到 /admin/login
 */
export default async function AdminGuard({ children }: { children: ReactNode }) {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) redirect("/admin/login");
  try {
    await verifyAdminToken(token);
  } catch {
    redirect("/admin/login");
  }
  return <>{children}</>;
}
