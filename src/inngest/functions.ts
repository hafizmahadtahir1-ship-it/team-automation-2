import { inngest } from "./client";
import { supabase } from "@/lib/supabase";

// ─── 1. Process Approval ───────────────────────
export const processApproval = inngest.createFunction(
  {
    id: "process-approval",
    triggers: [{ event: "slack/slash.received" }],
  },
  async ({ event, step }: any) => {
    console.log("Processing approval:", event.data);
  }
);

// ─── 2. Smart Nudge ───────────────────────
export const smartNudge = inngest.createFunction(
  {
    id: "smart-nudge",
    triggers: [{ cron: "0 */24 * * *" }],
  },
  async ({ step }: any) => {
    const { data: pendingRequests } = await step.run(
      "fetch-pending",
      async () => {
        const cutoff = new Date(
          Date.now() - 24 * 60 * 60 * 1000
        ).toISOString();
        return await supabase
          .from("requests")
          .select("*")
          .eq("status", "pending")
          .lt("created_at", cutoff);
      }
    );

    if (!pendingRequests?.data?.length) return;

    for (const request of pendingRequests.data) {
      await step.run(`nudge-${request.id}`, async () => {
        const team = await supabase
          .from("teams")
          .select("bot_token")
          .eq("id", request.team_id)
          .single();

        if (!team.data?.bot_token) return;

        await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${team.data.bot_token}`,
          },
          body: JSON.stringify({
            channel: request.slack_channel_id,
            text: `⏰ *Reminder:* Approval request *"${request.title}"* is pending 24+ hours.`,
          }),
        });
      });
    }
  }
);

// ─── 3. Daily Digest ─────────────────────────
export const dailyDigest = inngest.createFunction(
  {
    id: "daily-digest",
    triggers: [{ cron: "0 9 * * *" }],
  },
  async ({ step }: any) => {
    const { data: teams } = await step.run("fetch-teams", async () => {
      return await supabase.from("teams").select("*");
    });

    if (!teams?.data?.length) return;

    for (const team of teams.data) {
      await step.run(`digest-${team.id}`, async () => {
        const { count } = await supabase
          .from("requests")
          .select("*", { count: "exact", head: true })
          .eq("team_id", team.id)
          .eq("status", "pending");

        if (!count || count === 0) return;

        await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${team.bot_token}`,
          },
          body: JSON.stringify({
            channel: "#general",
            text: `📋 *Daily Digest:* You have *${count} pending approval${count > 1 ? "s" : ""}* today.`,
          }),
        });
      });
    }
  }
);
// ─── 4. Day 12 Trial Nudge ─────────────────────────
export const trialNudge = inngest.createFunction(
  {
    id: "trial-nudge",
    triggers: [{ cron: "0 9 * * *" }],
  },
  async ({ step }: any) => {
    const { data: teams } = await step.run("fetch-trial-teams", async () => {
      const day12 = new Date();
      day12.setDate(day12.getDate() - 12);
      const day13 = new Date();
      day13.setDate(day13.getDate() - 11);

      return await supabase
        .from("teams")
        .select("*")
        .eq("subscription_status", "trialing")
        .gte("created_at", day12.toISOString())
        .lt("created_at", day13.toISOString());
    });

    if (!teams?.data?.length) return;

    for (const team of teams.data) {
      await step.run(`nudge-trial-${team.id}`, async () => {
        await fetch("https://slack.com/api/chat.postMessage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${team.bot_token}`,
          },
          body: JSON.stringify({
            channel: "#general",
            blocks: [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `⏰ *Your TeamAutomation trial ends in 2 days!*\n\nUpgrade now for just *$49/mo*.\n\n👉 <https://team-automation.vercel.app/dashboard|Upgrade Now>`,
                },
              },
            ],
          }),
        });
      });
    }
  }
);