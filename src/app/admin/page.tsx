import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Admin - FakeForge BR",
  robots: { index: false, follow: false },
};

export default async function Admin() {
  const user = await getUser();
  if (!user) redirect("/login");

  return <AdminDashboard />;
}
