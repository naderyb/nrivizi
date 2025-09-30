import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const userRes = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = userRes.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // create session token
    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24h

    await pool.query(
      "INSERT INTO sessions (user_id, session_token, expires_at) VALUES ($1, $2, $3)",
      [user.id, sessionToken, expiresAt]
    );

    const res = NextResponse.json({ success: true });
    res.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: expiresAt,
    });

    return res;
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
