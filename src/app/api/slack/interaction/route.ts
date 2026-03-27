import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const payload = JSON.parse(formData.get("payload") as string);

  const action = payload.actions?.[0]?.action_id;
  const responseUrl = payload.response_url;

  const status = action === "approve" ? "approved" : "rejected";
  const emoji = action === "approve" ? "✅" : "❌";

  // Get latest pending request
  const { data: request } = await supabase
    .from("requests")
    .select("id")
    .eq("status", "pending")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (request?.id) {
    await supabase
      .from("requests")
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq("id", request.id);

    await supabase.from("audit_logs").insert({
      request_id: request.id,
      action: status,
    });
  }

  await fetch(responseUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      replace_original: true,
      text: `${emoji} Request has been *${status}*`,
    }),
  });

  return NextResponse.json({ ok: true });
}