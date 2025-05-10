import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import App from './App';
import SupabaseTest from './pages/SupabaseTest';
import Login from './pages/Login';

/**
 * Application routes configuration
 * This component defines all the routes for the application
 */
const AppRoutes = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/supabase-test" element={
          <ProtectedRoute adminOnly={true}>
            <SupabaseTest />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} />
        {/* Add more routes here as needed */}
      </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
