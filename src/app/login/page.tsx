"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/ui/glassCard";
import GlassInput from "@/components/ui/glassInput";
import GlassButton from "@/components/ui/glassButton";
import styles from "@/styles/auth.module.css";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Entre ton nom complet ou ton email.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Aucun compte trouvé.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className={styles.wrap}>
      <GlassCard className={styles.card} strong>
        <h1 className={styles.title}>nrivizi</h1>
        <p className={styles.subtitle}>
          Connecte-toi avec ton nom complet ou ton email.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <GlassInput
            label="Nom complet ou email"
            placeholder="Nader Bensalem ou toi@email.com"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            error={error}
            autoFocus
          />
          <GlassButton type="submit" disabled={loading}>
            {loading ? "..." : "Se connecter"}
          </GlassButton>
        </form>

        <p className={styles.footerNote}>
          Pas encore de compte ? <Link href="/signup">Crée-en un</Link>
        </p>
      </GlassCard>
    </main>
  );
}
