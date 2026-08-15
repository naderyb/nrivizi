import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export const sql = neon(process.env.DATABASE_URL);

export interface DbUser {
  id: string;
  nom: string;
  prenom: string;
  classe: string;
  email: string;
  createdAt: string;
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function normalizeFullName(nom: string, prenom: string) {
  return `${nom.trim()} ${prenom.trim()}`.toLowerCase().replace(/\s+/g, " ");
}

export class DuplicateAccountError extends Error {}

export async function getUserById(id: string): Promise<DbUser | null> {
  const rows = await sql`
    SELECT id, nom, prenom, classe, email, created_at as "createdAt"
    FROM users WHERE id = ${id} LIMIT 1
  `;
  return (rows[0] as DbUser) ?? null;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const rows = await sql`
    SELECT id, nom, prenom, classe, email, created_at as "createdAt"
    FROM users WHERE lower(trim(email)) = ${normalizeEmail(email)} LIMIT 1
  `;
  return (rows[0] as DbUser) ?? null;
}

export async function getUserByFullName(
  nom: string,
  prenom: string,
): Promise<DbUser | null> {
  const normalized = normalizeFullName(nom, prenom);
  const rows = await sql`
    SELECT id, nom, prenom, classe, email, created_at as "createdAt"
    FROM users
    WHERE lower(trim(nom) || ' ' || trim(prenom)) = ${normalized}
    LIMIT 1
  `;
  return (rows[0] as DbUser) ?? null;
}

/**
 * Login accepts either an email or a full name. If it looks like an email
 * (contains "@"), match by email. Otherwise treat it as "X Y" and try both
 * orders (nom-prenom and prenom-nom) since people type names either way.
 */
export async function findUserByIdentifier(
  identifier: string,
): Promise<DbUser | null> {
  const trimmed = identifier.trim();
  if (!trimmed) return null;

  if (trimmed.includes("@")) {
    return getUserByEmail(trimmed);
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length < 2) return null;

  const first = parts[0];
  const rest = parts.slice(1).join(" ");

  return (
    (await getUserByFullName(first, rest)) ??
    (await getUserByFullName(rest, first))
  );
}

export async function createUser(data: {
  nom: string;
  prenom: string;
  classe: string;
  email: string;
}): Promise<DbUser> {
  try {
    const rows = await sql`
      INSERT INTO users (nom, prenom, classe, email)
      VALUES (${data.nom.trim()}, ${data.prenom.trim()}, ${data.classe}, ${normalizeEmail(data.email)})
      RETURNING id, nom, prenom, classe, email, created_at as "createdAt"
    `;
    return rows[0] as DbUser;
  } catch (err: unknown) {
    const pgErr = err as { code?: string };
    if (pgErr?.code === "23505") {
      throw new DuplicateAccountError(
        "Un compte existe déjà avec ce nom ou cet email. Connecte-toi plutôt.",
      );
    }
    throw err;
  }
}
