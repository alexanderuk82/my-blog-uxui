/**
 * Authentication Service
 * 
 * This service integrates Firebase Authentication with Supabase.
 * It handles user authentication and synchronizes user data between Firebase and Supabase.
 */

import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { supabase } from '../../lib/supabase/supabase';

/**
 * Synchronizes the Firebase user with Supabase
 * @param {Object} firebaseUser - The Firebase user object
 * @returns {Promise} - Promise resolving to the synchronized user profile
 */
export const syncUserWithSupabase = async (firebaseUser) => {
  if (!firebaseUser) {
    console.log('No Firebase user provided, skipping sync');
    return null;
  }

  console.log('Syncing Firebase user with Supabase:', {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName
  });

  try {
    // Check if user exists in Supabase
    const { data: existingUser, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .eq('firebase_uid', firebaseUser.uid)
      .maybeSingle(); // Use maybeSingle instead of single to avoid errors

    if (fetchError) {
      console.error('Error checking for existing user:', fetchError);
      // Continue execution instead of throwing, to attempt profile creation
    }

    console.log('Existing user check result:', { existingUser, fetchError });

    // If user doesn't exist, create a new profile
    if (!existingUser) {
      console.log('User does not exist in Supabase, creating profile...');
      
      // Use the Supabase auth.getUser() method to get the JWT token
      const { data: authData } = await supabase.auth.getUser();
      console.log('Auth data:', authData);
      
      // Prepare the new profile data
      const newProfile = {
        firebase_uid: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: firebaseUser.displayName || '',
        avatar_url: firebaseUser.photoURL || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log('Creating new profile with data:', newProfile);

      // Use the service role key for this operation to bypass RLS
      const { data: createdProfile, error: insertError } = await supabase
        .from('profiles')
        .insert(newProfile)
        .select()
        .maybeSingle();

      if (insertError) {
        console.error('Error creating user profile:', insertError);
        // Return a minimal profile instead of throwing
        return {
          firebase_uid: firebaseUser.uid,
          email: firebaseUser.email,
          display_name: firebaseUser.displayName || '',
          avatar_url: firebaseUser.photoURL || '',
        };
      }

      console.log('Successfully created profile:', createdProfile);
      return createdProfile;
    }

    // If user exists but some fields need updating
    const needsUpdate = 
      existingUser.display_name !== firebaseUser.displayName ||
      existingUser.avatar_url !== firebaseUser.photoURL ||
      existingUser.email !== firebaseUser.email;

    if (needsUpdate) {
      console.log('User exists but needs update');
      
      const updatedProfile = {
        ...existingUser,
        display_name: firebaseUser.displayName || existingUser.display_name,
        avatar_url: firebaseUser.photoURL || existingUser.avatar_url,
        email: firebaseUser.email || existingUser.email,
        updated_at: new Date().toISOString(),
      };

      console.log('Updating profile with data:', updatedProfile);

      const { data: updatedData, error: updateError } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('firebase_uid', firebaseUser.uid)
        .select()
        .maybeSingle();

      if (updateError) {
        console.error('Error updating user profile:', updateError);
        // Return the existing user instead of throwing
        return existingUser;
      }

      console.log('Successfully updated profile:', updatedData);
      return updatedData;
    }

    console.log('User already in sync, no update needed');
    return existingUser;
  } catch (error) {
    console.error('Error synchronizing user with Supabase:', error);
    // Return a minimal profile instead of throwing
    return {
      firebase_uid: firebaseUser.uid,
      email: firebaseUser.email,
      display_name: firebaseUser.displayName || '',
      avatar_url: firebaseUser.photoURL || '',
    };
  }
};

/**
 * Sets up a listener for Firebase authentication state changes
 * and synchronizes the user with Supabase
 * @returns {Function} - Unsubscribe function to stop the listener
 */
export const setupAuthSync = () => {
  const auth = getAuth();
  
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      try {
        await syncUserWithSupabase(firebaseUser);
      } catch (error) {
        console.error('Error in auth sync:', error);
      }
    }
  });
};

/**
 * Gets the current user's profile from Supabase
 * @param {string} firebaseUid - The Firebase UID of the user
 * @returns {Promise} - Promise resolving to the user profile
 */
export const getCurrentUserProfile = async (firebaseUid) => {
  if (!firebaseUid) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('firebase_uid', firebaseUid)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error getting current user profile:', error);
    throw error;
  }
};

/**
 * Updates the user's profile in Supabase
 * @param {string} firebaseUid - The Firebase UID of the user
 * @param {Object} profileData - The profile data to update
 * @returns {Promise} - Promise resolving to the updated profile
 */
export const updateUserProfile = async (firebaseUid, profileData) => {
  if (!firebaseUid) return null;

  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...profileData,
        updated_at: new Date().toISOString(),
      })
      .eq('firebase_uid', firebaseUid)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

/**
 * Checks if a user has admin privileges
 * @param {string} email - The user's email address
 * @returns {Promise<boolean>} - Promise resolving to whether the user is an admin
 */
export const checkAdminAccess = async (email) => {
  console.log('Checking admin access for email:', email);
  
  if (!email) {
    console.log('No email provided, returning false');
    return false;
  }

  // Hardcoded admin check for development purposes
  // This ensures that the specified email always has admin access
  // regardless of database configuration
  if (email === 'alexanderburgosuk82@gmail.com') {
    console.log('Hardcoded admin email detected, granting access');
    return true;
  }

  try {
    // Now check if the user is an admin in the database
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email)
      .maybeSingle(); // Use maybeSingle to avoid errors
    
    console.log('Admin check result:', { data, error });

    if (error) {
      console.error('Error checking admin access:', error);
      // If there's an error, we'll still check if the email matches our hardcoded admin
      return email === 'alexanderburgosuk82@gmail.com';
    }

    const isAdmin = !!data;
    console.log('Is admin result:', isAdmin);
    return isAdmin; // Convert to boolean
  } catch (error) {
    console.error('Error checking admin access:', error);
    // If there's an exception, we'll still check if the email matches our hardcoded admin
    return email === 'alexanderburgosuk82@gmail.com';
  }
};

export default {
  syncUserWithSupabase,
  setupAuthSync,
  getCurrentUserProfile,
  updateUserProfile,
  checkAdminAccess,
};
