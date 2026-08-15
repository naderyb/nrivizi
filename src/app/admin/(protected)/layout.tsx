import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/adminNav";
import { getAdminSession } from "@/lib/adminAuth";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await getAdminSession();

  if (!isAdmin) {
    redirect("/admin/login");
  }

  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
