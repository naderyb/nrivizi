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
    const errorCode = (err as { code?: string })?.code;
    if (errorCode === "23505") {
      throw new DuplicateAccountError(
        "Un compte existe déjà avec ce nom ou cet email. Connecte-toi plutôt.",
      );
    }
    throw err;
  }
}

/* ------------------------------------------------------------------ */
/* Admin-only functions                                                */
/* ------------------------------------------------------------------ */

export async function getAllUsers(): Promise<DbUser[]> {
  const rows = await sql`
    SELECT id, nom, prenom, classe, email, created_at as "createdAt"
    FROM users
    ORDER BY created_at DESC
  `;
  return rows as DbUser[];
}

export interface UserStats {
  total: number;
  byClasse: { classe: string; count: number }[];
  last7Days: number;
  recent: DbUser[];
}

export async function getUserStats(): Promise<UserStats> {
  const totalRows = await sql`SELECT count(*)::int as count FROM users`;
  const byClasseRows = await sql`
    SELECT classe, count(*)::int as count FROM users GROUP BY classe ORDER BY classe
  `;
  const last7Rows = await sql`
    SELECT count(*)::int as count FROM users WHERE created_at >= now() - interval '7 days'
  `;
  const recentRows = await sql`
    SELECT id, nom, prenom, classe, email, created_at as "createdAt"
    FROM users ORDER BY created_at DESC LIMIT 5
  `;

  return {
    total: totalRows[0]?.count ?? 0,
    byClasse: byClasseRows as { classe: string; count: number }[],
    last7Days: last7Rows[0]?.count ?? 0,
    recent: recentRows as DbUser[],
  };
}

export async function updateUserAdmin(
  id: string,
  data: { nom: string; prenom: string; classe: string; email: string },
): Promise<DbUser> {
  try {
    const rows = await sql`
      UPDATE users
      SET nom = ${data.nom.trim()},
          prenom = ${data.prenom.trim()},
          classe = ${data.classe},
          email = ${normalizeEmail(data.email)}
      WHERE id = ${id}
      RETURNING id, nom, prenom, classe, email, created_at as "createdAt"
    `;
    if (!rows[0]) throw new Error("User not found");
    return rows[0] as DbUser;
  } catch (err: unknown) {
    const errorCode = (err as { code?: string })?.code;
    if (errorCode === "23505") {
      throw new DuplicateAccountError(
        "Un autre compte utilise déjà ce nom ou cet email.",
      );
    }
    throw err;
  }
}

/** Hard delete — permanently removes the row, per your call. */
export async function deleteUser(id: string): Promise<void> {
  await sql`DELETE FROM users WHERE id = ${id}`;
}
