import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const SITE_URL = "https://moricanvas-ai.vercel.app";

const plans: Record<
  string,
  {
    priceId?: string;
    mode: "payment" | "subscription";
  }
> = {
  starter: {
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    mode: "payment",
  },
  creator: {
    priceId: process.env.STRIPE_CREATOR_PRICE_ID,
    mode: "payment",
  },
  pro: {
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    mode: "payment",
  },
  lite_monthly: {
    priceId: process.env.STRIPE_LITE_MONTHLY_PRICE_ID,
    mode: "subscription",
  },
  creator_monthly: {
    priceId: process.env.STRIPE_CREATOR_MONTHLY_PRICE_ID,
    mode: "subscription",
  },
  studio_monthly: {
    priceId: process.env.STRIPE_STUDIO_MONTHLY_PRICE_ID,
    mode: "subscription",
  },
};

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { plan, userId, email } = req.body;

    if (!plan || !plans[plan]) {
      return res.status(400).json({
        error: "Invalid plan",
      });
    }

    const selectedPlan = plans[plan];

    if (!selectedPlan.priceId) {
      return res.status(500).json({
        error: "Missing Stripe Price ID",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: selectedPlan.mode,
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || "",
        plan,
      },
      success_url: `${SITE_URL}?payment=success&plan=${plan}`,
      cancel_url: `${SITE_URL}?payment=cancel`,
    });

    return res.status(200).json({
      url: session.url,
    });
  } catch (error: any) {
    return res.status(500).json({
      error: error.message || "Stripe checkout failed",
    });
  }
}
