import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CheckoutSuccessPage = () => {
  const { clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    // Limpiar el carrito después de una compra exitosa
    clearCart();

    // Redirigir a la página de productos después de 5 segundos
    const timer = setTimeout(() => {
      navigate('/products');
    }, 5000);

    return () => clearTimeout(timer);
  }, [clearCart, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-green-600 dark:text-green-400 mb-4">
            ¡Compra Exitosa!
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Gracias por tu compra. Hemos enviado los detalles de tu pedido a tu correo electrónico.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Serás redirigido a la página de productos en 5 segundos...
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccessPage;
