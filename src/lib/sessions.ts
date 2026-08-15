import { cookies } from "next/headers";

export const SESSION_COOKIE = "nrivizi_uid";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: ONE_YEAR_SECONDS,
};

export async function getSessionUserId(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}
