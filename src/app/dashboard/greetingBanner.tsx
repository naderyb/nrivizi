"use client";

import { useEffect, useState } from "react";
import GlassCard from "@/components/ui/glassCard";
import styles from "./greetingBanner.module.css";

export default function GreetingBanner({
  prenom,
  isNew,
}: {
  prenom: string;
  isNew: boolean;
}) {
  const [showToast, setShowToast] = useState(isNew);

  useEffect(() => {
    if (!isNew) return;
    const t = setTimeout(() => setShowToast(false), 4000);
    return () => clearTimeout(t);
  }, [isNew]);

  return (
    <>
      {showToast && (
        <div className={styles.toast}>
          <GlassCard className={styles.toastCard} accent="info" strong>
            Bienvenue, {prenom} ! 🎉
          </GlassCard>
        </div>
      )}
      <h1 className={styles.heading}>
        {isNew ? `Hey ${prenom} ` : `Hey ${prenom}, content de te revoir `}
      </h1>
    </>
  );
}
