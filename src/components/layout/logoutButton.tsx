"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GlassButton from "@/components/ui/glassButton";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <GlassButton
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      disabled={loading}
    >
      {loading ? "..." : "Déconnexion"}
    </GlassButton>
  );
}
