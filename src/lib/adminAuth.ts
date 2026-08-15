import { cookies } from "next/headers";
import crypto from "crypto";

export const ADMIN_SESSION_COOKIE = "nrivizi_admin_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is not set");
  return secret;
}

function sign(payload: string) {
  return crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

/** Creates a signed, expiring token — no session table required. The
 * cookie itself carries the (tamper-proof) proof of admin login. */
export function createAdminToken(): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `admin.${expires}`;
  const signature = sign(payload);
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [tag, expiresStr, signature] = parts;
  if (tag !== "admin") return false;

  const expected = sign(`${tag}.${expiresStr}`);
  if (!safeEqual(expected, signature)) return false;

  const expires = Number(expiresStr);
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  return true;
}

export async function getAdminSession(): Promise<boolean> {
  const store = await cookies();
  return verifyAdminToken(store.get(ADMIN_SESSION_COOKIE)?.value);
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
};
