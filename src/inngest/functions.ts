import { inngest } from "./client";
import { supabase } from "@/lib/supabase";

export const processApproval = inngest.createFunction(
  {
    id: "process-approval",
    triggers: [{ event: "slack/slash.received" }],
  },
  async ({ event, step }: any) => {
    const { text, user_id, team_id, channel_id, response_url } = event.data;

    // Step 1: Request save karo
    await step.run("save-request", async () => {
      await supabase.from("requests").insert({
        template_type: "purchase",
        title: text,
        status: "pending",
        slack_channel_id: channel_id,
      });
    });

    // Step 2: Slack card post karo
    await step.run("post-slack-card", async () => {
      await fetch(response_url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response_type: "in_channel",
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: `*New Approval Request*\n*Details:* ${text}\n*Status:* Pending`,
              },
            },
            {
              type: "actions",
              elements: [
                {
                  type: "button",
                  text: { type: "plain_text", text: "Approve" },
                  style: "primary",
                  action_id: "approve",
                },
                {
                  type: "button",
                  text: { type: "plain_text", text: "Reject" },
                  style: "danger",
                  action_id: "reject",
                },
              ],
            },
          ],
        }),
      });
    });
  }
);