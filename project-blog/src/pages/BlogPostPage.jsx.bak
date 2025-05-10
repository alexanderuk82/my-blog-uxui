import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Calendar, Clock, User, Share2, Bookmark, ThumbsUp, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import DOMPurify from 'dompurify';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useBlog from '../hooks/useBlog';
import { useSeo } from '../context/SeoContext';

/**
 * BlogPost Page Component
 * 
 * Displays a single blog post with full content
 */
const BlogPost = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { usePost } = useBlog();
  const { updateMetaData } = useSeo();
  
  // Fetch post data
  const { data: post, isLoading, isError } = usePost(slug);
  
  // Empty cart for header
  const cartItems = [];
  
  // Update meta tags when post data is available
  useEffect(() => {
    if (post) {
      updateMetaData({
        title: `${post.title} - UI HUB Blog`,
        description: post.excerpt || '',
        image: post.featured_image || post.image || '',
        type: 'article',
        url: window.location.href
      });
    }
  }, [post, updateMetaData]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  return (
    <>
      <Helmet>
        <title>{post ? `${post.title} - UI HUB Blog` : 'Loading Post - UI HUB Blog'}</title>
        <meta 
          name="description" 
          content={post?.excerpt || 'Loading blog post content...'}
        />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-black">
        <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
          <Header cartItems={cartItems} onCartClick={() => {}} />
          
          <main className="mt-8 mb-24">
            {/* Back button */}
            <div className="max-w-4xl mx-auto mb-8">
              <button
                onClick={() => navigate('/blog')}
                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
              >
                <ArrowLeft size={16} />
                Back to blog
              </button>
            </div>
            
            {/* Loading state */}
            {isLoading && (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            )}
            
            {/* Error state */}
            {isError && (
              <div className="max-w-4xl mx-auto bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-8 text-center">
                <h2 className="text-2xl font-bold text-red-700 dark:text-red-400 mb-4">Post Not Found</h2>
                <p className="text-red-600 dark:text-red-300 mb-6">
                  The blog post you're looking for doesn't exist or has been removed.
                </p>
                <Link 
                  to="/blog"
                  className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Browse All Posts
                </Link>
              </div>
            )}
            
            {/* Post content */}
            {!isLoading && !isError && post && (
              <motion.article 
                className="max-w-4xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                {/* Categories */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.categories && post.categories.map(category => (
                    <Link 
                      key={category.id} 
                      to={`/blog?category=${category.slug}`}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
                
                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{post.title}</h1>
                
                {/* Meta info */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-8">
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>{formatDate(post.published_at || post.date)}</span>
                  </div>
                  
                  {post.read_time && (
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{post.read_time}</span>
                    </div>
                  )}
                  
                  {post.author && (
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      <span>{post.author.display_name || post.author.name}</span>
                    </div>
                  )}
                </div>
                
                {/* Featured image */}
                <div className="mb-8 rounded-xl overflow-hidden">
                  <img 
                    src={post.featured_image || post.image} 
                    alt={post.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
                
                {/* Author info (if available) */}
                {post.author && (
                  <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <img 
                      src={post.author.avatar_url || post.author.avatar} 
                      alt={post.author.display_name || post.author.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium">{post.author.display_name || post.author.name}</h3>
                      {post.author.bio && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">{post.author.bio}</p>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Post content */}
                <div 
                  className="prose dark:prose-invert max-w-none mb-12"
                  dangerouslySetInnerHTML={{ 
                    __html: DOMPurify.sanitize(post.content) 
                  }}
                />
                
                {/* Social sharing and actions */}
                <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      <ThumbsUp size={20} />
                      <span>Like</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      <MessageSquare size={20} />
                      <span>Comment</span>
                    </button>
                    
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors">
                      <Bookmark size={20} />
                      <span>Save</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Share:</span>
                    <button 
                      className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        // Could add a toast notification here
                      }}
                    >
                      <Share2 size={16} />
                    </button>
                  </div>
                </div>
                
                {/* Related posts would go here */}
                {/* Comments section would go here */}
              </motion.article>
            )}
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default BlogPost;
