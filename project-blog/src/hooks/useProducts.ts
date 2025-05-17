import { useQuery } from '@tanstack/react-query';

import { supabase } from '../lib/supabase/supabase';

export interface ProductImage {
  id: string;
  image_url: string;
  order_index: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image_url?: string; // Mantenemos por compatibilidad
  images?: ProductImage[]; // Nueva propiedad para múltiples imágenes
  tags: string[];
  category?: string;
  is_free: boolean;
  published: boolean;
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
  seo?: {
    title?: string;
    description?: string;
    keywords?: string[];
  };
  brand?: {
    name: string;
    url?: string;
  };
  stock_status?: 'in_stock' | 'out_of_stock' | 'pre_order';
}

const fetchProducts = async (): Promise<Product[]> => {
  // Obtener productos
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select('*')
    .eq('published', true)
    .order('created_at', { ascending: false });

  if (productsError) throw productsError;
  if (!products) return [];

  // Obtener imágenes para todos los productos
  const productIds = products.map((p: Product) => p.id);
  const { data: images, error: imagesError } = await supabase
    .from('product_images')
    .select('id, image_url, order_index, is_primary, product_id')
    .in('product_id', productIds)
    .order('order_index');

  if (imagesError) throw imagesError;

  // Combinar productos con sus imágenes
  const productsWithImages = products.map((product: Product) => ({
    ...product,
    images: images?.filter((img: ProductImage & { product_id: string }) => 
      img.product_id === product.id
    ) || []
  }));

  return productsWithImages;
};

const useProducts = () => {
  const { data: products, isLoading, error } = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false
  });

  return {
    products,
    isLoading,
    error
  };
};

export default useProducts;
