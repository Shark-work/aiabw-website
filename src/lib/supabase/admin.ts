import {
  createClient as createSupabaseJsClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/** 管理端 / 需绕过 RLS 的写操作：缺少 service role 配置 */
export class MissingSupabaseServiceConfigError extends Error {
  constructor() {
    super(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add both for admin and privileged server routes."
    );
    this.name = "MissingSupabaseServiceConfigError";
  }
}

export function logServiceSupabaseEnvPresence(route: string) {
  console.info(
    `[supabase:${route}] NEXT_PUBLIC_SUPABASE_URL set:`,
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim())
  );
  console.info(
    `[supabase:${route}] SUPABASE_SERVICE_ROLE_KEY set:`,
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
  );
}

/**
 * 服务端专用：使用 service role，仅能在 Route Handler / Server Action 中调用。
 * 请求头显式携带 `apikey` 与 `Authorization`，避免 REST 层漏传密钥。
 */
export function createAdminClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) {
    logServiceSupabaseEnvPresence("createAdminClient()");
    throw new MissingSupabaseServiceConfigError();
  }
  return createSupabaseJsClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
