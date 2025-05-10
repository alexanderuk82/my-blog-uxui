/**
 * Supabase Client Configuration
 * 
 * Este archivo inicializa y exporta el cliente Supabase para su uso en toda la aplicación.
 * Utiliza variables de entorno para la URL de Supabase y la clave anónima.
 */

import { createClient } from '@supabase/supabase-js';

// Las variables de entorno deben cargarse desde el archivo .env
// Para desarrollo, puedes reemplazar estos con tus valores reales
// Para producción, asegúrate de que estén configurados en tu entorno de despliegue
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Validar que las variables de entorno estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL and Anon Key must be provided in environment variables');
}

// Crear una única instancia del cliente Supabase para ser utilizada en toda la aplicación
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

export default supabase;
