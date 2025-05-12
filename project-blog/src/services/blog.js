/**
 * Blog Service
 * Handles all blog-related API calls to Supabase
 */

import { supabase } from './supabase';

export const blogService = {
  /**
   * Get all blog posts with pagination
   */
  async getPosts(page = 1, limit = 10) {
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
      .from('posts')
      .select('*', { count: 'exact' })
      .order('published_at', { ascending: false })
      .range(start, end);

    if (error) throw error;

    return {
      posts: data,
      total: count,
      currentPage: page,
      totalPages: Math.ceil(count / limit)
    };
  },

  /**
   * Get a single blog post by slug
   */
  async getPostBySlug(slug) {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:user_id (
          id,
          name,
          avatar_url,
          role,
          bio
        ),
        categories (
          id,
          name,
          slug
        )
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Get related posts based on categories and tags
   */
  async getRelatedPosts(slug, limit = 4) {
    // First get the current post's categories
    const { data: currentPost, error: postError } = await supabase
      .from('posts')
      .select('id, category_ids')
      .eq('slug', slug)
      .single();

    if (postError) throw postError;

    // Then get posts with similar categories, excluding the current post
    const { data: relatedPosts, error: relatedError } = await supabase
      .from('posts')
      .select(`
        id,
        title,
        slug,
        excerpt,
        cover_image,
        category,
        published_at
      `)
      .contains('category_ids', currentPost.category_ids)
      .neq('id', currentPost.id)
      .order('published_at', { ascending: false })
      .limit(limit);

    if (relatedError) throw relatedError;
    return relatedPosts;
  },

  /**
   * Create a new blog post
   */
  async createPost(postData) {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing blog post
   */
  async updatePost(id, postData) {
    const { data, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a blog post
   */
  async deletePost(id) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default blogService;
