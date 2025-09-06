import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { fullName, email, password } = await req.json();

    if (!fullName || !email || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Basic validations
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }
    if (!email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check for existing email
    const emailCheck = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (emailCheck.rows.length > 0) {
      return NextResponse.json(
        { error: "Cette adresse e-mail est déjà utilisée" },
        { status: 400 }
      );
    }

    // Check for existing full name (since we use it for login)
    const nameCheck = await pool.query(
      "SELECT id FROM users WHERE full_name = $1",
      [fullName]
    );

    if (nameCheck.rows.length > 0) {
      return NextResponse.json(
        {
          error: "Ce nom est déjà utilisé. Veuillez choisir un nom différent.",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    try {
      const query = `
        INSERT INTO users (full_name, email, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, full_name, email;
      `;
      const values = [fullName, email, hashedPassword];
      const { rows } = await pool.query(query, values);

      return NextResponse.json({ user: rows[0] }, { status: 201 });
    } catch (dbErr: unknown) {
      console.error("DB Error:", dbErr);
      return NextResponse.json(
        { error: "Erreur de base de données" },
        { status: 500 }
      );
    }
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
