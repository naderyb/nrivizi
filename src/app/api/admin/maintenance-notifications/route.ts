import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pool } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      "SELECT email, created_at FROM maintenance_notifications ORDER BY created_at DESC"
    );

    return NextResponse.json({
      emails: result.rows.map((row) => row.email),
      subscribers: result.rows,
    });
  } catch (error) {
    console.error("Error fetching maintenance subscribers:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
