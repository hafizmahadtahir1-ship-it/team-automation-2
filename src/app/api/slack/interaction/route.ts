import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const payload = JSON.parse(formData.get("payload") as string);

  const action = payload.actions?.[0]?.action_id;
  const responseUrl = payload.response_url;

  let text = "Unknown action";

  if (action === "approve") {
    text = "Request approved ✅";
  }

  if (action === "reject") {
    text = "Request rejected ❌";
  }

  // Update original Slack message
  await fetch(responseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      replace_original: true,
      text,
    }),
  });

  return NextResponse.json({ ok: true });
}