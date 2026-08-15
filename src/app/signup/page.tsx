"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import GlassCard from "@/components/ui/glassCard";
import GlassInput from "@/components/ui/glassInput";
import GlassSelect from "@/components/ui/glassSelect";
import GlassButton from "@/components/ui/glassButton";
import { CLASSES } from "@/lib/classes";
import styles from "@/styles/auth.module.css";

export default function SignupPage() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [classe, setClasse] = useState("");
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [duplicateError, setDuplicateError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setDuplicateError("");

    const errors: Record<string, string> = {};
    if (!nom.trim()) errors.nom = "Requis";
    if (!prenom.trim()) errors.prenom = "Requis";
    if (!classe) errors.classe = "Choisis ta classe";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = "Email invalide";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, classe, email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setDuplicateError(data.error ?? "Erreur, réessaie.");
      return;
    }

    router.push("/dashboard?welcome=1");
  }

  return (
    <main className={styles.wrap}>
      <GlassCard className={styles.card} strong>
        <div className={styles.brandWrap}>
          <img src="/logo.svg" alt="Nrivizi" className={styles.brandLogo} />
        </div>
        <p className={styles.subtitle}>
          Nom, prénom, classe, email - rien de plus.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <GlassInput
            label="Nom"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            error={fieldErrors.nom}
            autoFocus
          />
          <GlassInput
            label="Prénom"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            error={fieldErrors.prenom}
          />
          <GlassSelect
            label="Classe"
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            options={CLASSES.map((c) => ({ value: c.value, label: c.label }))}
            placeholder="Choisis ta classe"
            error={fieldErrors.classe}
          />
          <GlassInput
            label="Email"
            type="email"
            placeholder="toi@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldErrors.email}
          />

          {duplicateError && (
            <p className={styles.duplicateError}>
              {duplicateError} <Link href="/login">Se connecter</Link>
            </p>
          )}

          <GlassButton type="submit" disabled={loading}>
            {loading ? "..." : "Créer mon compte"}
          </GlassButton>
        </form>

        <p className={styles.footerNote}>
          Déjà un compte ? <Link href="/login">Connecte-toi</Link>
        </p>
      </GlassCard>
    </main>
  );
}
