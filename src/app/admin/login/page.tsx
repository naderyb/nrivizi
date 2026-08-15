"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import GlassCard from "@/components/ui/glassCard";
import GlassInput from "@/components/ui/glassInput";
import GlassButton from "@/components/ui/glassButton";
import styles from "@/styles/auth.module.css";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erreur de connexion.");
      return;
    }

    router.push("/admin");
  }

  return (
    <main className={styles.wrap}>
      <GlassCard className={styles.card} strong>
        <div className={styles.brandWrap}>
          <img src="/logo.svg" alt="Nrivizi" className={styles.brandLogo} />
          <span className={styles.brandAdminLabel}>admin</span>
        </div>
        <p className={styles.subtitle}>Accès réservé au Nexus Club.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <GlassInput
            label="Identifiant"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <GlassInput
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className={styles.duplicateError}>{error}</p>}
          <GlassButton type="submit" disabled={loading}>
            {loading ? "..." : "Se connecter"}
          </GlassButton>
        </form>
      </GlassCard>
    </main>
  );
}
