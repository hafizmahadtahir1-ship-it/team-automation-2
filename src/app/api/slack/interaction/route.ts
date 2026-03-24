import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const payload = JSON.parse(body.get("payload") as string);

  console.log("Interaction payload:", payload);

  const action = payload.actions?.[0]?.action_id;

  let responseText = "Unknown action";

  if (action === "approve") {
    responseText = "Request approved ✅";
  }

  if (action === "reject") {
    responseText = "Request rejected ❌";
  }

  return NextResponse.json({
    response_type: "ephemeral",
    text: responseText,
  });
}