/**
 * Database Service
 * 
 * This service provides methods for interacting with Supabase database tables.
 * It abstracts away the direct Supabase client calls to provide a cleaner API.
 */

import supabase from '../config/supabase';

/**
 * Blog Post Services
 */
export const blogService = {
  /**
   * Get all blog posts with optional pagination
   * @param {number} page - Page number (starting from 1)
   * @param {number} limit - Number of items per page
   * @param {boolean} includeUnpublished - Whether to include unpublished posts (admin only)
   * @returns {Promise} - Promise resolving to blog posts data
   */
  getPosts: async (page = 1, limit = 10, includeUnpublished = false) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;
    
    let query = supabase
      .from('posts')
      .select(`
        *,
        categories(*),
        author:profiles(*)
      `)
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);
    
    // Only return published posts unless specifically requested
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Get a single blog post by slug
   * @param {string} slug - The post slug
   * @returns {Promise} - Promise resolving to blog post data
   */
  getPostBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        categories(*),
        author:profiles(*),
        comments(*)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching post with slug ${slug}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Create a new blog post
   * @param {Object} postData - The post data
   * @returns {Promise} - Promise resolving to the created post
   */
  createPost: async (postData) => {
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update an existing blog post
   * @param {string} id - The post ID
   * @param {Object} postData - The updated post data
   * @returns {Promise} - Promise resolving to the updated post
   */
  updatePost: async (id, postData) => {
    const { data, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating post ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Delete a blog post
   * @param {string} id - The post ID
   * @returns {Promise} - Promise resolving when the post is deleted
   */
  deletePost: async (id) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting post ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};

/**
 * Product Services
 */
export const productService = {
  /**
   * Get all products with optional pagination
   * @param {number} page - Page number (starting from 1)
   * @param {number} limit - Number of items per page
   * @returns {Promise} - Promise resolving to products data
   */
  getProducts: async (page = 1, limit = 12) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;
    
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(*)
      `)
      .order('created_at', { ascending: false })
      .range(startIndex, endIndex);
    
    if (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Get a single product by slug
   * @param {string} slug - The product slug
   * @returns {Promise} - Promise resolving to product data
   */
  getProductBySlug: async (slug) => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(*),
        reviews(*)
      `)
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Create a new product
   * @param {Object} productData - The product data
   * @returns {Promise} - Promise resolving to the created product
   */
  createProduct: async (productData) => {
    const { data, error } = await supabase
      .from('products')
      .insert(productData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating product:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Update an existing product
   * @param {string} id - The product ID
   * @param {Object} productData - The updated product data
   * @returns {Promise} - Promise resolving to the updated product
   */
  updateProduct: async (id, productData) => {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating product ${id}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Delete a product
   * @param {string} id - The product ID
   * @returns {Promise} - Promise resolving when the product is deleted
   */
  deleteProduct: async (id) => {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Error deleting product ${id}:`, error);
      throw error;
    }
    
    return true;
  }
};

/**
 * User Profile Services
 */
export const profileService = {
  /**
   * Get user profile by ID
   * @param {string} userId - The user ID
   * @returns {Promise} - Promise resolving to user profile data
   */
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error(`Error fetching profile for user ${userId}:`, error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Create or update a user profile
   * @param {Object} profileData - The profile data
   * @returns {Promise} - Promise resolving to the created/updated profile
   */
  upsertProfile: async (profileData) => {
    const { data, error } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();
    
    if (error) {
      console.error('Error upserting profile:', error);
      throw error;
    }
    
    return data;
  }
};

/**
 * Order Services
 */
export const orderService = {
  /**
   * Create a new order
   * @param {Object} orderData - The order data
   * @returns {Promise} - Promise resolving to the created order
   */
  createOrder: async (orderData) => {
    const { data, error } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();
    
    if (error) {
      console.error('Error creating order:', error);
      throw error;
    }
    
    return data;
  },
  
  /**
   * Get orders for a user
   * @param {string} userId - The user ID
   * @returns {Promise} - Promise resolving to user's orders
   */
  getUserOrders: async (userId) => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items(
          *,
          product:products(*)
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error(`Error fetching orders for user ${userId}:`, error);
      throw error;
    }
    
    return data;
  }
};

// Export all services
export default {
  blog: blogService,
  product: productService,
  profile: profileService,
  order: orderService
};
