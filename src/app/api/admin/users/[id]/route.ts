import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/adminAuth";
import { updateUserAdmin, deleteUser, DuplicateAccountError } from "@/lib/db";
import { CLASSES } from "@/lib/classes";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
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
    const user = await updateUserAdmin(id, { nom, prenom, classe, email });
    return NextResponse.json({ ok: true, user });
  } catch (err) {
    if (err instanceof DuplicateAccountError) {
      return NextResponse.json({ error: err.message }, { status: 409 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  const { id } = await params;
  await deleteUser(id);
  return NextResponse.json({ ok: true });
}
