import React from 'react';
import { Link } from 'react-router-dom';

const CheckoutCancelPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Compra Cancelada
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Has cancelado el proceso de compra. Tu carrito se mantiene intacto si deseas intentarlo nuevamente.
          </p>
          <div className="space-y-4">
            <Link
              to="/products"
              className="block w-full py-2 px-4 bg-black dark:bg-white text-white dark:text-black rounded-full hover:opacity-90 transition-opacity text-center"
            >
              Volver a Productos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutCancelPage;
