import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SeoProvider } from './context/SeoContext';
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from './components/auth/ProtectedRoute';
import App from './App';
import SupabaseTest from './pages/SupabaseTest';
import Login from './pages/Login';
import BlogPage from './pages/BlogPage';
import BlogPostPage from './pages/BlogPostPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import InvalidCheckoutPage from './pages/InvalidCheckoutPage';

/**
 * Application routes configuration
 * This component defines all the routes for the application
 */
const AppRoutes = () => {
  return (
    <HelmetProvider>
      <SeoProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/supabase-test" element={
              <ProtectedRoute adminOnly={true}>
                <SupabaseTest />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
            <Route path="/checkout/invalid" element={<InvalidCheckoutPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            {/* Add more routes here as needed */}
          </Routes>
        </AuthProvider>
      </SeoProvider>
    </HelmetProvider>
  );
};

export default AppRoutes;
