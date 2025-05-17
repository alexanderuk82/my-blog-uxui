import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Inicializar Stripe fuera del componente
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface StripeCheckoutProps {
  sessionId: string | null;
  isLoading: boolean;
  error: string | null | undefined;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({ sessionId, isLoading, error }) => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'success'>('idle');

  useEffect(() => {
    if (sessionId) {
      const redirectToCheckout = async () => {
        try {
          setStatus('loading');
          const stripe = await stripePromise;
          if (!stripe) throw new Error('Stripe failed to load');

          const { error } = await stripe.redirectToCheckout({
            sessionId
          });

          if (error) {
            console.error('Error in redirectToCheckout:', error);
            setStatus('error');
          }
        } catch (err) {
          console.error('Error:', err);
          setStatus('error');
        }
      };

      redirectToCheckout();
    }
  }, [sessionId]);

  if (isLoading || status === 'loading') {
    return (
      <div className="w-full py-4 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || status === 'error') {
    return (
      <div className="w-full py-4 px-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <p className="text-red-600 dark:text-red-400 text-center">
          {error || 'Error al procesar el pago. Por favor, inténtalo de nuevo.'}
        </p>
      </div>
    );
  }

  return null;
};

export default StripeCheckout;
