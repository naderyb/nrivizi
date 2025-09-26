import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pool } from "@/lib/db";
import { sendMaintenanceCompleteEmail } from "@/lib/maintenanceEmail";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    // Only allow admin users to send these notifications
    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all emails from maintenance_notifications table
    const result = await pool.query(
      "SELECT email FROM maintenance_notifications ORDER BY created_at DESC"
    );

    const emails = result.rows.map((row) => row.email);

    if (emails.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No email addresses to notify",
        count: 0,
      });
    }

    // Send emails to all subscribers
    const emailPromises = emails.map((email) =>
      sendMaintenanceCompleteEmail(email).catch((error) => {
        console.error(`Failed to send email to ${email}:`, error);
        return null; // Continue with other emails even if one fails
      })
    );

    await Promise.all(emailPromises);

    // Optional: Clear the maintenance_notifications table after sending
    // await pool.query("DELETE FROM maintenance_notifications");

    return NextResponse.json({
      success: true,
      message: `Maintenance complete notifications sent successfully`,
      count: emails.length,
    });
  } catch (error) {
    console.error("Error sending maintenance complete notifications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
