import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe outside the component
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
          console.log('Redirecting to Stripe with sessionId:', sessionId);
          
          const stripe = await stripePromise;
          if (!stripe) throw new Error('Could not load Stripe');

          const { error } = await stripe.redirectToCheckout({
            sessionId
          });

          if (error) {
            console.error('Error in redirectToCheckout:', error);
            setStatus('error');
          }
        } catch (err) {
          console.error('Error redirecting to Stripe:', err);
          setStatus('error');
        }
      };

      redirectToCheckout();
    }
  }, [sessionId]);

  if (isLoading || status === 'loading') {
    return (
      <div className="w-full py-6 px-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg text-center">
        <div className="animate-pulse space-y-6">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-4 border-t-4 border-gray-200 dark:border-gray-700 border-t-black dark:border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-700 dark:text-gray-300 font-medium">Redirecting to Stripe payment page...</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Do not close this window. You will be redirected automatically.</p>
        </div>
      </div>
    );
  }

  if (error || status === 'error') {
    return (
      <div className="w-full py-6 px-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-800/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-red-800 dark:text-red-300">Payment Error</h3>
          <p className="text-red-600 dark:text-red-400 text-center">
            {error || 'Error processing payment. Please try again.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default StripeCheckout;
