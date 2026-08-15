import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Fait avec ❤️ par des étudiants, pour des étudiants.
      </p>
    </footer>
  );
}
