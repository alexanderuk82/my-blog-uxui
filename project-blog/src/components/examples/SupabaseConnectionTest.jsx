import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import toast from 'react-hot-toast';

/**
 * Component to test Supabase connection
 * This component fetches blog posts from Supabase and displays them
 */
const SupabaseConnectionTest = () => {
  const { blog, loading: supabaseLoading } = useSupabase();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [testPost, setTestPost] = useState({
    title: '',
    slug: '',
    excerpt: 'Test post created from React'
  });

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const fetchedPosts = await blog.getPosts();
        console.log('Posts from Supabase:', fetchedPosts);
        setPosts(fetchedPosts || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError(err.message);
        toast.error('Failed to load posts from Supabase');
      } finally {
        setLoading(false);
      }
    };

    if (!supabaseLoading) {
      fetchPosts();
    }
  }, [blog, supabaseLoading]);

  // Handle input changes for the test post
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTestPost(prev => ({
      ...prev,
      [name]: value,
      slug: name === 'title' ? value.toLowerCase().replace(/\s+/g, '-') : prev.slug
    }));
  };

  // Create a new test post
  const handleCreatePost = async (e) => {
    e.preventDefault();
    
    if (!testPost.title) {
      toast.error('Title is required');
      return;
    }
    
    try {
      setLoading(true);
      // Usar un ID de autor predefinido para pruebas
      // En una aplicación real, esto vendría del usuario autenticado
      const newPost = {
        ...testPost,
        author_id: '00000000-0000-0000-0000-000000000001', // ID del usuario de prueba
        content: `# ${testPost.title}\n\nThis is a test post created to verify the Supabase connection.`,
        featured_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1470&auto=format&fit=crop',
        published: true,
        published_at: new Date().toISOString()
      };
      
      const createdPost = await blog.createPost(newPost);
      console.log('Created post:', createdPost);
      
      // Refresh the posts list
      const fetchedPosts = await blog.getPosts();
      setPosts(fetchedPosts || []);
      
      // Reset the form
      setTestPost({
        title: '',
        slug: '',
        excerpt: 'Test post created from React'
      });
      
      toast.success('Post created successfully!');
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.message);
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  if (supabaseLoading) {
    return (
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Supabase Connection Test</h2>
        <p className="text-center text-gray-500 dark:text-gray-400">Initializing Supabase connection...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Supabase Connection Test</h2>
      
      {/* Create test post form */}
      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Create Test Post</h3>
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={testPost.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="Enter post title"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug (auto-generated)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={testPost.slug}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 dark:text-gray-300"
            />
          </div>
          
          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              value={testPost.excerpt}
              onChange={handleInputChange}
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary dark:bg-gray-800 dark:text-white"
              placeholder="Enter post excerpt"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 transition-colors"
          >
            {loading ? 'Creating...' : 'Create Test Post'}
          </button>
        </form>
      </div>
      
      {/* Display error if any */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
          <h3 className="text-lg font-semibold mb-2">Error</h3>
          <p>{error}</p>
        </div>
      )}
      
      {/* Display posts */}
      <div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">Posts from Supabase</h3>
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading posts...</p>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map(post => (
              <div key={post.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-bold text-lg">{post.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{post.excerpt}</p>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Published: {new Date(post.published_at).toLocaleDateString()}</span>
                  <span>ID: {post.id.substring(0, 8)}...</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No posts found in Supabase</p>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
        <p>Connection status: {error ? '❌ Error' : '✅ Connected'}</p>
        <p>Total posts: {posts.length}</p>
      </div>
    </div>
  );
};

export default SupabaseConnectionTest;
