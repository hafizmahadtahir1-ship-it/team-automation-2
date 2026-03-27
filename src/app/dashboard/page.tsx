import { supabase } from "@/lib/supabase";
import DashboardClient from "./DashboardClient";

export const revalidate = 0; // Always fresh data

export default async function DashboardPage() {
  const { data: requests } = await supabase
    .from("requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return <DashboardClient requests={requests || []} />;
}