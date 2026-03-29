import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { createHmac, timingSafeEqual } from "crypto";

async function verifySlackSignature(timestamp: string, signature: string, body: string): Promise<boolean> {
  const signingSecret = process.env.SLACK_SIGNING_SECRET!;
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - parseInt(timestamp)) > 300) return false;

  const sigBaseString = `v0:${timestamp}:${body}`;
  const mySignature = "v0=" + createHmac("sha256", signingSecret)
    .update(sigBaseString)
    .digest("hex");

  try {
    return timingSafeEqual(Buffer.from(mySignature), Buffer.from(signature));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const timestamp = req.headers.get("x-slack-request-timestamp") || "";
  const signature = req.headers.get("x-slack-signature") || "";

  const isValid = await verifySlackSignature(timestamp, signature, rawBody);
  if (!isValid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = new URLSearchParams(rawBody);
  const text = body.get("text") as string;
  const channel_id = body.get("channel_id") as string;
  const user_id = body.get("user_id") as string;

  // User save karo
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("slack_user_id", user_id)
    .single();

  if (!existingUser) {
    await supabase.from("users").insert({
      slack_user_id: user_id,
    });
  }

  // Request save karo
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