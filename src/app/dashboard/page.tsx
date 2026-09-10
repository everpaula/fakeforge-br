import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import PageShell from "@/components/PageShell";
import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard - FakeForge",
};

export default async function Dashboard() {
  const user = await getUser();
  if (!user) redirect("/login");

  return (
    <PageShell>
      <DashboardClient userId={user.id} userEmail={user.email || ""} />
    </PageShell>
  );
}
