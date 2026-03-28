import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.formData();
  const text = body.get("text") as string;
  const slack_user_id = body.get("user_id") as string;

  // Parse duration
  const parts = text.trim().split(" ");
  const durationStr = parts[parts.length - 1];
  const days = parseInt(durationStr.replace("d", "")) || 7;

  // Extract delegate slack ID — handle both <@U123> and plain U123
  const mentionMatch = text.match(/<@([A-Z0-9]+)/);
  const plainMatch = text.match(/\b(U[A-Z0-9]{8,})\b/);
  const delegateSlackId = mentionMatch?.[1] || plainMatch?.[1];

  if (!delegateSlackId) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "❌ Could not find user. Try: /approve-delegate @username 7d",
    });
  }

  const expiry = new Date();
  expiry.setDate(expiry.getDate() + days);

  // Find delegator
  const { data: delegator } = await supabase
    .from("users")
    .select("id")
    .eq("slack_user_id", slack_user_id)
    .single();

  // Find or create delegate user
  let { data: delegate } = await supabase
    .from("users")
    .select("id")
    .eq("slack_user_id", delegateSlackId)
    .single();

  if (!delegate) {
    const { data: newUser } = await supabase
      .from("users")
      .insert({ slack_user_id: delegateSlackId })
      .select("id")
      .single();
    delegate = newUser;
  }

  if (!delegator?.id || !delegate?.id) {
    return NextResponse.json({
      response_type: "ephemeral",
      text: "❌ Something went wrong. Please try again.",
    });
  }

  await supabase
    .from("users")
    .update({
      delegated_to_id: delegate.id,
      delegation_expiry: expiry.toISOString(),
    })
    .eq("id", delegator.id);

  return NextResponse.json({
    response_type: "ephemeral",
    text: `✅ Done! Approvals delegated for ${days} days (until ${expiry.toDateString()}).`,
  });
}