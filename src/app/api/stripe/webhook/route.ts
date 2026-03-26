import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";


export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // Handle events
  switch (event.type) {
    case "customer.subscription.created":
    case "customer.subscription.updated": {
      const sub = event.data.object as any;
      const team_id = sub.metadata?.team_id;

      await supabase
        .from("teams")
        .update({
          stripe_subscription_id: sub.id,
          subscription_status: sub.status,
        })
        .eq("id", team_id);
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as any;
      const team_id = sub.metadata?.team_id;

      await supabase
        .from("teams")
        .update({ subscription_status: "canceled" })
        .eq("id", team_id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}