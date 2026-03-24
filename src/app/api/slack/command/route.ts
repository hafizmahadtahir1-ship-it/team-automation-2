import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const text = body.get("text") as string;

  return NextResponse.json({
    response_type: "in_channel",
    text: `📝 Approval Request:\n${text}`,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `📝 *Approval Request:*\n${text}`,
        },
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Approve ✅",
            },
            style: "primary",
            action_id: "approve",
          },
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Reject ❌",
            },
            style: "danger",
            action_id: "reject",
          },
        ],
      },
    ],
  });
}