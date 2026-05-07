type PostgrestPayload = {
  code?: string;
  message: string;
  details?: string;
  hint?: string;
};

export function postgrestErrorPayload(e: unknown): PostgrestPayload | null {
  if (!e || typeof e !== "object") return null;
  const o = e as Record<string, unknown>;
  const message = o.message;
  if (typeof message !== "string" || message.length === 0) return null;

  const code = typeof o.code === "string" ? o.code : undefined;
  const details = typeof o.details === "string" ? o.details : undefined;
  const hint = typeof o.hint === "string" ? o.hint : undefined;

  if (o.name === "PostgrestError") {
    return { code, message, details, hint };
  }

  // PostgREST 错误码、或带 details/hint 的 API 错误体
  // PostgREST: PGRST…；PostgreSQL REST 层常见 SQLSTATE 为 5 位（如 42P01）
  if (
    typeof code === "string" &&
    (code.startsWith("PGRST") || /^[0-9]{2}[0-9A-Z]{3}$/.test(code))
  ) {
    return { code, message, details, hint };
  }

  return null;
}

/** 非 PostgREST 的 Error，用于在 DEBUG 下回传 */
export function genericErrorPayload(e: unknown): { name: string; message: string } | null {
  if (e instanceof Error) {
    return { name: e.name, message: e.message };
  }
  return null;
}
