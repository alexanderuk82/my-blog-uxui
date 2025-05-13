import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import ValueProposition from './components/ValueProposition';
import ProductGallery from './components/ProductGallery';
import BlogTeaser from './components/BlogTeaser';
import Footer from './components/Footer';
import Cart from './components/Cart';
import { Product, CartItem } from './types';
import { products } from './data/products';
import { AuthProvider } from './context/AuthContext';
import { initSupabaseIntegration } from './lib/supabase/client';
import { Toaster } from 'react-hot-toast';
import useBlog from './hooks/useBlog';

function App() {
  // Initialize cart with one item
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Get latest post for og:image
  const { usePosts } = useBlog();
  const { data: posts } = usePosts(1, 1);
  const latestPost = posts?.[0];

  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Initialize Supabase integration when the app loads
  useEffect(() => {
    // Set up Supabase auth synchronization
    const unsubscribe = initSupabaseIntegration();
    
    // Clean up on unmount
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, change: number) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.product.id === productId
            ? { ...item, quantity: Math.max(0, item.quantity + change) }
            : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  const removeItem = (productId: number) => {
    setCartItems(prevItems =>
      prevItems.filter(item => item.product.id !== productId)
    );
  };

  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <Helmet>
        {/* Basic Meta Tags */}
        <title>UI HUB - Digital Components and UI Resources</title>
        <meta name="description" content="Discover high-quality UI components, digital resources, and design inspiration for your next web project." />
        <meta name="keywords" content="UI components, digital resources, web design, UI kit, design system" />
        
        {/* Open Graph */}
        <meta property="og:title" content="UI HUB - Digital Components and UI Resources" />
        <meta property="og:description" content="Discover high-quality UI components, digital resources, and design inspiration for your next web project." />
        <meta property="og:image" content={latestPost?.featured_image || '/home-preview.jpg'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UI HUB" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UI HUB - Digital Components and UI Resources" />
        <meta name="twitter:description" content="Discover high-quality UI components, digital resources, and design inspiration for your next web project." />
        <meta name="twitter:image" content={latestPost?.featured_image || '/home-preview.jpg'} />

        {/* Other */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-black">
        <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
          <Header cartItems={cartItems} onCartClick={() => setIsCartOpen(true)} />
          <Hero />
          <ValueProposition />
          <ProductGallery products={products} onAddToCart={addToCart} />
          <BlogTeaser />
          <Footer />
          <Cart
            items={cartItems}
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
          />
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;