// src/app/api/auth/session-check/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const sessionCookie = req.headers
      .get("cookie")
      ?.split(";")
      .find((c) => c.trim().startsWith("session="))
      ?.split("=")[1];

    if (!sessionCookie) {
      return NextResponse.json({
        authenticated: false,
        error: "No session cookie",
      });
    }

    const result = await pool.query(
      `SELECT s.*, u.full_name, u.email, u.role 
       FROM sessions s 
       JOIN users u ON s.user_id = u.id 
       WHERE s.session_token = $1 AND s.expires_at > NOW()`,
      [sessionCookie]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({
        authenticated: false,
        error: "Invalid or expired session",
      });
    }

    const session = result.rows[0];
    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.user_id,
        name: session.full_name,
        email: session.email,
        role: session.role,
      },
      session: {
        token: session.session_token,
        expires: session.expires_at,
        created: session.created_at,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'An unknown error occurred' }, { status: 500 });
  }
}
