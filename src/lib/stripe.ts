import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function isMockStripe(): boolean {
  if (process.env.MOCK_STRIPE === "true") {
    return true;
  }
  return !process.env.STRIPE_SECRET_KEY;
}

export function getStripeClient(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error(
      "STRIPE_SECRET_KEY is not configured. Set MOCK_STRIPE=true for local/CI testing."
    );
  }
  if (!stripeInstance) {
    stripeInstance = new Stripe(key);
  }
  return stripeInstance;
}
