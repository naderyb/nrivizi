"use client";

import { useState } from "react";
import GlassCard from "@/components/ui/glassCard";
import GlassButton from "@/components/ui/glassButton";
import EditUserModal from "./editUser";
import type { DbUser } from "@/lib/db";
import styles from "./accountsTable.module.css";

export default function AccountsTable({
  initialUsers,
}: {
  initialUsers: DbUser[];
}) {
  const [users, setUsers] = useState(initialUsers);
  const [editing, setEditing] = useState<DbUser | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<DbUser | null>(null);

  async function handleDelete(user: DbUser) {
    setPendingDelete(user);
  }

  async function confirmDelete() {
    if (!pendingDelete) return;

    setDeletingId(pendingDelete.id);
    const res = await fetch(`/api/admin/users/${pendingDelete.id}`, {
      method: "DELETE",
    });
    setDeletingId(null);
    setPendingDelete(null);

    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== pendingDelete.id));
    } else {
      alert("Erreur lors de la suppression.");
    }
  }

  function handleUpdated(updated: DbUser) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditing(null);
  }

  return (
    <>
      <GlassCard className={styles.tableCard} strong>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Classe</th>
                <th>Email</th>
                <th>Inscrit le</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>{u.nom}</td>
                  <td>{u.prenom}</td>
                  <td>{u.classe}</td>
                  <td>{u.email}</td>
                  <td>{new Date(u.createdAt).toLocaleDateString("fr-FR")}</td>
                  <td className={styles.actions}>
                    <GlassButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setEditing(u)}
                    >
                      Modifier
                    </GlassButton>
                    <GlassButton
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(u)}
                      disabled={deletingId === u.id}
                    >
                      {deletingId === u.id ? "..." : "Supprimer"}
                    </GlassButton>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className={styles.empty}>
                    Aucun compte pour le moment.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {pendingDelete && (
        <div
          className={styles.confirmOverlay}
          onClick={() => setPendingDelete(null)}
        >
          <GlassCard
            className={styles.confirmModal}
            strong
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className={styles.confirmTitle}>Supprimer ce compte ?</h3>
            <p className={styles.confirmText}>
              Tu es sur le point de supprimer définitivement le compte de{" "}
              {pendingDelete.prenom} {pendingDelete.nom}. Cette action est
              irréversible.
            </p>
            <div className={styles.confirmActions}>
              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => setPendingDelete(null)}
              >
                Annuler
              </GlassButton>
              <GlassButton
                variant="secondary"
                size="sm"
                onClick={confirmDelete}
                disabled={deletingId === pendingDelete.id}
              >
                {deletingId === pendingDelete.id ? "..." : "Confirmer"}
              </GlassButton>
            </div>
          </GlassCard>
        </div>
      )}

      {editing && (
        <EditUserModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={handleUpdated}
        />
      )}
    </>
  );
}
