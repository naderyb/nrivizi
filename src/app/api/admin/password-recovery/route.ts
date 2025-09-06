import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pool } from "@/lib/db";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(`
      SELECT 
        pr.id, 
        u.full_name, 
        u.email, 
        pr.requested_at, 
        pr.status, 
        pr.admin_notes
      FROM password_recovery_requests pr
      JOIN users u ON pr.user_id = u.id
      ORDER BY pr.requested_at DESC
    `);

    return NextResponse.json({ requests: result.rows });
  } catch (error) {
    console.error("Error fetching password recovery requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestId, action, newPassword, adminNotes } = await req.json();

    if (!requestId || !action) {
      return NextResponse.json(
        { error: "Request ID and action are required" },
        { status: 400 }
      );
    }

    if (action === "approve" && !newPassword) {
      return NextResponse.json(
        { error: "New password is required for approval" },
        { status: 400 }
      );
    }

    // Start transaction
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      if (action === "approve") {
        // Get user ID from request
        const requestResult = await client.query(
          "SELECT user_id FROM password_recovery_requests WHERE id = $1",
          [requestId]
        );

        if (requestResult.rows.length === 0) {
          throw new Error("Request not found");
        }

        const userId = requestResult.rows[0].user_id;

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update user password
        await client.query(
          "UPDATE users SET password_hash = $1 WHERE id = $2",
          [hashedPassword, userId]
        );

        // Update request status
        await client.query(
          "UPDATE password_recovery_requests SET status = 'resolved', admin_notes = $1, resolved_at = NOW() WHERE id = $2",
          [adminNotes || "Password reset by admin", requestId]
        );
      } else if (action === "reject") {
        // Update request status to rejected
        await client.query(
          "UPDATE password_recovery_requests SET status = 'rejected', admin_notes = $1, resolved_at = NOW() WHERE id = $2",
          [adminNotes || "Request rejected by admin", requestId]
        );
      }

      await client.query("COMMIT");

      return NextResponse.json({
        success: true,
        message: `Request ${action}d successfully`,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error handling password recovery request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const { email, fullName } = await req.json();

    if (!email || !fullName) {
      return NextResponse.json(
        { error: "Email and full name are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    const userResult = await pool.query(
      "SELECT id FROM users WHERE email = $1 AND full_name = $2",
      [email, fullName]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json(
        { error: "No user found with this email and name combination" },
        { status: 404 }
      );
    }

    const userId = userResult.rows[0].id;

    // Check if there's already a pending request
    const existingRequest = await pool.query(
      "SELECT id FROM password_recovery_requests WHERE user_id = $1 AND status = 'pending'",
      [userId]
    );

    if (existingRequest.rows.length > 0) {
      return NextResponse.json(
        {
          error: "A password recovery request is already pending for this user",
        },
        { status: 400 }
      );
    }

    // Create new recovery request
    await pool.query(
      "INSERT INTO password_recovery_requests (user_id, requested_at, status) VALUES ($1, NOW(), 'pending')",
      [userId]
    );

    return NextResponse.json({
      success: true,
      message: "Password recovery request submitted successfully",
    });
  } catch (error) {
    console.error("Error creating password recovery request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
