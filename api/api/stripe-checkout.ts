import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({
        error: "Missing priceId",
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url:
        "https://moricanvas-ai.vercel.app/success",

      cancel_url:
        "https://moricanvas-ai.vercel.app/cancel",
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      error: err.message,
    });
  }
}
