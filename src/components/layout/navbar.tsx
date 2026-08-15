import Link from "next/link";
import Badge from "@/components/ui/badge";
import LogoutButton from "./logoutButton";
import { getClasseInfo, Dept } from "@/lib/classes";
import styles from "./navbar.module.css";

interface NavbarProps {
  prenom: string;
  nom: string;
  classe: string;
}

export default function Navbar({ prenom, nom, classe }: NavbarProps) {
  const classeInfo = getClasseInfo(classe);
  const dept: Dept | undefined = classeInfo?.dept;
  const initials = `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();

  return (
    <div className={styles.navWrap}>
      <nav className={styles.nav}>
        <Link href="/dashboard" className={styles.logo}>
          nrivizi
        </Link>
        <div className={styles.right}>
          {classeInfo && <Badge variant={dept}>{classeInfo.value}</Badge>}
          <div className={styles.identity}>
            <div
              className={[styles.avatar, dept ? styles[dept] : ""].join(" ")}
            >
              {initials}
            </div>
            <span className={styles.name}>{prenom}</span>
          </div>
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
}
