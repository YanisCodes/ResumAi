import { ChargilyClient } from "@chargily/chargily-pay";

const client = new ChargilyClient({
  api_key: process.env.CHARGILY_API_KEY,
  mode: "test",
});

export async function POST(request) {
  try {
    const { userEmail, userId } = await request.json();

    // Create product first
    const product = await client.createProduct({
      name: "Resumind Premium",
    });

    // Create price for that product
    const price = await client.createPrice({
      amount: 200,
      currency: "dzd",
      product_id: product.id,
    });

    // Create checkout
    const checkout = await client.createCheckout({
      items: [{ price: price.id, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
      failure_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      metadata: { user_id: userId, user_email: userEmail },
    });

    return Response.json({ checkout_url: checkout.checkout_url });
  } catch (error) {
    console.error("Chargily error:", error);
    return Response.json({ error: "Payment failed" }, { status: 500 });
  }
}