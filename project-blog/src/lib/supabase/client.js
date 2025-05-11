/**
 * Supabase Client Integration
 * 
 * This file provides a client-side integration with Supabase.
 * It imports the services from the local services and makes them available to the React components.
 */

import { createClient } from '@supabase/supabase-js';
import authService from '../../services/supabase/auth';
import databaseService, { categoryService, featuredService } from '../../services/supabase/database';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided in environment variables');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Hook up Firebase Auth with Supabase
 * This should be called when the app initializes
 */
export const initSupabaseIntegration = () => {
  return authService.setupAuthSync();
};

/**
 * Blog services for React components
 */
export const blogService = {
  /**
   * Get all blog posts with pagination
   */
  getPosts: async (page = 1, limit = 10) => {
    return databaseService.blog.getPosts(page, limit);
  },
  
  /**
   * Get a single blog post by slug
   */
  getPostBySlug: async (slug) => {
    return databaseService.blog.getPostBySlug(slug);
  },
  
  /**
   * Get admin-only blog posts (including unpublished)
   * Requires admin access
   */
  getAdminPosts: async (page = 1, limit = 10) => {
    return databaseService.blog.getPosts(page, limit, true);
  },
  
  /**
   * Create a new blog post
   * Requires admin access
   */
  createPost: async (postData) => {
    return databaseService.blog.createPost(postData);
  },
  
  /**
   * Update an existing blog post
   * Requires admin access
   */
  updatePost: async (id, postData) => {
    return databaseService.blog.updatePost(id, postData);
  },
  
  /**
   * Delete a blog post
   * Requires admin access
   */
  deletePost: async (id) => {
    return databaseService.blog.deletePost(id);
  }
};

/**
 * Product services for React components
 */
export const productService = {
  /**
   * Get all products with pagination
   */
  getProducts: async (page = 1, limit = 12) => {
    return databaseService.product.getProducts(page, limit);
  },
  
  /**
   * Get a single product by slug
   */
  getProductBySlug: async (slug) => {
    return databaseService.product.getProductBySlug(slug);
  },
  
  /**
   * Create a new product
   * Requires admin access
   */
  createProduct: async (productData) => {
    return databaseService.product.createProduct(productData);
  },
  
  /**
   * Update an existing product
   * Requires admin access
   */
  updateProduct: async (id, productData) => {
    return databaseService.product.updateProduct(id, productData);
  },
  
  /**
   * Delete a product
   * Requires admin access
   */
  deleteProduct: async (id) => {
    return databaseService.product.deleteProduct(id);
  }
};

/**
 * User profile services for React components
 */
export const profileService = {
  /**
   * Get the current user's profile
   */
  getCurrentProfile: async (firebaseUid) => {
    return authService.getCurrentUserProfile(firebaseUid);
  },
  
  /**
   * Update the current user's profile
   */
  updateProfile: async (firebaseUid, profileData) => {
    return authService.updateUserProfile(firebaseUid, profileData);
  },
  
  /**
   * Check if the current user has admin access
   */
  checkAdminAccess: async (email) => {
    return authService.checkAdminAccess(email);
  }
};

/**
 * Order services for React components
 */
export const orderService = {
  /**
   * Create a new order
   */
  createOrder: async (orderData) => {
    return databaseService.order.createOrder(orderData);
  },
  
  /**
   * Get orders for the current user
   */
  getUserOrders: async (userId) => {
    return databaseService.order.getUserOrders(userId);
  }
};

/**
 * Category services for React components
 */
export const categoryServiceClient = categoryService || {
  /**
   * Get all categories
   */
  getCategories: async () => {
    return databaseService.category.getCategories();
  },
  
  /**
   * Get a single category by ID
   */
  getCategoryById: async (id) => {
    return databaseService.category.getCategoryById(id);
  }
};

/**
 * Featured content services for React components
 */
export const featuredServiceClient = featuredService || {
  /**
   * Get featured posts
   */
  getFeaturedPosts: async (limit = 3) => {
    return databaseService.featured.getFeaturedPosts(limit);
  }
};

// Export all services and the Supabase client
export default {
  supabase,
  initSupabaseIntegration,
  blog: blogService,
  product: productService,
  profile: profileService,
  order: orderService,
  category: categoryServiceClient,
  featured: featuredServiceClient
};
