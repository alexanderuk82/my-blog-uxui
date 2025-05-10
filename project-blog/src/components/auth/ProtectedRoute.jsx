import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';
import toast from 'react-hot-toast';

/**
 * Protected Route Component
 * 
 * This component protects routes that require authentication and/or admin access.
 * It redirects unauthenticated users to the home page with a toast notification.
 * It redirects non-admin users to the home page with a toast notification if adminOnly is true.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { currentUser, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user is admin directly from Firebase user claims
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }

      try {
        // Simple check - if the email matches our admin email
        const isUserAdmin = currentUser.email === 'alexanderburgosuk82@gmail.com';
        console.log('Admin check result:', isUserAdmin);
        setIsAdmin(isUserAdmin);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsChecking(false);
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }
  }, [currentUser, authLoading]);

  // Show loading spinner while checking authentication
  if (authLoading || isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // If user is not authenticated, redirect to home with toast
  if (!currentUser) {
    toast.error('Authentication required. Please sign in to access this page.', {
      duration: 4000,
      position: 'top-center',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    return <Navigate to="/" replace />;
  }

  // If route requires admin access and user is not admin, redirect to home with toast
  if (adminOnly && !isAdmin) {
    toast.error('Access denied. Admin privileges required to view this page.', {
      duration: 4000,
      position: 'top-center',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
    return <Navigate to="/" replace />;
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute;
