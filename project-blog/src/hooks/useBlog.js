/**
 * useBlog Hook
 * 
 * Custom hook for blog related operations using React Query
 * Provides methods to fetch blog posts, individual posts, and related data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const useBlog = () => {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  /**
   * Fetch all blog posts with pagination
   */
  const usePosts = (page = 1, limit = 10) => {
    return useQuery({
      queryKey: ['posts', page, limit],
      queryFn: async () => {
        const { data: posts, error } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })
          .range((page - 1) * limit, page * limit - 1);

        if (error) throw error;
        return posts;
      },
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  /**
   * Fetch a single blog post by slug
   */
  const usePost = (slug) => {
    console.log('usePost - slug:', slug);
    return useQuery({
      queryKey: ['post', slug],
      queryFn: async () => {
        if (!slug) return null;

        console.log('Fetching post with slug:', slug);
        const { data, error } = await supabase
          .from('posts')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          throw error;
        }

        if (!data) {
          console.error('Post not found for slug:', slug);
          throw new Error('Post not found');
        }

        console.log('Post data found:', data);
        return data;
      },
      enabled: !!slug,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  /**
   * Create a new blog post
   */
  const useCreatePost = () => {
    return useMutation({
      mutationFn: (postData) => blog.createPost(postData),
      onSuccess: () => {
        // Invalidate the posts query to refetch
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    });
  };

  /**
   * Update an existing blog post
   */
  const useUpdatePost = () => {
    return useMutation({
      mutationFn: ({ id, postData }) => blog.updatePost(id, postData),
      onSuccess: (data) => {
        // Invalidate both the posts list and the individual post queries
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        if (data?.slug) {
          queryClient.invalidateQueries({ queryKey: ['post', data.slug] });
        }
      }
    });
  };

  /**
   * Delete a blog post
   */
  const useDeletePost = () => {
    return useMutation({
      mutationFn: (id) => blog.deletePost(id),
      onSuccess: () => {
        // Invalidate the posts query to refetch
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    });
  };

  const useClaps = (postId) => {
    console.log('useClaps - postId:', postId, typeof postId);
    if (!postId) console.warn('No postId provided to useClaps');
    const queryKey = ['claps', postId];

    // Get total claps
    const { data: totalClaps = 0 } = useQuery({
      queryKey: [...queryKey, 'total'],
      queryFn: async () => {
        if (!postId) return 0;

        const { data, error } = await supabase
          .from('user_post_interactions')
          .select('claps')
          .eq('post_id', postId);

        if (error) {
          console.error('Error fetching total claps:', error);
          return 0;
        }
        return data?.reduce((sum, row) => sum + (row.claps || 0), 0) || 0;
      },
      enabled: !!postId,
      staleTime: 1000 * 60 // 1 minute
    });

    // Get user claps
    const { data: userClaps = 0 } = useQuery({
      queryKey: [...queryKey, 'user'],
      queryFn: async () => {
        if (!currentUser?.uid || !postId) return 0;

        const { data, error } = await supabase
          .from('user_post_interactions')
          .select('claps')
          .eq('post_id', postId)
          .eq('user_id', currentUser.uid)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user claps:', error);
          return 0;
        }
        return data?.claps || 0;
      },
      enabled: !!postId && !!currentUser?.uid,
      staleTime: 1000 * 60 // 1 minute
    });

    // Mutation to add clap
    const { mutateAsync: addClap } = useMutation({
      onMutate: () => {
        console.log('Starting clap mutation - postId:', postId, 'userId:', currentUser?.uid);
      },
      mutationFn: async () => {
        if (!currentUser?.uid) {
          throw new Error('Please sign in to clap');
        }

        if (!postId) {
          throw new Error('Invalid post');
        }

        const newCount = (userClaps || 0) + 1;
        if (newCount > 50) {
          throw new Error('Maximum claps reached (50)');
        }

        console.log('Attempting to add clap - postId:', postId, 'userId:', currentUser.uid);

        // Primero verificamos si existe el registro
        const { data: existingData, error: checkError } = await supabase
          .from('user_post_interactions')
          .select('claps')
          .eq('post_id', postId)
          .eq('user_id', currentUser.uid)
          .maybeSingle();

        if (checkError) {
          console.error('Error checking existing claps:', checkError);
          throw checkError;
        }

        if (existingData) {
          // Actualizar registro existente
          const { data: updatedData, error: updateError } = await supabase
            .from('user_post_interactions')
            .update({ claps: newCount })
            .eq('post_id', postId)
            .eq('user_id', currentUser.uid)
            .select()
            .single();

          if (updateError) {
            console.error('Error updating claps:', updateError);
            throw updateError;
          }

          console.log('Successfully updated claps:', updatedData);
          return updatedData;
        } else {
          // Crear nuevo registro
          const { data: newData, error: insertError } = await supabase
            .from('user_post_interactions')
            .insert({
              post_id: postId,
              user_id: currentUser.uid,
              claps: 1
            })
            .select()
            .single();

          if (insertError) {
            console.error('Error inserting clap:', insertError);
            throw insertError;
          }

          console.log('Successfully inserted clap:', newData);
          return newData;
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries(queryKey);
      },
      onError: (error) => {
        console.error('Error adding clap:', error);
      },
    });

    return {
      totalClaps,
      userClaps,
      addClap,
      isAuthenticated: !!currentUser?.uid
    };
  };

  return {
    usePost,
    usePosts,
    useCreatePost,
    useUpdatePost,
    useDeletePost,
    useClaps
  };
};

export default useBlog;
