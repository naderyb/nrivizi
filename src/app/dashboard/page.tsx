import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/sessions";
import { getUserById } from "@/lib/db";
import GreetingBanner from "./greetingBanner";
import DomainGrid from "@/app/dashboard/domainGrid";
import styles from "./page.module.css";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ welcome?: string }>;
}) {
  const uid = await getSessionUserId();
  if (!uid) redirect("/login");

  const user = await getUserById(uid);
  if (!user) redirect("/login");

  const { welcome } = await searchParams;
  const isNew = welcome === "1";

  return (
    <main className={styles.main}>
      <GreetingBanner prenom={user.prenom} isNew={isNew} />

      <section className={styles.domainSection}>
        <p className={styles.sectionLabel}></p>
        <DomainGrid userClasse={user.classe} />
      </section>
    </main>
  );
}
