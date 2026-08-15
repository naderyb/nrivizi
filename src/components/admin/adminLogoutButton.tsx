"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import GlassButton from "@/components/ui/glassButton";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
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
