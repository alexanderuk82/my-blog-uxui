/**
 * useFeatured Hook
 * 
 * Custom hook for featured content operations using React Query
 * Provides methods to fetch featured posts and related data
 */

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';

const useFeatured = () => {
  const { featured } = useSupabase();

  /**
   * Fetch featured posts
   */
  const useFeaturedPosts = (limit = 3) => {
    return useQuery({
      queryKey: ['featuredPosts', limit],
      queryFn: () => featured.getFeaturedPosts(limit),
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  return {
    useFeaturedPosts,
  };
};

export default useFeatured;
