import { getAllUsers } from "@/lib/db";
import AccountsTable from "./accountsTable";
import styles from "./page.module.css";

export default async function AccountsPage() {
  const users = await getAllUsers();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>Tous les comptes ({users.length})</h1>
      <AccountsTable initialUsers={users} />
    </main>
  );
}
