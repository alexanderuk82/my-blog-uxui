import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';

const useAds = (position) => {
  return useQuery({
    queryKey: ['ads', position],
    queryFn: async () => {
      try {
        // Primero, verificar si la tabla existe
        const { data: tables, error: tablesError } = await supabase
          .from('ads')
          .select('count');

        if (tablesError) {
          console.error('Error checking ads table:', tablesError);
          return null;
        }

        // Si llegamos aquí, la tabla existe, hacer la consulta real
        const { data, error } = await supabase
          .from('ads')
          .select('*')
          .eq('position', position)
          .limit(1)
          .single();

        if (error) {
          console.error('Error fetching ad:', error);
          return null;
        }

        console.log('Ad data:', data); // Para depuración
        return data;
      } catch (err) {
        console.error('Unexpected error:', err);
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    cacheTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
  });
};

export default useAds;
