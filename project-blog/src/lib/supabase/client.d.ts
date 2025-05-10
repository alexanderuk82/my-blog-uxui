/**
 * Type definitions for Supabase client
 */

import { SupabaseClient } from '@supabase/supabase-js';

export interface BlogService {
  getPosts: (page?: number, limit?: number) => Promise<any[]>;
  getPostBySlug: (slug: string) => Promise<any>;
  getAdminPosts: (page?: number, limit?: number) => Promise<any[]>;
  createPost: (postData: any) => Promise<any>;
  updatePost: (id: string, postData: any) => Promise<any>;
  deletePost: (id: string) => Promise<boolean>;
}

export interface ProductService {
  getProducts: (page?: number, limit?: number) => Promise<any[]>;
  getProductBySlug: (slug: string) => Promise<any>;
  createProduct: (productData: any) => Promise<any>;
  updateProduct: (id: string, productData: any) => Promise<any>;
  deleteProduct: (id: string) => Promise<boolean>;
}

export interface ProfileService {
  getCurrentProfile: (firebaseUid: string) => Promise<any>;
  updateProfile: (firebaseUid: string, profileData: any) => Promise<any>;
  checkAdminAccess: (email: string) => Promise<boolean>;
}

export interface OrderService {
  createOrder: (orderData: any) => Promise<any>;
  getUserOrders: (userId: string) => Promise<any[]>;
}

export interface SupabaseServices {
  supabase: SupabaseClient;
  initSupabaseIntegration: () => (() => void) | undefined;
  blog: BlogService;
  product: ProductService;
  profile: ProfileService;
  order: OrderService;
}

export const initSupabaseIntegration: () => (() => void) | undefined;
export const blogService: BlogService;
export const productService: ProductService;
export const profileService: ProfileService;
export const orderService: OrderService;

declare const supabaseClient: SupabaseServices;
export default supabaseClient;
