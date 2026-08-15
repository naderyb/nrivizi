import { NextResponse } from "next/server";
import { createUser, DuplicateAccountError } from "@/lib/db";
import { SESSION_COOKIE, sessionCookieOptions } from "@/lib/sessions";
import { CLASSES } from "@/lib/classes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  const body = await req.json();
  const nom = (body.nom ?? "").trim();
  const prenom = (body.prenom ?? "").trim();
  const classe = (body.classe ?? "").trim().toUpperCase();
  const email = (body.email ?? "").trim();

  if (!nom || !prenom) {
    return NextResponse.json(
      { error: "Nom et prénom requis." },
      { status: 400 },
    );
  }
  if (!CLASSES.some((c) => c.value === classe)) {
    return NextResponse.json({ error: "Classe invalide." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email invalide." }, { status: 400 });
  }

  try {
    const user = await createUser({ nom, prenom, classe, email });
    const res = NextResponse.json({ ok: true, user });
    res.cookies.set(SESSION_COOKIE, user.id, sessionCookieOptions);
    return res;
  } catch (err) {
    if (err instanceof DuplicateAccountError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Erreur serveur, réessaie." },
      { status: 500 },
    );
  }
}
