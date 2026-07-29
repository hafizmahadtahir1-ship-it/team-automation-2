import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function DashboardPage() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
  try {
    cookiesToSet.forEach(({ name, value, options }) => {
      cookieStore.set(name, value, options);
    });
  } catch {
    // Server Component mein cookie set nahi hoti — ignore
  }
},
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }
// Check if this user has a team linked
  let { data: team } = await supabase
    .from("teams")
    .select("id, slack_workspace_id")
    .eq("auth_user_id", user.id)
    .single();

  // Agar team nahi hai, to naya empty team bana do
  if (!team) {
    const { data: newTeam } = await supabase
      .from("teams")
      .insert({
        auth_user_id: user.id,
        plan: "trial",
        slack_workspace_id: `pending_${user.id}`,
        bot_token: "pending"
      })
      .select("id, slack_workspace_id")
      .single();
    team = newTeam;
  }
  const { data: requests } = await supabase
    .from("requests")
    .select("*")
.eq("team_id", team?.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return <DashboardClient requests={requests || []} userId={user!.id} slackConnected={!!team?.slack_workspace_id && !team.slack_workspace_id.startsWith("pending")} />;
}