import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          firebase: ['firebase/app', 'firebase/auth'],
          supabase: ['@supabase/supabase-js'],
        },
      },
      // Excluir las importaciones problemáticas durante el build
      onwarn(warning, warn) {
        // Ignorar advertencias sobre módulos no encontrados para las rutas del backend
        if (warning.code === 'MODULE_NOT_FOUND' && 
            (warning.message.includes('backend/supabase/services/auth') ||
             warning.message.includes('backend/supabase/services/database') ||
             warning.message.includes('backend/supabase/config/supabase'))) {
          return;
        }
        warn(warning);
      }
    },
  },
});
