"use client";

import { useState, FormEvent } from "react";
import GlassCard from "@/components/ui/glassCard";
import GlassInput from "@/components/ui/glassInput";
import GlassSelect from "@/components/ui/glassSelect";
import GlassButton from "@/components/ui/glassButton";
import { CLASSES } from "@/lib/classes";
import type { DbUser } from "@/lib/db";
import styles from "./editUser.module.css";

export default function EditUserModal({
  user,
  onClose,
  onSaved,
}: {
  user: DbUser;
  onClose: () => void;
  onSaved: (user: DbUser) => void;
}) {
  const [nom, setNom] = useState(user.nom);
  const [prenom, setPrenom] = useState(user.prenom);
  const [classe, setClasse] = useState(user.classe);
  const [email, setEmail] = useState(user.email);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, prenom, classe, email }),
    });
    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Erreur, réessaie.");
      return;
    }

    onSaved(data.user);
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <GlassCard className={styles.modal} strong>
          <h2 className={styles.title}>Modifier le compte</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <GlassInput
              label="Nom"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
            />
            <GlassInput
              label="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <GlassSelect
              label="Classe"
              value={classe}
              onChange={(e) => setClasse(e.target.value)}
              options={CLASSES.map((c) => ({ value: c.value, label: c.label }))}
            />
            <GlassInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.buttonRow}>
              <GlassButton type="button" variant="ghost" onClick={onClose}>
                Annuler
              </GlassButton>
              <GlassButton type="submit" disabled={loading}>
                {loading ? "..." : "Enregistrer"}
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
