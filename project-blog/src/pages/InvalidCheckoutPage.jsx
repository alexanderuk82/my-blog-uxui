import React from 'react';
import { Link } from 'react-router-dom';
import LottieAnimation from '../components/common/Lotties-animation';

/**
 * Página mostrada cuando se intenta acceder a una redirección de checkout con un token inválido
 * o cuando se intenta acceder directamente sin un token.
 */
const InvalidCheckoutPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="text-center flex flex-col items-center justify-center gap-4 mb-2 w-full">
         <LottieAnimation name="CANCELED_ORDER_INVALID" />
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Invalid Access
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            This page is only accessible after completing a payment process.
            The link you used is invalid or has expired.
          </p>
          <div className="space-y-4 w-full">
            <Link
              to="/products"
              className="block w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity text-center"
            >
              View Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvalidCheckoutPage;
