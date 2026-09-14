import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import VcDashboard from "./VcDashboard";

export const metadata = {
  title: "VC Dashboard - FakeForge",
  robots: { index: false, follow: false },
};

export default async function VcAdminPage() {
  const user = await getUser();
  if (!user) redirect("/login");

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

  return <VcDashboard />;
}
