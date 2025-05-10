/**
 * Supabase Client Integration
 * 
 * This file provides a client-side integration with Supabase.
 * It imports the services from the backend and makes them available to the React components.
 */

import { createClient } from '@supabase/supabase-js';

// En lugar de importar directamente los servicios del backend, vamos a crear
// versiones simplificadas de estos servicios que funcionarán en Netlify

// Servicios de autenticación simplificados
const authService = {
  // Función para verificar si un usuario es administrador
  async checkAdminAccess(email) {
    if (!email) return { data: null, error: new Error('Email is required') };
    
    // Crear una instancia de supabase para esta operación
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    try {
      // Consultar la tabla admin_users para verificar si el email está registrado
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      console.error('Error checking admin access:', error);
      return { data: null, error };
    }
  },
  
  // Función para sincronizar un usuario de Firebase con Supabase
  async syncUserWithSupabase(firebaseUser) {
    if (!firebaseUser) return { data: null, error: new Error('Firebase user is required') };
    
    // Crear una instancia de supabase para esta operación
    const supabase = createClient(
      import.meta.env.VITE_SUPABASE_URL,
      import.meta.env.VITE_SUPABASE_ANON_KEY
    );
    
    try {
      // Verificar si el usuario ya existe en Supabase
      const { data: existingUser, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', firebaseUser.uid)
        .maybeSingle();
      
      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      // Si el usuario no existe, crearlo
      if (!existingUser) {
        const { data: newUser, error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              firebase_uid: firebaseUser.uid,
              email: firebaseUser.email,
              display_name: firebaseUser.displayName || '',
              photo_url: firebaseUser.photoURL || '',
              created_at: new Date().toISOString()
            }
          ])
          .select()
          .single();
        
        if (insertError) throw insertError;
        
        return { data: newUser, error: null };
      }
      
      // Si el usuario existe, actualizar sus datos si es necesario
      const { data: updatedUser, error: updateError } = await supabase
        .from('profiles')
        .update({
          email: firebaseUser.email,
          display_name: firebaseUser.displayName || existingUser.display_name,
          photo_url: firebaseUser.photoURL || existingUser.photo_url,
          last_sign_in: new Date().toISOString()
        })
        .eq('firebase_uid', firebaseUser.uid)
        .select()
        .single();
      
      if (updateError) throw updateError;
      
      return { data: updatedUser, error: null };
    } catch (error) {
      console.error('Error syncing user with Supabase:', error);
      return { data: null, error };
    }
  }
};

// Servicios de base de datos simplificados
const databaseService = {
  // Implementación básica para el entorno de producción
  // Estas funciones se ampliarán según sea necesario
};

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

// Export all services and the Supabase client
export default {
  supabase,
  initSupabaseIntegration,
  blog: blogService,
  product: productService,
  profile: profileService,
  order: orderService
};
