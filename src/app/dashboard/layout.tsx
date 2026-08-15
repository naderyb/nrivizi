import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/sessions";
import { getUserById } from "@/lib/db";
import Navbar from "@/components/layout/navbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const uid = await getSessionUserId();
  if (!uid) redirect("/login");

  const user = await getUserById(uid);
  if (!user) redirect("/login");

  return (
    <>
      <Navbar prenom={user.prenom} nom={user.nom} classe={user.classe} />
      {children}
    </>
  );
}
