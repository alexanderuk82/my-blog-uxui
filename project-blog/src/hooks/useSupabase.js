/**
 * useSupabase Hook
 * 
 * This custom hook provides access to Supabase services throughout the React application.
 * It integrates with the authentication context to provide user-specific functionality.
 */

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import supabaseClient, { 
  initSupabaseIntegration,
  blogService,
  productService,
  profileService,
  orderService
} from '../lib/supabase/client';

/**
 * Custom hook for Supabase integration
 * @returns {Object} Supabase services and state
 */
export const useSupabase = () => {
  const { currentUser } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize Supabase integration on mount
  useEffect(() => {
    const unsubscribe = initSupabaseIntegration();
    
    // Cleanup function to unsubscribe from auth sync
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  // Fetch user profile and admin status when currentUser changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) {
        setUserProfile(null);
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Get user profile from Supabase
        const profile = await profileService.getCurrentProfile(currentUser.uid);
        setUserProfile(profile);

        // Check if user has admin access
        const adminAccess = await profileService.checkAdminAccess(currentUser.email);
        setIsAdmin(adminAccess);
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser]);

  // Return all Supabase services and state
  return {
    // Supabase client
    supabase: supabaseClient.supabase,
    
    // User state
    userProfile,
    isAdmin,
    loading,
    error,
    
    // Services
    blog: blogService,
    product: productService,
    profile: profileService,
    order: orderService,
    
    // Helper functions
    refreshProfile: async () => {
      if (!currentUser) return null;
      try {
        const profile = await profileService.getCurrentProfile(currentUser.uid);
        setUserProfile(profile);
        return profile;
      } catch (err) {
        console.error('Error refreshing profile:', err);
        setError(err.message);
        return null;
      }
    }
  };
};

export default useSupabase;
