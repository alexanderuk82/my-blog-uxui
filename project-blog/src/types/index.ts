export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  image_url?: string;
  tags: string[];
  is_free: boolean;
  published: boolean;
  stripe_product_id?: string;
  stripe_price_id?: string;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  slug: string;
  image?: string;
  author?: {
    name: string;
    avatar?: string;
  };
}

export interface CartItem {
  product: Product;
  quantity: number;
}