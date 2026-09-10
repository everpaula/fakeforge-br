import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import AdminDashboard from "./AdminDashboard";

export const metadata = {
  title: "Admin - FakeForge",
  robots: { index: false, follow: false },
};

export default async function Admin() {
  const user = await getUser();
  if (!user) redirect("/login");

  // Server-side admin check
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) redirect("/dashboard");

  const supabase = createClient(url, key);
  const { data: isAdmin } = await supabase
    .from("admins")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!isAdmin) redirect("/dashboard");

  return <AdminDashboard />;
}
