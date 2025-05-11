import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, Filter, Calendar, Tag, TrendingUp, ArrowRight, X } from 'lucide-react';
import { Link } from 'react-router-dom';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlogTeaser from '../components/BlogTeaser';

// UI Components
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardFooter } from '../components/ui/card';
import { Skeleton } from '../components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

// Hooks
import useBlog from '../hooks/useBlog';
import useCategories from '../hooks/useCategories';
import useFeatured from '../hooks/useFeatured';

// Utils
import { formatDate } from '../lib/blogUtils';

/**
 * Blog Page Component
 * Displays a list of blog posts with filtering and search capabilities
 */
const BlogPage = () => {
  // State for filters and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeFilter, setActiveFilter] = useState('latest');
  
  // Get blog posts using the custom hook
  const { usePosts } = useBlog();
  const { data: postsData, isLoading, error } = usePosts(1, 20);
  
  // Get categories using the custom hook
  const { useAllCategories } = useCategories();
  const { data: categoriesData, isLoading: categoriesLoading } = useAllCategories();
  
  // Get featured posts using the custom hook
  const { useFeaturedPosts } = useFeatured();
  const { data: featuredPostsData, isLoading: featuredLoading } = useFeaturedPosts(3);
  
  // Derived state
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  
  // Empty cart for header
  const cartItems = [];
  
  // Prepare categories for filtering
  const categories = [
    { id: 'all', name: 'All' },
    ...(categoriesData || []).map(category => ({
      id: category.id,
      name: category.name
    }))
  ];
  
  // Filter posts when data, search query, or category changes
  useEffect(() => {
    if (!postsData) return;
    
    // Apply filters
    let filtered = [...postsData];
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(post => {
        // Check if post has categories array
        if (!post.categories) return false;
        
        // Ensure we're working with an array
        const postCategories = Array.isArray(post.categories) ? post.categories : [post.categories];
        
        // Check if any category in the post matches the selected category ID
        return postCategories.some(cat => String(cat.id) === String(selectedCategory));
      });
    }
    
    // Apply sort filter
    if (activeFilter === 'latest') {
      filtered.sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
    } else if (activeFilter === 'popular') {
      filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    
    setFilteredPosts(filtered);
    
    // Set popular posts (top 5 by views)
    const popular = [...postsData].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);
    setPopularPosts(popular);
  }, [postsData, searchQuery, selectedCategory, activeFilter]);
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
  };
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
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

      <div className="min-h-screen bg-white dark:bg-black">
        <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
          <Header cartItems={cartItems} onCartClick={() => {}} />
          
          {/* Hero Section */}
          <motion.section 
            className="relative py-16 md:py-24 mb-12 rounded-2xl overflow-hidden bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                UI/UX and Frontend Development Blog
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                Explore articles, tutorials, and resources about interface design, user experience, and modern web development.
              </p>
              
              {/* Search Bar */}
              <div className="relative max-w-xl mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={20} />
                <Input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-10 h-12 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-full"
                />
              </div>
            </div>
          </motion.section>
          
          <main className="mb-20">
            <div className="flex flex-col lg:flex-row gap-32">
              {/* Main Content Column */}
              <div className="w-full lg:w-2/3">
                {/* Filter Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-16 md:mb-32">
                  <div className="flex items-center gap-2">
                    <Filter size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-medium">Filter by:</span>
                  </div>
                  
                  <Tabs defaultValue="latest" className="w-full sm:w-auto" onValueChange={handleFilterChange}>
                    <TabsList className="grid w-full sm:w-auto grid-cols-2">
                      <TabsTrigger value="latest">Latest</TabsTrigger>
                      <TabsTrigger value="popular">Most Popular</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
                
                {/* Categories Filter */}
                <div className="flex flex-wrap gap-2 mb-32">
                  {categories.map(category => (
                    <Badge 
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      className={`cursor-pointer py-1.5 px-3 ${selectedCategory === category.id ? 'bg-primary hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                      onClick={() => handleCategoryChange(category.id)}
                    >
                      {category.name}
                      {selectedCategory === category.id && category.id !== 'all' && (
                        <X size={14} className="ml-1 cursor-pointer" onClick={(e) => {
                          e.stopPropagation();
                          handleCategoryChange('all');
                        }} />
                      )}
                    </Badge>
                  ))}
                </div>
                
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
                  <div className="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                    <p className="text-red-700 dark:text-red-300">Error loading articles: {error}</p>
                    <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                      Try Again
                    </Button>
                  </div>
                ) : filteredPosts.length === 0 ? (
                  // No results message
                  <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">No articles found matching your search.</p>
                    <Button variant="outline" onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}>
                      Clear Filters
                    </Button>
                  </div>
                ) : (
                  // Blog posts grid
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredPosts.map(post => (
                      <BlogPostCard key={post.id} post={post} variants={itemVariants} />
                    ))}
                  </motion.div>
                )}
                
                {/* Pagination - Simple version */}
                {filteredPosts.length > 0 && (
                  <div className="flex justify-center mt-12">
                    <div className="flex gap-2">
                      <Button variant="outline" disabled>
                        Previous
                      </Button>
                      <Button variant="outline">
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Sidebar Column */}
              <div className="w-full lg:w-1/3 space-y-32">
                {/* Popular Posts */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp size={20} className="text-primary" />
                      <h3 className="text-xl font-bold">Popular Articles</h3>
                    </div>
                    
                    <div className="space-y-4">
                      {popularPosts.map(post => (
                        <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                          <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                            <img 
                              src={post.featured_image || 'https://via.placeholder.com/80'} 
                              alt={post.title}
                              className="w-full h-full object-cover transition-transform group-hover:scale-105"
                            />
                          </div>
                          <div>
                            <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                              {post.title}
                            </h4>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                              <Calendar size={14} className="mr-1" />
                              <span>{formatDate(post.published_at || post.created_at)}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Categories */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <Tag size={20} className="text-primary" />
                      <h3 className="text-xl font-bold">Categories</h3>
                    </div>
                    
                    {categoriesLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-8 w-20 rounded-full" />
                        <Skeleton className="h-8 w-24 rounded-full" />
                        <Skeleton className="h-8 w-16 rounded-full" />
                        <Skeleton className="h-8 w-28 rounded-full" />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {categories.filter(cat => cat.id !== 'all').map(category => (
                          <Badge 
                            key={category.id}
                            variant="outline"
                            className={`cursor-pointer py-1.5 px-3 ${selectedCategory === category.id ? 'bg-primary text-white hover:bg-primary/90' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                            onClick={() => handleCategoryChange(category.id)}
                          >
                            {category.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {/* Featured Posts */}
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                      <h3 className="text-xl font-bold">Featured Posts</h3>
                    </div>
                    
                    {featuredLoading ? (
                      <div className="space-y-4">
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
                      <div className="space-y-4">
                        {featuredPostsData.map(post => (
                          <Link key={post.id} to={`/blog/${post.slug}`} className="flex gap-3 group">
                            <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={post.featured_image || 'https://via.placeholder.com/80'} 
                                alt={post.title}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium line-clamp-2 group-hover:text-primary transition-colors">
                                {post.title}
                              </h4>
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-1">
                                <Calendar size={14} className="mr-1" />
                                <span>{formatDate(post.published_at || post.created_at)}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-2">No featured posts available</p>
                    )}
                  </CardContent>
                </Card>
                
                {/* Newsletter Subscription */}
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-primary/20">
                  <CardContent className="p-5">
                    <h3 className="text-xl font-bold mb-2">Subscribe to our newsletter</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Receive the latest articles and resources directly in your inbox.
                    </p>
                    
                    <div className="space-y-3">
                      <Input 
                        type="email" 
                        placeholder="Your email address" 
                        className="bg-white/80 dark:bg-gray-800/80"
                      />
                      <Button className="w-full">Subscribe</Button>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Advertisement Banner */}
                <Card className="overflow-hidden border-0 shadow-lg">
                  <div className="relative aspect-[4/3] bg-gradient-to-r from-blue-600 to-violet-600 flex items-center justify-center p-6 text-white">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
                    <div className="relative z-10 text-center">
                      <h3 className="text-xl font-bold mb-2">Premium UI Kit</h3>
                      <p className="mb-4">UI Components for your next project</p>
                      <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                        View Offer
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
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
 * Displays a preview of a blog post
 */
const BlogPostCard = ({ post, variants }) => {
  // Truncate text if it's too long
  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <motion.div variants={variants}>
      <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
        <div className="relative aspect-video overflow-hidden">
          <img 
            src={post.featured_image || 'https://via.placeholder.com/600x400'} 
            alt={post.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          
          {post.categories && post.categories.length > 0 && (
            <div className="absolute top-3 left-3">
              <Badge className="bg-primary hover:bg-primary/90">
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
                <span>{post.author.name || 'Anonymous'}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.published_at || post.created_at)}</span>
            </div>
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {post.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
            {post.excerpt || truncateText(post.content, 120)}
          </p>
        </CardContent>
        
        <CardFooter className="px-5 pb-5 pt-0 flex justify-between">
          <Button asChild variant="ghost" className="p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-transparent">
            <Link to={`/blog/${post.slug}`} className="flex items-center gap-1">
              Read more
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </Button>
          
          <Button variant="outline" size="icon" className="h-8 w-8 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bookmark"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogPage;