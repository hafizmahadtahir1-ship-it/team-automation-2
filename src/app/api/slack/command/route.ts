import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const payload = {
    text: body.get("text") as string,
    user_id: body.get("user_id") as string,
    team_id: body.get("team_id") as string,
    channel_id: body.get("channel_id") as string,
    response_url: body.get("response_url") as string,
  };

  await inngest.send({
    name: "slack/slash.received",
    data: payload,
  });

  return NextResponse.json({
    response_type: "ephemeral",
    text: "Processing your request...",
  });
}