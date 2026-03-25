import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const text = body.get("text") as string;
  const channel_id = body.get("channel_id") as string;

  // Direct DB insert
  await supabase.from("requests").insert({
    template_type: "purchase",
    title: text,
    status: "pending",
    slack_channel_id: channel_id,
  });

  return NextResponse.json({
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
  });
}