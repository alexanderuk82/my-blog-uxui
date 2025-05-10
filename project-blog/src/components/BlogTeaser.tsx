import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';
import { motion } from 'framer-motion';

const BlogTeaser: React.FC = () => {
  // Get only the latest 4 posts
  const latestPosts = blogPosts.slice(0, 4);
  
  // State for cursor position and visibility
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVariant, setCursorVariant] = useState('default');
  const [activePostId, setActivePostId] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  
  // Ref for the container element
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Check if device is mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Update mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top 
        });
      }
    };
    
    if (containerRef.current && !isMobile) {
      containerRef.current.addEventListener('mousemove', handleMouseMove);
    }
    
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, [isMobile]);
  
  // Cursor variants for Framer Motion
  const cursorVariants = {
    default: {
      opacity: 0,
      height: 0,
      width: 0,
      x: mousePosition.x,
      y: mousePosition.y,
      transition: {
        type: 'spring',
        mass: 0.6
      }
    },
    active: {
      opacity: 1,
      height: 180,
      width: 180,
      x: mousePosition.x - 90,
      y: mousePosition.y - 90,
      transition: {
        type: 'spring',
        mass: 0.6,
        damping: 30
      }
    }
  };
  
  // Handle mouse enter on post row
  const handleMouseEnter = (postId: number) => {
    if (!isMobile) {
      setCursorVariant('active');
      setActivePostId(postId);
    }
  };
  
  // Handle mouse leave on post row
  const handleMouseLeave = () => {
    if (!isMobile) {
      setCursorVariant('default');
      setActivePostId(null);
    }
  };
  
  // Get active post data
  const activePost = activePostId !== null ? blogPosts.find(post => post.id === activePostId) : null;
  
  return (
    <section id="blog" className="py-24 md:py-32 border-t border-keyline relative overflow-hidden">
      <div className="flex flex-col gap-12" ref={containerRef}>
        <div>
          <span className="text-sm uppercase tracking-wide font-medium">LATEST POSTS</span>
          <div className="w-24 h-px bg-black dark:bg-white mt-2"></div>
        </div>
        
        {!isMobile && (
          <motion.div
            className="custom-cursor pointer-events-none absolute z-10 rounded-full overflow-hidden flex items-center justify-center"
            variants={cursorVariants}
            animate={cursorVariant}
            initial="default"
          >
            {activePost && (
              <div className="relative w-full h-full">
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${activePost.image})` }}
                ></div>
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  {activePost.author && (
                    <div className="text-white text-center">
                      <div 
                        className="w-12 h-12 rounded-full bg-cover bg-center mx-auto mb-2" 
                        style={{ backgroundImage: `url(${activePost.author.avatar})` }}
                      ></div>
                      <p className="text-xs">{activePost.author.name}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
        
        <div className="overflow-hidden">
          <div className="w-full border-t border-keyline">
            {latestPosts.map((post, index) => (
              <div 
                key={post.id} 
                className={`group border-b border-keyline transition-colors ${index % 2 === 0 ? 'bg-surface/10' : ''}`}
                onMouseEnter={() => handleMouseEnter(post.id)}
                onMouseLeave={handleMouseLeave}
              >
                <a href={`/blog/${post.slug}`} className="block py-6 px-4 cursor-none md:cursor-default">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-medium group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {post.excerpt}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-6">
                      <div className="text-sm text-muted-foreground">{post.date}</div>
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <span>{post.readTime}</span>
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          <ArrowRight size={16} className="text-primary" />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-right">
            <a 
              href="/blog" 
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <span>View all posts</span>
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogTeaser;