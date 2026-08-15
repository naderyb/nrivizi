import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  createAdminToken,
  ADMIN_SESSION_COOKIE,
  adminCookieOptions,
} from "@/lib/adminAuth";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const validUsername = process.env.ADMIN_USERNAME;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!validUsername || !passwordHash) {
    return NextResponse.json(
      { error: "Admin non configuré." },
      { status: 500 },
    );
  }

  if (username !== validUsername) {
    return NextResponse.json(
      { error: "Identifiants invalides." },
      { status: 401 },
    );
  }

  const valid = await bcrypt.compare(password ?? "", passwordHash);
  if (!valid) {
    return NextResponse.json(
      { error: "Identifiants invalides." },
      { status: 401 },
    );
  }

  const token = createAdminToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, adminCookieOptions);
  return res;
}
