import React from 'react';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

const Cart: React.FC = () => {
  const { state, updateQuantity, removeItem, setCartOpen } = useCart();
  const { items } = state;
  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  if (!state.isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-lg shadow-xl m-4">
        <div className="p-4 border-b border-keyline flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <h2 className="text-lg font-bold">Shopping Cart</h2>
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1 hover:bg-surface rounded-full">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-center py-8 text-gray-500">Your cart is empty</p>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex gap-4 p-4 bg-surface rounded-lg">
                  <img
                    src={item.product.image_url || '/placeholder-product.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold">{item.product.name}</h3>
                    <p className="text-sm mb-2">{formatPrice(item.product.price * item.quantity, item.product.currency)}</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id.toString(), item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id.toString(), item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                      >
                        <Plus size={16} />
                      </button>
                      <button
                        onClick={() => removeItem(item.product.id.toString())}
                        className="ml-auto text-sm text-red-500 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-keyline">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold">Total:</span>
            <span className="text-lg font-bold">{formatPrice(total, items[0]?.product.currency || 'gbp')}</span>
          </div>
          <button
            className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
            disabled={items.length === 0}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;