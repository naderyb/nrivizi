import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { sendMaintenanceNotificationEmail } from "@/lib/maintenanceEmail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Store email in maintenance_notifications table
    await pool.query(
      `INSERT INTO maintenance_notifications (email, created_at) 
       VALUES ($1, NOW()) 
       ON CONFLICT (email) DO UPDATE SET created_at = NOW()`,
      [email]
    );

    // Send notification email
    try {
      await sendMaintenanceNotificationEmail(email);
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error storing maintenance notification email:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
