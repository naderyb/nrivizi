// src/app/api/auth/reset-password/route.ts
import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Le token et le nouveau mot de passe sont requis" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Find and validate token
    const tokenResult = await pool.query(
      `SELECT prt.id, prt.user_id, prt.expires_at, prt.used, u.email, u.full_name
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { error: "Token invalide ou expiré" },
        { status: 400 }
      );
    }

    const resetToken = tokenResult.rows[0];

    // Check if token is expired
    if (new Date() > new Date(resetToken.expires_at)) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation a expiré" },
        { status: 400 }
      );
    }

    // Check if token was already used
    if (resetToken.used) {
      return NextResponse.json(
        { error: "Ce lien de réinitialisation a déjà été utilisé" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Start transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Update user password
      await client.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
        hashedPassword,
        resetToken.user_id,
      ]);

      // Mark token as used
      await client.query(
        "UPDATE password_reset_tokens SET used = TRUE WHERE id = $1",
        [resetToken.id]
      );

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: "Votre mot de passe a été réinitialisé avec succès",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// GET endpoint to verify token validity
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json({ error: "Token requis" }, { status: 400 });
    }

    const tokenResult = await pool.query(
      `SELECT prt.expires_at, prt.used, u.full_name
       FROM password_reset_tokens prt
       JOIN users u ON prt.user_id = u.id
       WHERE prt.token = $1`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return NextResponse.json(
        { valid: false, error: "Token invalide" },
        { status: 400 }
      );
    }

    const resetToken = tokenResult.rows[0];

    if (new Date() > new Date(resetToken.expires_at)) {
      return NextResponse.json(
        { valid: false, error: "Token expiré" },
        { status: 400 }
      );
    }

    if (resetToken.used) {
      return NextResponse.json(
        { valid: false, error: "Token déjà utilisé" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      userFullName: resetToken.full_name,
    });
  } catch (error) {
    console.error("Token validation error:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
