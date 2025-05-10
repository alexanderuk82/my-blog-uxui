import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronLeft, ChevronRight, Filter, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useBlog from '../hooks/useBlog';
import { motion } from 'framer-motion';

/**
 * Blog Page Component
 * 
 * Main blog listing page showing all blog posts with pagination and filtering
 */
const Blog = () => {
  // State for pagination and filtering
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(9);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Fetch posts using custom hook
  const { usePosts } = useBlog();
  const { data: posts, isLoading, isError, error } = usePosts(currentPage, postsPerPage);
  
  // Empty cart for header (to be replaced with actual cart)
  const cartItems = [];
  
  // Handle page changes
  const handleNextPage = () => {
    if (posts && posts.length === postsPerPage) {
      setCurrentPage(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Filter posts by search term and category
  const filterPosts = () => {
    if (!posts) return [];
    
    return posts.filter(post => {
      const matchesSearch = searchTerm === '' || 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        
      const matchesCategory = activeCategory === 'all' || 
        (post.categories && post.categories.some(cat => cat.slug === activeCategory));
        
      return matchesSearch && matchesCategory;
    });
  };
  
  const filteredPosts = filterPosts();
  
  // Get all unique categories from posts
  const categories = posts ? 
    Array.from(new Set(posts.flatMap(post => post.categories || []).map(cat => cat.name))) : 
    [];
  
  // Animation variants for page transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 300, damping: 24 }
    }
  };

  return (
    <>
      <Helmet>
        <title>Blog - UI HUB</title>
        <meta name="description" content="Explore the latest UI/UX design trends, frontend development techniques, and digital resources." />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-black">
        <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
          <Header cartItems={cartItems} onCartClick={() => {}} />
          
          <main className="mt-12 mb-24">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  Thoughts, ideas, and insights on UI/UX design, frontend development, 
                  and the ever-evolving digital landscape.
                </p>
              </div>
              
              {/* Search and filter bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
                <div className="relative w-full md:w-96">
                  <input
                    type="text"
                    placeholder="Search posts..."
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                  <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    <Filter size={16} />
                    Filter:
                  </span>
                  
                  <button
                    className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                      activeCategory === 'all' 
                        ? 'bg-primary text-white' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                    onClick={() => setActiveCategory('all')}
                  >
                    All
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category}
                      className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${
                        activeCategory === category 
                          ? 'bg-primary text-white' 
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Loading state */}
              {isLoading && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
              
              {/* Error state */}
              {isError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-center">
                  <p className="text-red-600 dark:text-red-400">
                    Error loading posts: {error?.message || 'Something went wrong'}
                  </p>
                  <button 
                    className="mt-2 px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-700"
                    onClick={() => window.location.reload()}
                  >
                    Try Again
                  </button>
                </div>
              )}
              
              {/* Posts grid */}
              {!isLoading && !isError && filteredPosts.length > 0 && (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredPosts.map((post) => (
                    <motion.article 
                      key={post.id} 
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700"
                      variants={itemVariants}
                    >
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="h-48 overflow-hidden">
                          <img 
                            src={post.featured_image || post.image} 
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                        
                        <div className="p-5">
                          <div className="flex items-center gap-2 mb-3">
                            {post.categories && post.categories.map(category => (
                              <span 
                                key={category.id} 
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded text-xs"
                              >
                                {category.name}
                              </span>
                            ))}
                          </div>
                          
                          <h2 className="text-xl font-bold mb-2 line-clamp-2">{post.title}</h2>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {post.author && (
                                <>
                                  <img 
                                    src={post.author.avatar_url || post.author.avatar} 
                                    alt={post.author.display_name || post.author.name}
                                    className="w-8 h-8 rounded-full object-cover"
                                  />
                                  <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {post.author.display_name || post.author.name}
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {post.published_at 
                                ? new Date(post.published_at).toLocaleDateString() 
                                : post.date}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </motion.div>
              )}
              
              {/* Empty state */}
              {!isLoading && !isError && filteredPosts.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-xl font-medium mb-2">No posts found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Try adjusting your search or filter criteria
                  </p>
                  <button
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    onClick={() => {
                      setSearchTerm('');
                      setActiveCategory('all');
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
              
              {/* Pagination */}
              {!isLoading && !isError && posts && posts.length > 0 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                      currentPage === 1
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Page {currentPage}
                  </span>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={posts.length < postsPerPage}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg ${
                      posts.length < postsPerPage
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Blog;
