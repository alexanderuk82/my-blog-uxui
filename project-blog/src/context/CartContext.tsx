import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { Product } from '../types';

// Types
export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isOpen: boolean;
  isCheckingOut: boolean;
  checkoutError?: string;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Product }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_CHECKOUT_STATUS'; payload: { isCheckingOut: boolean; error?: string } };

interface CartContextType {
  state: CartState;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setCartOpen: (isOpen: boolean) => void;
  initiateCheckout: () => Promise<{ sessionId: string; url: string; }>;
}

// Función para cargar el estado inicial desde localStorage
const loadInitialState = (): CartState => {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);
    return {
      ...parsedCart,
      isOpen: false, // Siempre iniciamos con el carrito cerrado
    };
  }
  return {
    items: [],
    total: 0,
    itemCount: 0,
    isOpen: false,
    isCheckingOut: false,
    checkoutError: undefined,
  };
};

// Initial state
const initialState: CartState = loadInitialState();

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  let newState: CartState;


  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find(item => item.product.id.toString() === action.payload.id.toString());
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.product.id.toString() === action.payload.id.toString()
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        
        newState = {
          ...state,
          items: updatedItems,
          total: calculateTotal(updatedItems),
          itemCount: calculateItemCount(updatedItems),
          isOpen: true, // Abrimos el carrito al actualizar la cantidad
        };
        localStorage.setItem('cart', JSON.stringify(newState));
        return newState;
      }
      
      const newItems = [...state.items, { product: action.payload, quantity: 1 }];
      
      newState = {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
        isOpen: true, // Abrimos el carrito al agregar un item
      };
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }
    
    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.product.id.toString() !== action.payload.toString());
      
      newState = {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }
    
    case 'UPDATE_QUANTITY': {
      const existingItem = state.items.find(item => item.product.id === action.payload.id);
      const updatedItems = state.items.map(item =>
        existingItem && item.product.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      
      newState = {
        ...state,
        items: updatedItems,
        total: calculateTotal(updatedItems),
        itemCount: calculateItemCount(updatedItems),
      };
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    }
    
    case 'CLEAR_CART':
      newState = {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };
      localStorage.setItem('cart', JSON.stringify(newState));
      return newState;
    
    case 'SET_CART_OPEN':
      newState = {
        ...state,
        isOpen: action.payload,
      };
      // No guardamos el estado isOpen en localStorage
      return newState;

    case 'SET_CHECKOUT_STATUS':
      newState = {
        ...state,
        isCheckingOut: action.payload.isCheckingOut,
        checkoutError: action.payload.error,
      };
      return newState;
    
    default:
      return state;
  }
}

// Helper functions
function calculateTotal(items: CartItem[]): number {
  return Number(items.reduce((total, item) => total + item.product.price * item.quantity, 0).toFixed(2));
}

function calculateItemCount(items: CartItem[]): number {
  return items.reduce((count, item) => count + item.quantity, 0);
}

// Provider
interface CartProviderProps {
  children: ReactNode;
}

import { createCheckoutSession } from '../services/stripeService';

export function CartProvider({ children }: CartProviderProps) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  
  const addItem = (product: Product) => {
    dispatch({ type: 'ADD_ITEM', payload: product });
  };
  
  const removeItem = (productId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: productId });
  };
  
  const updateQuantity = (productId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };
  
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const setCartOpen = (isOpen: boolean) => dispatch({ type: 'SET_CART_OPEN', payload: isOpen });
  
  const initiateCheckout = async () => {
    try {
      dispatch({ 
        type: 'SET_CHECKOUT_STATUS', 
        payload: { isCheckingOut: true } 
      });

      const { url, sessionId } = await createCheckoutSession({
        items: state.items,
        successUrl: `${window.location.origin}/checkout/success`,
        cancelUrl: `${window.location.origin}/checkout/cancel`,
      });

      return { sessionId, url };
    } catch (error) {
      console.error('Checkout error:', error);
      dispatch({ 
        type: 'SET_CHECKOUT_STATUS', 
        payload: { 
          isCheckingOut: false, 
          error: error instanceof Error ? error.message : 'An error occurred during checkout' 
        } 
      });
    }
  };

  const value = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    setCartOpen,
    initiateCheckout,
  };
  
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Hook
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
