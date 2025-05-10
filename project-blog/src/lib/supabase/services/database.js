/**
 * Database Service
 * 
 * Este servicio proporciona métodos para interactuar con las tablas de la base de datos de Supabase.
 * Abstrae las llamadas directas al cliente Supabase para proporcionar una API más limpia.
 */

import supabase from '../config/supabase';

/**
 * Servicios para Posts del Blog
 */
export const blogService = {
  /**
   * Obtener todos los posts del blog con paginación opcional
   * @param {number} page - Número de página (comenzando desde 1)
   * @param {number} limit - Número de elementos por página
   * @param {boolean} includeUnpublished - Si se deben incluir posts no publicados (solo admin)
   * @returns {Promise} - Promesa que resuelve a los datos de los posts del blog
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
      .order('created_at', { ascending: false });
    
    // Solo incluir posts publicados a menos que se especifique lo contrario
    if (!includeUnpublished) {
      query = query.eq('published', true);
    }
    
    const { data, error, count } = await query
      .range(startIndex, endIndex)
      .select('*', { count: 'exact' });
    
    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
    
    return {
      posts: data,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    };
  },
  
  /**
   * Obtener un solo post del blog por slug
   * @param {string} slug - El slug del post
   * @returns {Promise} - Promesa que resuelve a los datos del post del blog
   */
  getPostBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          categories(*),
          author:profiles(*)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) {
        console.error('Error fetching post by slug:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getPostBySlug:', error);
      throw error;
    }
  },
  
  /**
   * Crear un nuevo post del blog
   * @param {Object} postData - Los datos del post
   * @returns {Promise} - Promesa que resuelve al post creado
   */
  createPost: async (postData) => {
    try {
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
    } catch (error) {
      console.error('Error in createPost:', error);
      throw error;
    }
  },
  
  /**
   * Actualizar un post del blog existente
   * @param {string} id - El ID del post
   * @param {Object} postData - Los datos actualizados del post
   * @returns {Promise} - Promesa que resuelve al post actualizado
   */
  updatePost: async (id, postData) => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating post:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updatePost:', error);
      throw error;
    }
  },
  
  /**
   * Eliminar un post del blog
   * @param {string} id - El ID del post
   * @returns {Promise} - Promesa que resuelve cuando el post es eliminado
   */
  deletePost: async (id) => {
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting post:', error);
        throw error;
      }
      
      return { success: true, id };
    } catch (error) {
      console.error('Error in deletePost:', error);
      throw error;
    }
  }
};

/**
 * Servicios para Productos
 */
export const productService = {
  /**
   * Obtener todos los productos con paginación opcional
   * @param {number} page - Número de página (comenzando desde 1)
   * @param {number} limit - Número de elementos por página
   * @returns {Promise} - Promesa que resuelve a los datos de los productos
   */
  getProducts: async (page = 1, limit = 12) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;
    
    try {
      const { data, error, count } = await supabase
        .from('products')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(startIndex, endIndex);
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      
      return {
        products: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      };
    } catch (error) {
      console.error('Error in getProducts:', error);
      throw error;
    }
  },
  
  /**
   * Obtener un solo producto por slug
   * @param {string} slug - El slug del producto
   * @returns {Promise} - Promesa que resuelve a los datos del producto
   */
  getProductBySlug: async (slug) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(*)
        `)
        .eq('slug', slug)
        .single();
      
      if (error) {
        console.error('Error fetching product by slug:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getProductBySlug:', error);
      throw error;
    }
  },
  
  /**
   * Crear un nuevo producto
   * @param {Object} productData - Los datos del producto
   * @returns {Promise} - Promesa que resuelve al producto creado
   */
  createProduct: async (productData) => {
    try {
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
    } catch (error) {
      console.error('Error in createProduct:', error);
      throw error;
    }
  },
  
  /**
   * Actualizar un producto existente
   * @param {string} id - El ID del producto
   * @param {Object} productData - Los datos actualizados del producto
   * @returns {Promise} - Promesa que resuelve al producto actualizado
   */
  updateProduct: async (id, productData) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating product:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      throw error;
    }
  },
  
  /**
   * Eliminar un producto
   * @param {string} id - El ID del producto
   * @returns {Promise} - Promesa que resuelve cuando el producto es eliminado
   */
  deleteProduct: async (id) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting product:', error);
        throw error;
      }
      
      return { success: true, id };
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      throw error;
    }
  }
};

/**
 * Servicios para Perfiles de Usuario
 */
export const profileService = {
  /**
   * Obtener perfil de usuario por ID
   * @param {string} userId - El ID del usuario
   * @returns {Promise} - Promesa que resuelve a los datos del perfil de usuario
   */
  getProfile: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('firebase_uid', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      throw error;
    }
  },
  
  /**
   * Crear o actualizar un perfil de usuario
   * @param {Object} profileData - Los datos del perfil
   * @returns {Promise} - Promesa que resuelve al perfil creado/actualizado
   */
  upsertProfile: async (profileData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'firebase_uid' })
        .select()
        .single();
      
      if (error) {
        console.error('Error upserting profile:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in upsertProfile:', error);
      throw error;
    }
  }
};

/**
 * Servicios para Pedidos
 */
export const orderService = {
  /**
   * Crear un nuevo pedido
   * @param {Object} orderData - Los datos del pedido
   * @returns {Promise} - Promesa que resuelve al pedido creado
   */
  createOrder: async (orderData) => {
    try {
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
    } catch (error) {
      console.error('Error in createOrder:', error);
      throw error;
    }
  },
  
  /**
   * Obtener pedidos para un usuario
   * @param {string} userId - El ID del usuario
   * @returns {Promise} - Promesa que resuelve a los pedidos del usuario
   */
  getUserOrders: async (userId) => {
    try {
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
        console.error('Error fetching user orders:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in getUserOrders:', error);
      throw error;
    }
  }
};

// Exportar todos los servicios
export default {
  blog: blogService,
  product: productService,
  profile: profileService,
  order: orderService
};
