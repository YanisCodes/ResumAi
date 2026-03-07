import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function POST(request) {
  try {
    const body = await request.json();
    
    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Type:", body.type);
    console.log("Full body:", JSON.stringify(body, null, 2));

    if (body.type === "checkout.paid") {
      const userId = body.metadata?.user_id;
      console.log("User ID from metadata:", userId);
      
      if (userId) {
        const { error } = await supabase
          .from("profiles")
          .update({ is_premium: true })
          .eq("id", userId);
        
        if (error) console.error("Supabase update error:", error);
        else console.log("✅ User upgraded to premium:", userId);
      } else {
        console.log("❌ No user_id in metadata");
      }
    } else {
      console.log("Event type not handled:", body.type);
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return Response.json({ error: "Webhook failed" }, { status: 500 });
  }
}