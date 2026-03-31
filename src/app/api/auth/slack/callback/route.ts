import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect("https://team-automation.vercel.app?error=no_code");
  }

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

  // Welcome message bhejo
  await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${data.access_token}`,
    },
    body: JSON.stringify({
      channel: data.authed_user?.id || "#general",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `👋 *Welcome to TeamAutomation!*\n\nYour workspace is now connected. Here's how to get started:\n\n*Create an approval request:*\n\`/approve purchase "MacBook Pro" $1200\`\n\n*Delegate approvals when on vacation:*\n\`/approve-delegate @colleague 7d\`\n\nYou have *14 days free* — no credit card needed. Enjoy! 🚀`,
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "button",
              text: { type: "plain_text", text: "View Dashboard" },
              url: "https://team-automation.vercel.app/dashboard",
              style: "primary",
              action_id: "view_dashboard",
            },
          ],
        },
      ],
    }),
  });

  return NextResponse.redirect("https://team-automation.vercel.app/dashboard?installed=true");
}