import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SupabaseConnectionTest from '../components/examples/SupabaseConnectionTest';
import AuthDebugger from '../components/debug/AuthDebugger';

/**
 * Test page for Supabase connection
 * This page displays the Supabase connection test component
 */
const SupabaseTest = () => {
  // Empty cart for header
  const cartItems = [];

  return (
    <>
      <Helmet>
        <title>Supabase Connection Test - UI HUB</title>
        <meta name="description" content="Testing Supabase connection and integration" />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-black">
        <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
          <Header cartItems={cartItems} onCartClick={() => {}} />
          
          <main className="my-12">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold mb-8 text-center">Supabase Integration Test</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
                This page tests the connection between our React application and Supabase.
                You can view posts from the database and create new test posts.
              </p>
              
              <SupabaseConnectionTest />
              <AuthDebugger />
              
              <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h2 className="text-xl font-semibold mb-2 text-blue-700 dark:text-blue-400">How This Works</h2>
                <p className="text-blue-600 dark:text-blue-300 mb-4">
                  This test page demonstrates the integration between our React frontend and Supabase backend:
                </p>
                <ul className="list-disc pl-5 space-y-2 text-blue-600 dark:text-blue-300">
                  <li>The component uses the <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">useSupabase</code> hook to connect to Supabase</li>
                  <li>It fetches blog posts from the <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">posts</code> table in Supabase</li>
                  <li>You can create new test posts that will be saved to Supabase</li>
                  <li>The connection status indicates whether the integration is working properly</li>
                </ul>
              </div>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default SupabaseTest;
