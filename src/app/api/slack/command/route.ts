import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.formData();

  const command = body.get("command");
  const text = body.get("text");

  console.log("Slack Command:", command);
  console.log("Text:", text);

  return NextResponse.json({
    response_type: "ephemeral",
    text: "Command received successfully ✅",
  });
}