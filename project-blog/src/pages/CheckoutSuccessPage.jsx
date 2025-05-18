import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { validateCheckoutToken } from '../services/tokenService';
import LottieAnimation from '../components/common/Lotties-animation';

const CheckoutSuccessPage = () => {
  const { clearCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState(null);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (!token) {
          // Show error if no token found
          setError('No token found in URL');
          setIsValid(false);
          setIsValidating(false);
          return;
        }

        // Validate token without marking it as used
        const result = await validateCheckoutToken(token, 'success', false);
        console.log('Token validation result:', result);

        if (result.valid) {
          // Mark token as used for future visits
          await validateCheckoutToken(token, 'success', true);
          console.log('Token marked as used for future visits');
          
          setIsValid(true);
          setSessionData(result.session);
          // Clear cart after successful purchase
          clearCart();
          setIsValidating(false);
        } else {
          // If token is not valid for any reason (already used, expired, etc.)
          // redirect to invalid page immediately without rendering this page
          navigate('/checkout/invalid', { replace: true });
          // We don't update state because we'll never render this component
          return;
        }
      } catch (err) {
        console.error('Error validating token:', err);
        // In case of error, we also redirect to invalid page
        navigate('/checkout/invalid', { replace: true });
        return;
      }
    };

    validateToken();
  }, [location.search, clearCart]);

  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center flex flex-col items-center justify-center gap-4 mb-2">
          <LottieAnimation name="PAYMENT_SUCCESS" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Validating...
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Please wait while we validate your purchase.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center flex flex-col items-center justify-center gap-4 mb-2">
          <LottieAnimation name="PAYMENT_CANCEL" />
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-6">
              Validation Error
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {error || 'Could not validate your purchase'}
            </p>
            <div className="mt-8">
              <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline">
                Return to store
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  // We no longer need this condition because we redirect directly to /checkout/invalid

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <LottieAnimation name="PAYMENT_SUCCESS" />
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
            Purchase Successful!
          </h1>
          
          {error ? (
            <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-700 dark:text-yellow-400">
                {error}
              </p>
            </div>
          ) : null}
          
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Thank you for your purchase. We have sent your order details to your email.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            <Link to="/products" className="text-blue-600 dark:text-blue-400 hover:underline">
              Return to store
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
