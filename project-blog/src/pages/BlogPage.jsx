import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Tag, TrendingUp, ArrowRight, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogTeaser from '../components/BlogTeaser';
import AdCard from '../components/common/AdCard';

// UI Components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Hooks
import useFilteredPosts from '../hooks/useFilteredPosts';
import useCategories from '../hooks/useCategories';
import useFeatured from '../hooks/useFeatured';
import useAds from '../hooks/useAds';

// Utils
import { formatDate } from '../lib/blogUtils';

/**
 * Blog Page Component
 * Fully accessible blog post listing with WCAG 2.x/3.x/4.x AA compliance
 * Features: Screen reader support, keyboard navigation, high contrast support
 */
const BlogPage = () => {
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInputValue, setSearchInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('latest');
  const [isSearching, setIsSearching] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  
  // Get filtered posts using the new hook
  const { data: postsData, isLoading, error } = useFilteredPosts({
    searchQuery,
    selectedCategory,
    activeFilter,
    page: 1,
    limit: 20
  });

  // Get categories using the custom hook
  const { useAllCategories } = useCategories();
  const { data: categoriesData, isLoading: categoriesLoading } = useAllCategories();
  
  // Get featured posts using the custom hook
  const { useFeaturedPosts } = useFeatured();
  const { data: featuredPostsData, isLoading: featuredLoading } = useFeaturedPosts(3);
  
  // Get sidebar ad
  const { data: sidebarAd, isLoading: adLoading } = useAds('sidebar');
  
  // Empty cart for header
  const cartItems = [];
  
  // Refs for focus management
  const searchInputRef = useRef(null);
  const resultsSectionRef = useRef(null);
  const statusRef = useRef(null);
  
  // Prepare categories for filtering
  const categories = [
    { id: 'all', name: 'All Categories' },
    ...(categoriesData || []).map(category => ({
      id: category.id,
      name: category.name
    }))
  ];
  
  // Update status message when filters change
  useEffect(() => {
    if (!postsData?.posts) return;
    
    const resultCount = postsData.posts.length;
    const categoryName = categories.find(cat => cat.id === selectedCategory)?.name || 'All Categories';
    let status = `Showing ${resultCount} article${resultCount !== 1 ? 's' : ''}`;
    
    if (selectedCategory !== 'all') {
      status += ` in ${categoryName}`;
    }
    
    if (searchQuery) {
      status += ` matching "${searchQuery}"`;
    }
    
    setStatusMessage(status);
    
    // Focus management after search/filter
    if (resultsSectionRef.current && (searchQuery || selectedCategory !== 'all')) {
      resultsSectionRef.current.focus();
    }
  }, [postsData, searchQuery, selectedCategory, categories]);
  
  // Manejar cambios en el input de búsqueda
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchInputValue(value);
    setIsSearching(true);
  };
  
  // Efecto para manejar el debounce de la búsqueda
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setSearchQuery(searchInputValue);
      setIsSearching(false);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchInputValue]);
  
  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    
    // Announce change to screen readers
    const categoryName = categories.find(cat => cat.id === categoryId)?.name || 'All Categories';
    announceToScreenReaders(`Category changed to ${categoryName}`);
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    // Announce change to screen readers
    const filterName = filter === 'latest' ? 'Latest Articles' : 'Most Popular';
    announceToScreenReaders(`Sorting changed to ${filterName}`);
  };
  
  // Announce to screen readers utility
  const announceToScreenReaders = (message) => {
    if (statusRef.current) {
      statusRef.current.textContent = message;
    }
  };
  
  // Keyboard navigation for custom elements
  const handleKeyDown = (e) => {
    // Escape key clears all filters
    if (e.key === 'Escape') {
      setSearchQuery('');
      setSelectedCategory('all');
      setActiveFilter('latest');
      announceToScreenReaders('All filters cleared');
    }
  };
  
  // Animation variants for Framer Motion
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
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  // Hero section animation variants
  const heroVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delay: 0.2,
        duration: 0.8
      }
    }
  };
  
  return (
    <>
      <Helmet>
        <title>Blog - UI HUB | UI/UX Design and Frontend Development Articles</title>
        <meta name="description" content="Explore articles about UI/UX design, frontend development and the latest trends in web technologies. Learn from industry experts and improve your skills." />
        <meta name="keywords" content="UI design, UX research, frontend development, React, Tailwind CSS, web accessibility, blog, tutorials" />
        
        {/* Open Graph */}
        <meta property="og:title" content="UI HUB Blog | UI/UX Design and Frontend Development Articles" />
        <meta property="og:description" content="Explore articles about UI/UX design, frontend development and the latest trends in web technologies. Learn from industry experts and improve your skills." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UI HUB" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UI HUB Blog | UI/UX Design and Frontend Development Articles" />
        <meta name="twitter:description" content="Explore articles about UI/UX design, frontend development and the latest trends in web technologies. Learn from industry experts and improve your skills." />

        {/* Other */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      <div className="min-h-screen bg-white dark:bg-black" onKeyDown={handleKeyDown}>
        {/* Screen reader announcements */}
        <div 
          ref={statusRef}
          className="sr-only" 
          role="status" 
          aria-live="polite" 
          aria-atomic="true"
        ></div>
        
        <div className="sr-only" aria-live="polite">
          {statusMessage}
        </div>
        
        {/* Skip navigation link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-md"
        >
          Skip to main content
        </a>
        
        <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
          <Header cartItems={cartItems} onCartClick={() => {}} />
          
          {/* Hero Section */}
          <motion.section 
            className="relative py-16 md:py-24 mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
            role="region"
            aria-label="Blog introduction"
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10" aria-hidden="true"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                UI/UX and Frontend Development Blog
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore articles, tutorials, and resources about interface design, user experience, and modern web development.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <label htmlFor="search-articles" className="sr-only">
                  Search articles
                </label>
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" 
                  size={20}
                  aria-hidden="true"
                />
                <Input
                  id="search-articles"
                  ref={searchInputRef}
                  type="search"
                  placeholder="Search articles..."
                  value={searchInputValue}
                  onChange={handleSearchChange}
                  className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full"
                  aria-describedby="search-help"
                  autoComplete="off"
                  spellCheck="true"
                />
                <div id="search-help" className="sr-only">
                  Enter keywords to search through articles. Results will update automatically as you type.
                </div>
                
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2" aria-hidden="true">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>
          
          <main id="main-content" className="mb-20" tabIndex={-1}>
            <div className="flex flex-col lg:flex-row gap-32">
              {/* Main Content Column */}
              <div className="w-full lg:w-2/3">
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16 md:mb-32">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-500 dark:text-gray-400" aria-hidden="true" />
                    <span className="font-medium">Filter by:</span>
                  </div>
                  
                  <Tabs 
                    defaultValue="latest" 
                    className="w-full sm:w-auto" 
                    onValueChange={handleFilterChange}
                  >
                    <TabsList className="grid w-full sm:w-auto grid-cols-2" role="tablist">
                      <TabsTrigger 
                        value="latest" 
                        role="tab"
                        aria-selected={activeFilter === 'latest'}
                        aria-controls="latest-posts"
                      >
                        Latest
                      </TabsTrigger>
                      <TabsTrigger 
                        value="popular" 
                        role="tab"
                        aria-selected={activeFilter === 'popular'}
                        aria-controls="popular-posts"
                      >
                        Most Popular
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Categories Filter */}
                <div 
                  className="flex flex-wrap gap-2 mb-32"
                  role="group"
                  aria-label="Filter articles by category"
                >
                  {categories.map(category => (
                    <Badge 
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`cursor-pointer py-1.5 px-3 ${selectedCategory === category.id ? 'bg-primary hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      onClick={() => handleCategoryChange(category.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleCategoryChange(category.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-pressed={selectedCategory === category.id}
                      aria-label={`${selectedCategory === category.id ? 'Remove filter for' : 'Filter by'} ${category.name}`}
                    >
                      {category.name}
                      {selectedCategory === category.id && category.id !== 'all' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCategoryChange('all');
                          }}
                          className="ml-1 hover:text-white/80 focus:outline-none focus:ring-1 focus:ring-white rounded"
                          aria-label={`Remove ${category.name} filter`}
                        >
                          <X size={14} />
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                
                {/* Results Section */}
                <section
                  ref={resultsSectionRef}
                  tabIndex={-1}
                  role="region"
                  aria-label="Search results"
                  className="focus:outline-none"
                >
                  {/* Blog Posts Grid */}
                  {isLoading ? (
                    // Loading skeletons
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[...Array(6)].map((_, index) => (
                        <Card key={index} className="overflow-hidden">
                          <div className="relative">
                            <Skeleton className="h-48 w-full" />
                          </div>
                          <CardContent className="p-5">
                            <Skeleton className="h-4 w-1/4 mb-2" />
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : error ? (
                    // Error message
                    <div 
                      className="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800"
                      role="alert"
                      aria-live="polite"
                    >
                      <p className="text-red-700 dark:text-red-200">
                        {error.message || 'Failed to load blog posts'}
                      </p>
                    </div>
                  ) : !postsData?.posts || postsData.posts.length === 0 ? (
                    // No results message
                    <div 
                      className="p-6 text-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      role="alert"
                    >
                      <p className="text-gray-700 dark:text-gray-300">
                        No posts found matching your criteria
                      </p>
                    </div>
                  ) : (
                    // Blog posts grid
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      role="feed"
                      aria-label="Blog articles"
                    >
                      {postsData.posts.map((post, index) => (
                        <BlogPostCard 
                          key={post.id} 
                          post={post} 
                          variants={itemVariants}
                          index={index}
                        />
                      ))}
                    </motion.div>
                  )}
                </section>
                
                {/* Pagination - Simple version */}
                {postsData?.posts?.length > 0 && (
                  <nav 
                    className="flex justify-center mt-12"
                    aria-label="Pagination navigation"
                  >
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        disabled
                        aria-label="Previous page (currently disabled)"
                      >
                        Previous
                      </Button>
                      <Button 
                        variant="outline"
                        aria-label="Next page"
                      >
                        Next
                      </Button>
                    </div>
                  </nav>
                )}
              </div>
              
              {/* Sidebar Column */}
              <aside className="w-full lg:w-1/3 space-y-32" role="complementary" aria-label="Sidebar content">
                {/* Popular Posts */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={20} className="text-primary" aria-hidden="true" />
                      <h2 className="text-xl font-bold">Popular Articles</h2>
                    </div>
                    
                    <nav aria-label="Popular articles">
                      <ul className="space-y-4">
                        {postsData?.popular?.slice(0, 5).map(post => (
                          <li key={post.id}>
                            <Link 
                              to={`/blog/${post.slug}`} 
                              className="flex gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                            >
                              <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                <img 
                                  src={post.featured_image || 'https://via.placeholder.com/80'} 
                                  alt=""
                                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                />
                              </div>
                              <div>
                                <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                  {post.title}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                  <Calendar size={14} className="mr-1" aria-hidden="true" />
                                  <time dateTime={post.published_at || post.created_at}>
                                    {formatDate(post.published_at || post.created_at)}
                                  </time>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </CardContent>
                </Card>

                {/* Dynamic Advertisement */}
                {adLoading ? (
                  <div className="animate-pulse rounded-xl bg-gray-200 dark:bg-gray-800 h-[300px]"></div>
                ) : sidebarAd ? (
                  <AdCard ad={sidebarAd} />
                ) : null}
                
                {/* Categories */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={20} className="text-primary" aria-hidden="true" />
                      <h2 className="text-xl font-bold">Categories</h2>
                    </div>
                    
                    {categoriesLoading ? (
                      <div className="space-y-2" aria-live="polite" aria-busy="true">
                        <p className="sr-only">Loading categories...</p>
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                      </div>
                    ) : (
                      <nav aria-label="Article categories">
                        <ul className="flex flex-wrap gap-2">
                          {categories.filter(cat => cat.id !== 'all').map(category => (
                            <li key={category.id}>
                              <Badge 
                                variant="outline"
                                className={`cursor-pointer py-1.5 px-3 ${selectedCategory === category.id ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                                onClick={() => handleCategoryChange(category.id)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleCategoryChange(category.id);
                                  }
                                }}
                                tabIndex={0}
                                role="button"
                                aria-pressed={selectedCategory === category.id}
                                aria-label={`${selectedCategory === category.id ? 'Remove filter for' : 'Filter by'} ${category.name}`}
                              >
                                {category.name}
                              </Badge>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    )}
                  </CardContent>
                </Card>
                
                {/* Featured Posts */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="20" 
                        height="20" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="text-primary"
                        aria-hidden="true"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                      </svg>
                      <h2 className="text-xl font-bold">Featured Posts</h2>
                    </div>
                    
                    {featuredLoading ? (
                      <div className="space-y-4" aria-live="polite" aria-busy="true">
                        <p className="sr-only">Loading featured posts...</p>
                        {[...Array(3)].map((_, i) => (
                          <div key={i} className="flex gap-3">
                            <Skeleton className="w-20 h-20 rounded-md flex-shrink-0" />
                            <div className="flex-1">
                              <Skeleton className="h-4 w-full mb-2" />
                              <Skeleton className="h-4 w-3/4 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : featuredPostsData?.length > 0 ? (
                      <nav aria-label="Featured articles">
                        <ul className="space-y-4">
                          {featuredPostsData.map(post => (
                            <li key={post.id}>
                              <Link 
                                to={`/blog/${post.slug}`} 
                                className="flex gap-3 group focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-md"
                              >
                                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                                  <img 
                                    src={post.featured_image || 'https://via.placeholder.com/80'} 
                                    alt=""
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                </div>
                                <div>
                                  <h3 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                    {post.title}
                                  </h3>
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    <Calendar size={14} className="mr-1" aria-hidden="true" />
                                    <time dateTime={post.published_at || post.created_at}>
                                      {formatDate(post.published_at || post.created_at)}
                                    </time>
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-2">
                        No featured posts available
                      </p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Newsletter Subscription */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-primary/20">
                  <CardContent className="p-5">
                    <h2 className="text-xl font-bold mb-2">Subscribe to our newsletter</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Receive the latest articles and resources directly in your inbox.
                    </p>
                    
                    <form 
                      className="space-y-3"
                      onSubmit={(e) => {
                        e.preventDefault();
                        // Handle form submission
                      }}
                    >
                      <label htmlFor="newsletter-email" className="sr-only">
                        Email address for newsletter subscription
                      </label>
                      <Input 
                        id="newsletter-email"
                        type="email" 
                        placeholder="Your email address" 
                        className="bg-white/80 dark:bg-gray-800/80"
                        required
                        aria-describedby="newsletter-help"
                      />
                      <p id="newsletter-help" className="sr-only">
                        We will never share your email and you can unsubscribe at any time.
                      </p>
                      <Button 
                        type="submit"
                        className="w-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      >
                        Subscribe
                      </Button>
                    </form>
                  </CardContent>
                </Card>
                
               
              </aside>
            </div>
          </main>
          
          <Footer />
        </div>
      </div>
    </>
  );
};

/**
 * Blog Post Card Component
 * Fully accessible blog post preview card with WCAG compliance
 */
const BlogPostCard = ({ post, variants, index }) => {
  const cardRef = useRef(null);
  
  // Truncate text if it's too long
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const handleBookmark = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Implement bookmark functionality
    console.log('Bookmark clicked for post:', post.id);
  };

  return (
    <motion.div variants={variants}>
      <Card 
        className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2"
        role="article"
        aria-labelledby={`post-title-${post.id}`}
      >
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={post.featured_image || 'https://via.placeholder.com/600x400?text=No+Image'} 
            alt=""
            className="w-full h-full object-cover transition-transform hover:scale-105"
            loading="lazy"
          />
          
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <Badge 
                className="bg-primary hover:bg-primary/90"
                role="status"
                aria-label={`Category: ${typeof post.categories[0] === 'string' 
                  ? post.categories[0] 
                  : post.categories[0]?.name || 'Category'}`}
              >
                {typeof post.categories[0] === 'string' 
                  ? post.categories[0] 
                  : post.categories[0]?.name || 'Category'}
              </Badge>
            </div>
          )}
        </div>
        
        <CardContent className="p-5 flex-grow">
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              {post.author && (
                <span aria-label={`Author: ${post.author.name || 'Anonymous'}`}>
                  {post.author.name || 'Anonymous'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" aria-hidden="true" />
              <time 
                dateTime={post.published_at || post.created_at}
                aria-label={`Published on ${formatDate(post.published_at || post.created_at)}`}
              >
                {formatDate(post.published_at || post.created_at)}
              </time>
            </div>
          </div>
          
          <h3 
            id={`post-title-${post.id}`}
            className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2"
          >
            <Link 
              to={`/blog/${post.slug}`} 
              className="hover:text-primary transition-colors focus:outline-none focus:underline focus:decoration-primary focus:decoration-2 focus:underline-offset-2"
              aria-label={`Read article: ${post.title}`}
            >
              {post.title}
            </Link>
          </h3>
          
          <p 
            className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3"
            aria-label="Article excerpt"
          >
            {post.excerpt || truncateText(post.content, 120)}
          </p>
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-0 flex justify-between items-center">
          <Button 
            asChild 
            variant="ghost" 
            className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-transparent focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
          >
            <Link 
              to={`/blog/${post.slug}`} 
              className="flex items-center gap-1"
              aria-label={`Continue reading ${post.title}`}
            >
              Read more
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-full focus:ring-2 focus:ring-primary focus:ring-offset-2"
            onClick={handleBookmark}
            aria-label={`Bookmark article: ${post.title}`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="lucide lucide-bookmark"
              aria-hidden="true"
            >
              <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
            </svg>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Export the component with display name for debugging
BlogPage.displayName = 'BlogPage';
BlogPostCard.displayName = 'BlogPostCard';

export default BlogPage;
