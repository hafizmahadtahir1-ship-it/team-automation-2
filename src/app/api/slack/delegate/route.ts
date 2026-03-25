import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const text = body.get("text") as string; // e.g. "@john 7d"
  const slack_user_id = body.get("user_id") as string;
  const team_id = body.get("team_id") as string;

  // Parse: "@john 7d"
  const parts = text.trim().split(" ");
  const mentionRaw = parts[0]; // @john or <@U123456>
  const durationStr = parts[1] || "7d"; // 7d

  // Extract user ID from Slack mention format <@U123456>
  const delegateSlackId = mentionRaw.replace(/[<@>]/g, "").split("|")[0];

  // Parse duration (7d = 7 days)
  const days = parseInt(durationStr.replace("d", "")) || 7;
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);

  // Find delegator user in DB
  const { data: delegator } = await supabase
    .from("users")
    .select("id")
    .eq("slack_user_id", slack_user_id)
    .single();

  // Find delegate user in DB
  const { data: delegate } = await supabase
    .from("users")
    .select("id")
    .eq("slack_user_id", delegateSlackId)
    .single();

  if (!delegator?.id || !delegate?.id) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "❌ User not found. Make sure both users have used the app before.",
    });
  }

  // Update delegator record
  await supabase
    .from("users")
    .update({
      delegated_to_id: delegate.id,
      delegation_expiry: expiry.toISOString(),
    })
    .eq("id", delegator.id);

  return NextResponse.json({
    response_type: "ephemeral",
    text: `✅ Done! All your approvals will be delegated to <@${delegateSlackId}> for ${days} days (until ${expiry.toDateString()}).`,
  });
}