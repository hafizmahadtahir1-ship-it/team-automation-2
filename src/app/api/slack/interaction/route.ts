import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const payload = formData.get("payload") as string;

  if (!payload) {
    return NextResponse.json({ error: "No payload" }, { status: 400 });
  }

  const data = JSON.parse(payload);

  const action = data.actions?.[0]?.action_id;

  let text = "Unknown action";

  if (action === "approve") {
    text = "Request approved ✅";
  }

  if (action === "reject") {
    text = "Request rejected ❌";
  }

  return NextResponse.json({
    response_type: "ephemeral",
    replace_original: false,
    text,
  });
}