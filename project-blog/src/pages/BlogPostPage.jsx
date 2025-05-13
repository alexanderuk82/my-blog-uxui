import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Calendar, Share2, HandMetal, Linkedin, Mail, Copy, Check, Chrome } from 'lucide-react';
import Login from '../components/auth/Login';
import SignUp from '../components/auth/SignUp';
import SimilarPosts from '../components/blog/SimilarPosts';
import { Toaster, toast } from 'react-hot-toast';
import Modal from '../components/ui/Modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';

import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import useBlog from '../hooks/useBlog';
import { Avatar, AvatarImage, AvatarFallback } from '../components/ui/avatar';
import { Skeleton } from '../components/ui/skeleton';

// Context
import { useAuth } from '../context/AuthContext';

// Utils
import { formatDate } from '../lib/blogUtils';

const BlogPostPage = () => {
  const { slug } = useParams();
  const contentRef = useRef(null);
  const [isClapping, setIsClapping] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { currentUser, signInWithGoogle } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  

  
  // Animation variants
  const stagger = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideUp = {
    initial: { opacity: 0, y: 20 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  const handleClap = async () => {
    try {
      if (!currentUser) {
        setShowLoginModal(true);
        return;
      }

      setIsClapping(true);
      const result = await addClap();
      console.log('Clap result:', result);
      toast.success('Thanks for your support! 🤘', {
        duration: 2000
      });
    } catch (error) {
      console.error('Error in handleClap:', error);
      if (error.message?.includes('sign in')) {
        setShowLoginModal(true);
      } else if (error.message?.includes('Maximum claps')) {
        toast.error('You have reached the maximum claps for this post', {
          duration: 3000
        });
      } else {
        toast.error('Could not register your clap. Please try again.', {
          duration: 3000
        });
      }
    } finally {
      setIsClapping(false);
    }
  };

  const handleShare = async (type) => {
    const url = window.location.href;
    const title = post.title;

    switch (type) {
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this article: ${url}`)}`;
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          setHasCopied(true);
          toast.success('Link copied!', { duration: 2000 });
          setTimeout(() => setHasCopied(false), 2000);
        } catch (err) {
          toast.error('Could not copy the link', { duration: 3000 });
        }
        break;
    }
  };
  
  // Get blog data using hooks
  const { usePost, useClaps } = useBlog();
  const { data: post, isLoading: postLoading } = usePost(slug);
  console.log('Post data:', post); // Log para depuración
  const { totalClaps = 0, userClaps = 0, addClap } = useClaps(post?.id);

  // Loading state
  if (postLoading) {
    return (
      <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
        <Header cartItems={[]} />
        <main className="flex-1">
          <div className="container relative">
            <div className="space-y-8 py-16">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-96 w-full" />
              <div className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (!post) {
    return (
      <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
        <Header cartItems={[]} />
        <main className="flex-1">
          <div className="container relative">
            <div className="py-16 text-center">
              <h1 className="text-2xl font-bold mb-4">Post not found</h1>
              <p className="text-muted-foreground mb-8">The post you're looking for doesn't exist or has been removed.</p>
              <Button asChild>
                <Link to="/blog">Back to Blog</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Toaster
        position="bottom-right"
        toastOptions={{
          success: {
            style: {
              background: '#10B981',
              color: '#fff',
              padding: '16px',
            },
          },
          error: {
            style: {
              background: '#EF4444',
              color: '#fff',
              padding: '16px',
            },
          },
        }}
      />
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{post?.title} - UI HUB</title>
        <meta name="description" content={post?.excerpt} />
        <meta name="keywords" content={`${post?.tags?.join(', ')}, UI design, UX research, frontend development`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${post?.title} - UI HUB`} />
        <meta property="og:description" content={post?.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="UI HUB" />
        <meta property="og:image" content={post?.coverImage} />
        <meta property="article:published_time" content={post?.publishedAt} />
        <meta property="article:author" content={post?.author?.name} />
        {post?.tags?.map(tag => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${post?.title} - UI HUB`} />
        <meta name="twitter:description" content={post?.excerpt} />
        <meta name="twitter:image" content={post?.coverImage} />
        <meta name="twitter:creator" content={post?.author?.twitter || '@uihub'} />

        {/* Other */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Helmet>

      {/* Auth Modal */}
      <Login 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onSignUpClick={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }} 
      />
      <SignUp
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onLoginClick={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />

      <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
        <Header cartItems={[]} />
        <main className="flex-1">
          <div className="container relative">
            {/* Hero Section */}
            <motion.div
              className="relative h-[400px] md:h-[600px] lg:h-[700px] rounded-lg overflow-hidden mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {post.featured_image && (
                <div className="absolute inset-0">
                  <img
                    src={post.featured_image}
                    alt={post.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                </div>
              )}
              <div className="relative h-full flex items-end pb-16">
                <motion.div 
                  className="w-full space-y-4 px-9"
                  variants={stagger}
                  initial="initial"
                  animate="animate"
                >
                  <motion.div variants={slideUp}>
                    <Badge className="bg-black/70 hover:bg-black/90 text-white shadow-sm backdrop-blur-sm border border-white/10 transition-all duration-200 text-xs font-medium px-2.5 py-1 rounded-md mb-4">{post.categories?.[0]?.category?.name || 'Uncategorized'}</Badge>
                  </motion.div>
                  <motion.h1 
                    className="text-4xl md:text-6xl font-bold tracking-tight leading-[100%] text-white"
                    variants={slideUp}
                  >
                    {post.title}
                  </motion.h1>
                  <motion.div 
                    className="flex items-center gap-4 text-muted-foreground"
                    variants={slideUp}
                  >
                    <div className="flex items-center gap-2 text-white">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.created_at)}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>

            {/* Content Section */}
            <div className="mx-auto">
              <motion.div
                className="prose prose-lg dark:prose-invert px-10 mt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <Separator className="mt-9 mb-16 bg-keyline dark:bg-keyline-dark" />

              {/* Post Actions */}
              <motion.div 
                className="py-32"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
               
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  {/* Author Info */}
                  <Link 
                    to="https://www.linkedin.com/in/alexandersstudio/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="group flex items-start gap-4 hover:opacity-90 transition-opacity"
                  >
                    <div className="relative">
                      <Avatar className="h-16 w-16 ring-2 ring-primary/10 group-hover:ring-primary/20 transition-all">
                        <AvatarImage 
                          src="/yoAlex.jpg" 
                          alt="Alexander UX Engineer" 
                          className="object-cover"
                        />
                        <AvatarFallback>AE</AvatarFallback>
                      </Avatar>
                      <motion.div 
                        className="absolute -bottom-1 -right-1 bg-primary text-white rounded-full p-1"
                        whileHover={{ scale: 1.1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Linkedin className="h-3 w-3" />
                      </motion.div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        Alexander UX Engineer
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                        Front-end developer passionate about creating beautiful and functional user experiences
                      </p>
                    </div>
                  </Link>

                  {/* Actions */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full relative group"
                        onClick={handleClap}
                        disabled={currentUser && userClaps > 0}
                        title={!currentUser ? 'Sign in to clap for this post' : userClaps > 0 ? 'You already clapped for this post' : 'Clap for this post'}
                      >
                        <motion.div
                          animate={isClapping ? { scale: [1, 1.2, 1] } : {}}
                          transition={{ duration: 0.2 }}
                          className="relative"
                        >
                          <HandMetal className={currentUser ? 'text-primary' : ''} />
                          {userClaps > 0 && (
                            <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {userClaps}
                            </span>
                          )}
                        </motion.div>
                      </Button>
                      <span className="text-sm text-muted-foreground">
                        {totalClaps} {totalClaps === 1 ? 'clap' : 'claps'}
                      </span>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full"
                        >
                          <Share2 className="text-muted-foreground hover:text-primary transition-colors" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuItem onClick={() => handleShare('email')}>
                          <Mail className="mr-2 h-4 w-4" />
                          <span>Share via email</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare('copy')}>
                          {hasCopied ? (
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="mr-2 h-4 w-4" />
                          )}
                          <span>{hasCopied ? 'Copied!' : 'Copy link'}</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>


              {/* Similar Posts Section */}
              <SimilarPosts 
                currentPostId={post?.id}
                categoryId={post?.categories?.[0]?.category_id}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogPostPage;