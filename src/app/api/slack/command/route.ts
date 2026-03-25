import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const text = body.get("text") as string;
  const channel_id = body.get("channel_id") as string;
  const user_id = body.get("user_id") as string;

  // Check if approver has delegation active
  const { data: approver } = await supabase
    .from("users")
    .select("*, delegated:delegated_to_id(slack_user_id, id)")
    .eq("slack_user_id", user_id)
    .single();

  const now = new Date();
  const hasDelegation =
    approver?.delegated_to_id &&
    approver?.delegation_expiry &&
    new Date(approver.delegation_expiry) > now;

  const actualApproverId = hasDelegation
    ? approver.delegated_to_id
    : approver?.id;

  // Save request to DB
  await supabase.from("requests").insert({
    template_type: "purchase",
    title: text,
    status: "pending",
    slack_channel_id: channel_id,
    approver_id: actualApproverId || null,
  });

  const delegationNote = hasDelegation
    ? `\n⚠️ _Delegated to <@${approver?.delegated?.slack_user_id}>_`
    : "";

  return NextResponse.json({
    response_type: "in_channel",
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*New Approval Request*\n*Details:* ${text}\n*Status:* Pending${delegationNote}`,
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