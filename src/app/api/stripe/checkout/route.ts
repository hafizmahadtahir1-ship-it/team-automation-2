import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { team_id, slack_workspace_id } = await req.json();

  // Get or create Stripe customer
  const { data: team } = await supabase
    .from("teams")
    .select("*")
    .eq("id", team_id)
    .single();

  let customerId = team?.stripe_customer_id;

  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { team_id, slack_workspace_id },
    });
    customerId = customer.id;

    await supabase
      .from("teams")
      .update({ stripe_customer_id: customerId })
      .eq("id", team_id);
  }

  // Create checkout session
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `https://team-automation.vercel.app/dashboard?success=true`,
    cancel_url: `https://team-automation.vercel.app/dashboard?canceled=true`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { team_id },
    },
  });

  return NextResponse.json({ url: session.url });
}