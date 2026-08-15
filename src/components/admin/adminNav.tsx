import Link from "next/link";
import AdminLogoutButton from "./adminLogoutButton";
import styles from "./adminNav.module.css";

import Image from "next/image";

export default function AdminNav() {
  return (
    <div className={styles.navWrap}>
      <nav className={styles.nav}>
        <Link href="/admin" className={styles.logo} aria-label="Accueil admin">
          <Image src="/logo.svg" alt="Nrivizi" width={180} height={38} className={styles.logoImage} />
          <span className={styles.adminLabel}>admin</span>
        </Link>
        <div className={styles.links}>
          <Link href="/admin" className={styles.link}>
            Dashboard
          </Link>
          <Link href="/admin/accounts" className={styles.link}>
            Comptes
          </Link>
          <AdminLogoutButton />
        </div>
      </nav>
    </div>
  );
}
