import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("https://team-automation.vercel.app?error=no_code");
  }

  // Exchange code for token
  const response = await fetch("https://slack.com/api/oauth.v2.access", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code,
      redirect_uri: "https://team-automation.vercel.app/api/auth/slack/callback",
    }),
  });

  const data = await response.json();

  if (!data.ok) {
    return NextResponse.redirect("https://team-automation.vercel.app?error=oauth_failed");
  }

  // Save team to DB
  await supabase.from("teams").upsert({
    slack_workspace_id: data.team.id,
    bot_token: data.access_token,
    slack_access_token: data.access_token,
    plan: "free",
    subscription_status: "trialing",
  }, {
    onConflict: "slack_workspace_id",
  });

  // Redirect to dashboard
  return NextResponse.redirect("https://team-automation.vercel.app/dashboard?installed=true");
}