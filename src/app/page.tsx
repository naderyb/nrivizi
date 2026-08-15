import { redirect } from "next/navigation";
import { getSessionUserId } from "@/lib/sessions";
import { getUserById } from "@/lib/db";

export default async function RootPage() {
  const uid = await getSessionUserId();

  if (uid) {
    const user = await getUserById(uid);
    if (user) redirect("/dashboard");
  }

  redirect("/login");
}
