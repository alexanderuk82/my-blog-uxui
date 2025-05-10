import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useSupabase } from '../../hooks/useSupabase';

/**
 * Auth Debugger Component
 * 
 * This component displays authentication and admin status information
 * for debugging purposes.
 */
const AuthDebugger = () => {
  const { currentUser } = useAuth();
  const { isAdmin, userProfile, loading, error } = useSupabase();
  
  if (!currentUser) {
    return (
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4">
        <h2 className="text-lg font-semibold mb-2">Auth Debug Info</h2>
        <p className="text-red-500">Not authenticated</p>
      </div>
    );
  }
  
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mt-4 overflow-auto max-h-96">
      <h2 className="text-lg font-semibold mb-2">Auth Debug Info</h2>
      
      <div className="mb-4">
        <h3 className="font-medium">User Info:</h3>
        <pre className="bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-auto">
          {JSON.stringify({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            emailVerified: currentUser.emailVerified,
            providerId: currentUser.providerData?.[0]?.providerId,
          }, null, 2)}
        </pre>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium">Admin Status:</h3>
        <p className={isAdmin ? "text-green-500" : "text-red-500"}>
          {isAdmin ? "Is Admin ✓" : "Not Admin ✗"}
        </p>
      </div>
      
      <div className="mb-4">
        <h3 className="font-medium">User Profile:</h3>
        <pre className="bg-white dark:bg-gray-900 p-2 rounded text-xs overflow-auto">
          {JSON.stringify(userProfile, null, 2)}
        </pre>
      </div>
      
      {error && (
        <div className="mb-4">
          <h3 className="font-medium">Errors:</h3>
          <p className="text-red-500">{error}</p>
        </div>
      )}
      
      <div className="mb-4">
        <h3 className="font-medium">Loading State:</h3>
        <p>{loading ? "Loading..." : "Loaded"}</p>
      </div>
    </div>
  );
};

export default AuthDebugger;
