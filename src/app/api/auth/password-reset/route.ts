// src/app/api/auth/password-reset/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import crypto from "crypto";
import { sendPasswordResetEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "L'adresse email est requise" },
        { status: 400 }
      );
    }

    // Check if user exists with this email
    const userResult = await pool.query(
      "SELECT id, full_name, email FROM users WHERE email = $1",
      [email]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not for security
      return NextResponse.json({
        success: true,
        message:
          "Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.",
      });
    }

    const user = userResult.rows[0];

    // Generate secure token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now

    // Delete any existing tokens for this user
    await pool.query("DELETE FROM password_reset_tokens WHERE user_id = $1", [
      user.id,
    ]);

    // Create new reset token
    await pool.query(
      "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)",
      [user.id, token, expiresAt]
    );

    // Send email
    const emailResult = await sendPasswordResetEmail(
      user.email,
      token,
      user.full_name
    );

    if (!emailResult.success) {
      return NextResponse.json(
        { error: "Erreur lors de l'envoi de l'email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Si cette adresse email existe dans notre système, vous recevrez un lien de réinitialisation.",
    });
  } catch (error) {
    console.error("Password reset request error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
