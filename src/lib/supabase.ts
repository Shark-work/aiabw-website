import {
  createClient as createSupabaseJsClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

/** 公开/服务端读取场景：无任何可用密钥 */
export class MissingSupabaseAnonConfigError extends Error {
  constructor() {
    super(
      "Missing Supabase API key for server reads. Set one of: NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_ANON_KEY, or (fallback) SUPABASE_SERVICE_ROLE_KEY — plus NEXT_PUBLIC_SUPABASE_URL."
    );
    this.name = "MissingSupabaseAnonConfigError";
  }
}

/**
 * 解析服务端读库用的密钥（不打印具体值）。
 * 顺序：公开 anon → 仅服务端 anon → service role（与仅配 service 的旧环境兼容）。
 */
function resolveServerReadKey(): { key: string; source: "anon" | "service_fallback" } {
  const anon =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.SUPABASE_ANON_KEY?.trim();
  if (anon) return { key: anon, source: "anon" };
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (service) {
    console.warn(
      "[supabase:createClient] 未配置 NEXT_PUBLIC_SUPABASE_ANON_KEY / SUPABASE_ANON_KEY，暂用 SUPABASE_SERVICE_ROLE_KEY 访问数据库。生产环境请改为 anon key。"
    );
    return { key: service, source: "service_fallback" };
  }
  throw new MissingSupabaseAnonConfigError();
}

/** 仅记录变量是否已配置，不输出密钥内容 */
export function logAnonSupabaseEnvPresence(route: string) {
  const url = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim());
  const anonPub = Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim());
  const anonSrv = Boolean(process.env.SUPABASE_ANON_KEY?.trim());
  const service = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim());
  console.info(`[supabase:${route}] NEXT_PUBLIC_SUPABASE_URL set:`, url);
  console.info(`[supabase:${route}] NEXT_PUBLIC_SUPABASE_ANON_KEY set:`, anonPub);
  console.info(`[supabase:${route}] SUPABASE_ANON_KEY set:`, anonSrv);
  console.info(`[supabase:${route}] SUPABASE_SERVICE_ROLE_KEY set (fallback):`, service);
}

/**
 * 服务端公开 API / SSR 读取用。
 * 使用 @supabase/supabase-js 默认 fetch，自动附带 `apikey` 与 `Authorization`。
 */
export function createClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!url) {
    logAnonSupabaseEnvPresence("createClient()");
    throw new MissingSupabaseAnonConfigError();
  }
  const { key } = resolveServerReadKey();
  return createSupabaseJsClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
