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

    // Get total users count
    const usersResult = await pool.query("SELECT COUNT(*) FROM users");
    const totalUsers = parseInt(usersResult.rows[0].count);

    // Get pending password recovery requests
    const passwordRecoveryResult = await pool.query(`
      SELECT COUNT(*) FROM password_recovery_requests 
      WHERE created_at > NOW() - INTERVAL '24 hours'
    `);
    const pendingPasswordRecoveries = parseInt(
      passwordRecoveryResult.rows[0].count
    );

    // Calculate user growth (mock for now)
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newUsersResult = await pool.query(
      `
      SELECT COUNT(*) FROM users 
      WHERE created_at > $1
    `,
      [oneMonthAgo]
    );
    const newUsers = parseInt(newUsersResult.rows[0].count);

    // Calculate growth percentage
    const userGrowth =
      totalUsers > 0 ? Math.round((newUsers / totalUsers) * 100) : 0;

    // Recent logins (mock calculation based on user activity)
    const recentLogins = Math.max(0, totalUsers);

    const stats = {
      totalUsers,
      recentLogins,
      pendingPasswordRecoveries,
      userGrowth,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);

    // Return fallback stats if there's an error
    const fallbackStats = {
      totalUsers: 0,
      activeAnnouncements: 0,
      upcomingExams: 0,
      recentLogins: 0,
      pendingPasswordRecoveries: 0,
      userGrowth: 0,
    };

    return NextResponse.json(fallbackStats);
  }
}
