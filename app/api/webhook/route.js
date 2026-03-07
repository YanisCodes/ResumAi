import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.type === "checkout.paid") {
      const userId = body.metadata?.user_id;
      if (userId) {
        await supabase
          .from("profiles")
          .update({ is_premium: true })
          .eq("id", userId);
      }
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 500 });
  }
}