import { ChargilyClient } from "@chargily/chargily-pay";
import { createServerSupabaseClient } from "../../../lib/supabase-server";

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode: "test",
});

export async function POST() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    console.log("[checkout] server-side user:", {
      id: user?.id,
      email: user?.email,
      authError: authError?.message ?? null,
    });

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const product = await client.createProduct({
      name: "Resumind Premium",
    });

    const price = await client.createPrice({
      amount: 200,
      currency: "dzd",
      product_id: product.id,
    });

    const checkout = await client.createCheckout({
      items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: { user_id: user.id, user_email: user.email },
    });

    return Response.json({ checkout_url: checkout.checkout_url });
  } catch (error) {
    console.error("Chargily error:", error);
    return Response.json({ error: "Payment failed" }, { status: 500 });
  }
}