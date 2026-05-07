import { SignJWT, jwtVerify } from "jose";

const COOKIE = "admin_session";

function getSecret() {
  const s = process.env.ADMIN_JWT_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!s) throw new Error("Missing ADMIN_JWT_SECRET or ADMIN_PASSWORD");
  return new TextEncoder().encode(s);
}

export async function createAdminToken(): Promise<string> {
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyAdminToken(token: string): Promise<void> {
  await jwtVerify(token, getSecret());
}

export { COOKIE as ADMIN_SESSION_COOKIE };
