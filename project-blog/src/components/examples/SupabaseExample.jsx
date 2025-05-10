import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import toast from 'react-hot-toast';

/**
 * Example component demonstrating Supabase integration
 * This component shows how to use the useSupabase hook to interact with Supabase
 */
const SupabaseExample = () => {
  const { blog, userProfile, isAdmin, loading, error } = useSupabase();
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        // Use the blog service from useSupabase hook
        const fetchedPosts = await blog.getPosts(1, 5);
        setPosts(fetchedPosts);
      } catch (err) {
        console.error('Error fetching posts:', err);
        toast.error('Failed to load blog posts');
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [blog]);

  if (loading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-center text-gray-500 dark:text-gray-400">Loading user data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Supabase Integration Example</h2>
      
      {/* User profile information */}
      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">User Profile</h3>
        {userProfile ? (
          <div>
            <p><span className="font-medium">Email:</span> {userProfile.email}</p>
            <p><span className="font-medium">Display Name:</span> {userProfile.display_name || 'Not set'}</p>
            <p><span className="font-medium">Admin Access:</span> {isAdmin ? 'Yes' : 'No'}</p>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">Not logged in</p>
        )}
      </div>
      
      {/* Blog posts */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Recent Blog Posts</h3>
        {loadingPosts ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading posts...</p>
        ) : posts.length > 0 ? (
          <ul className="space-y-2">
            {posts.map(post => (
              <li key={post.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <h4 className="font-medium">{post.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">{post.excerpt}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts found</p>
        )}
      </div>
      
      {/* Admin-only section */}
      {isAdmin && (
        <div className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
          <h3 className="text-lg font-semibold mb-2 text-emerald-700 dark:text-emerald-400">Admin Panel</h3>
          <p className="text-emerald-600 dark:text-emerald-300">
            This section is only visible to administrators. Here you can manage blog posts, products, and user accounts.
          </p>
          <button 
            className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
            onClick={() => toast.success('Admin action triggered!')}
          >
            Admin Action
          </button>
        </div>
      )}
    </div>
  );
};

export default SupabaseExample;
