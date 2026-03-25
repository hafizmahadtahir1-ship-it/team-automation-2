import { inngest } from "./client";
import { supabase } from "@/lib/supabase";

// ─── 1. Process Approval (existing) ───────────────────────
export const processApproval = inngest.createFunction(
  {
    id: "process-approval",
    triggers: [{ event: "slack/slash.received" }],
  },
  async ({ event, step }: any) => {
    console.log("Processing approval:", event.data);
  }
);

// ─── 2. Smart Nudge (24hr reminder) ───────────────────────
export const smartNudge = inngest.createFunction(
  { id: "smart-nudge" },
  { cron: "0 */24 * * *" }, // Every 24 hours
  async ({ step }: any) => {
    // Fetch all pending requests older than 24 hours
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

    // Send nudge for each pending request
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
            text: `⏰ *Reminder:* Approval request *"${request.title}"* is still pending for 24+ hours. Please take action.`,
          }),
        });
      });
    }
  }
);

// ─── 3. Daily Digest (Every morning 9 AM) ─────────────────
export const dailyDigest = inngest.createFunction(
  { id: "daily-digest" },
  { cron: "0 9 * * *" }, // Every day at 9 AM UTC
  async ({ step }: any) => {
    // Fetch all teams
    const { data: teams } = await step.run("fetch-teams", async () => {
      return await supabase.from("teams").select("*");
    });

    if (!teams?.data?.length) return;

    for (const team of teams.data) {
      await step.run(`digest-${team.id}`, async () => {
        // Count pending requests for this team
        const { count } = await supabase
          .from("requests")
          .select("*", { count: "exact", head: true })
          .eq("team_id", team.id)
          .eq("status", "pending");

        if (!count || count === 0) return;

        // Send digest to team
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
                  text: `📋 *Good Morning! Daily Approval Digest*\n\nYou have *${count} pending approval${count > 1 ? "s" : ""}* waiting for action today.\n\nUse \`/approve\` to create new requests.`,
                },
              },
            ],
          }),
        });
      });
    }
  }
);