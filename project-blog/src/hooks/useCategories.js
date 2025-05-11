/**
 * useCategories Hook
 * 
 * Custom hook for category related operations using React Query
 * Provides methods to fetch categories and related data
 */

import { useQuery } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';

const useCategories = () => {
  const { category } = useSupabase();

  /**
   * Fetch all categories
   */
  const useAllCategories = () => {
    return useQuery({
      queryKey: ['categories'],
      queryFn: () => category.getCategories(),
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };

  /**
   * Fetch a single category by ID
   */
  const useCategory = (id) => {
    return useQuery({
      queryKey: ['category', id],
      queryFn: () => category.getCategoryById(id),
      enabled: !!id,
      staleTime: 1000 * 60 * 10, // 10 minutes
    });
  };

  return {
    useAllCategories,
    useCategory,
  };
};

export default useCategories;
