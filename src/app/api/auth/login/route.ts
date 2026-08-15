import { NextResponse } from "next/server";
import { findUserByIdentifier } from "@/lib/db";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/sessions";

export async function POST(req: Request) {
  const body = await req.json();
  const identifier = (body.identifier ?? "").trim();

  if (!identifier) {
    return NextResponse.json(
      { error: "Entre ton nom complet ou ton email." },
      { status: 400 },
    );
  }

  const user = await findUserByIdentifier(identifier);

  if (!user) {
    return NextResponse.json(
      { error: "Aucun compte trouvé avec ces infos." },
      { status: 404 },
    );
  }

  const res = NextResponse.json({ ok: true, user });
  res.cookies.set(SESSION_COOKIE, user.id, sessionCookieOptions);
  return res;
}
