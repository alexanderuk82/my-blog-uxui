import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

const useFilteredPosts = (options) => {
  const {
    searchQuery = '',
    selectedCategory = 'all',
    activeFilter = 'latest',
    page = 1,
    limit = 20,
    excludePostId = null
  } = options;

  return useQuery({
    queryKey: ['filtered-posts', searchQuery, selectedCategory, activeFilter, page, limit, excludePostId],
    queryFn: async () => {
      try {
        // Get posts with their categories
        let query = supabase
          .from('posts')
          .select(`
            *,
            author:profiles(*),
            categories:posts_categories(category:categories(*))
          `, { count: 'exact' })
          .eq('published', true);

        // Apply category filter
        if (selectedCategory !== 'all') {
          const categoryQuery = supabase
            .from('posts_categories')
            .select('post_id')
            .eq('category_id', selectedCategory);

          const { data: categoryPosts } = await categoryQuery;
          const postIds = categoryPosts?.map(cp => cp.post_id) || [];
          query = query.in('id', postIds);
        }

        // Apply search filter if present
        if (searchQuery) {
          query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%,excerpt.ilike.%${searchQuery}%`);
        }

        // Exclude specific post if needed
        if (excludePostId) {
          query = query.neq('id', excludePostId);
        }

        // Apply sorting based on filter
        if (activeFilter === 'mixed' && selectedCategory !== 'all') {
          // Primero, obtener todos los posts de la categoría excepto el actual
          const { data: allCategoryPosts } = await supabase
            .from('posts')
            .select('id')
            .eq('posts_categories.category_id', selectedCategory)
            .neq('id', excludePostId);

          // Obtener IDs aleatorios de la categoría
          const randomCategoryIds = allCategoryPosts
            ?.sort(() => Math.random() - 0.5)
            ?.slice(0, Math.ceil(limit / 2))
            ?.map(p => p.id) || [];

          // Obtener los posts completos para los IDs aleatorios
          const { data: categoryPosts } = await supabase
            .from('posts')
            .select(`
              *,
              author:profiles(*),
              categories:posts_categories(category:categories(*))
            `)
            .in('id', randomCategoryIds);

          // Obtener posts aleatorios que no sean de la categoría
          const { data: allOtherPosts } = await supabase
            .from('posts')
            .select('id')
            .neq('id', excludePostId)
            .not('id', 'in', randomCategoryIds.length > 0 ? `(${randomCategoryIds.join(',')})` : '(0)');

          // Obtener IDs aleatorios de otros posts
          const randomOtherIds = allOtherPosts
            ?.sort(() => Math.random() - 0.5)
            ?.slice(0, Math.floor(limit / 2))
            ?.map(p => p.id) || [];

          // Obtener los posts completos para los IDs aleatorios
          const { data: popularPosts } = await supabase
            .from('posts')
            .select(`
              *,
              author:profiles(*),
              categories:posts_categories(category:categories(*))
            `)
            .in('id', randomOtherIds);

          return {
            posts: [...(categoryPosts || []), ...(popularPosts || [])],
            count: (categoryPosts?.length || 0) + (popularPosts?.length || 0)
          };
        } else if (activeFilter === 'latest') {
          query = query.order('published_at', { ascending: false });
        } else if (activeFilter === 'popular') {
          query = query.order('views', { ascending: false });
        }

        // Apply pagination
        const from = (page - 1) * limit;
        const to = from + limit - 1;
        query = query.range(from, to);

        // Execute the main query
        const { data: posts, error, count } = await query;

        if (error) {
          throw error;
        }

        // Get popular posts separately
        const { data: popularPosts, error: popularError } = await supabase
          .from('posts')
          .select(`
            *,
            author:profiles(*),
            categories:posts_categories(category:categories(*))
          `)
          .eq('published', true)
          .order('views', { ascending: false })
          .limit(5);

        if (popularError) {
          console.error('Error fetching popular posts:', popularError);
        }

        return {
          posts: posts || [],
          total: count || 0,
          popular: popularPosts || []
        };
      } catch (error) {
        console.error('Error in useFilteredPosts:', error);
        throw error;
      }
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5 // 5 minutes
  });
};

export default useFilteredPosts;
