import { loadStripe } from '@stripe/stripe-js';

// Frontend Stripe instance (uses public key)
export const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Backend Stripe secret key (only for server-side operations)
export const STRIPE_SECRET_KEY = import.meta.env.VITE_STRIPE_SECRET_KEY || '';
