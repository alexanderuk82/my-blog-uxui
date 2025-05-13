import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import { Calendar } from 'lucide-react';
import { formatDate } from '../../lib/blogUtils';
import useFilteredPosts from '../../hooks/useFilteredPosts';

const SimilarPosts = ({ currentPostId, categoryId }) => {
  const { data, isLoading, error } = useFilteredPosts({
    selectedCategory: categoryId,
    excludePostId: currentPostId,
    limit: 4,
    activeFilter: 'mixed'
  }, {
    // Forzar refresco cuando cambie el post o la categoría
    cacheTime: 0,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false
  });

  const similarPosts = data?.posts || [];

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (error) {
    return null; // Silently fail if there's an error
  }

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Similar Posts</h2>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {isLoading ? (
          // Loading skeletons
          [...Array(4)].map((_, index) => (
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
          ))
        ) : similarPosts.length > 0 ? (
          // Render similar posts
          similarPosts.map((post) => (
            <motion.div key={post.id} variants={item}>
              <Link to={`/blog/${post.slug}`}>
                <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                  <div className="relative">
                    <img
                      src={post.featured_image || 'https://via.placeholder.com/600x400?text=No+Image'}
                      alt={post.title}
                      className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {post.categories?.[0]?.category && (
                      <Badge className="absolute top-4 left-4">
                        {post.categories[0].category.name}
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                      <Calendar className="mr-2 h-4 w-4" />
                      {formatDate(post.published_at || post.created_at)}
                    </div>
                    <h3 className="text-lg font-semibold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2">
                      {post.excerpt}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">
            No similar posts found
          </p>
        )}
      </motion.div>
    </section>
  );
};

export default SimilarPosts;
