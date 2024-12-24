import { loadStripe } from "@stripe/stripe-js";
const stripePublicKey = process.env.REACT_APP_STRIPE_PUBLIC_KEY;
if (!stripePublicKey) {
  throw new Error(
    "Stripe public key is not defined in the environment variables."
  );
}

const stripePromise = loadStripe(stripePublicKey);

export default stripePromise;
