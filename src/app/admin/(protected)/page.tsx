import { redirect } from "next/navigation";
import GlassCard from "@/components/ui/glassCard";
import { getUserStats } from "@/lib/db";
import { getAdminSession } from "@/lib/adminAuth";
import styles from "./page.module.css";

export default async function AdminDashboardPage() {
  const isAdmin = await getAdminSession();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const stats = await getUserStats();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Dashboard admin</h1>

      <div className={styles.statGrid}>
        <GlassCard className={styles.statCard} strong>
          <div className={styles.statLabel}>Total comptes</div>
          <div className={styles.statValue}>{stats.total}</div>
        </GlassCard>

        <GlassCard className={styles.statCard} strong>
          <div className={styles.statLabel}>Nouveaux (7 jours)</div>
          <div className={styles.statValue}>{stats.last7Days}</div>
        </GlassCard>
      </div>

      <h2 className={styles.subheading}>Répartition par classe</h2>
      <div className={styles.domainGrid}>
        {stats.byClasse.map((row) => (
          <GlassCard key={row.classe} className={styles.domainCard} strong>
            <div className={styles.domainTitle}>{row.classe}</div>
            <div className={styles.domainCount}>{row.count}</div>
          </GlassCard>
        ))}
      </div>

      <h2 className={styles.subheading}>Derniers comptes</h2>
      <GlassCard className={styles.recentCard} strong>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Classe</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent.map((user) => (
                <tr key={user.id}>
                  <td>{user.nom}</td>
                  <td>{user.prenom}</td>
                  <td>{user.classe}</td>
                  <td>{user.email}</td>
                </tr>
              ))}
              {stats.recent.length === 0 && (
                <tr>
                  <td colSpan={4} className={styles.empty}>
                    Aucun compte pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </main>
  );
}
