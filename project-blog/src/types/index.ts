export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
}

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  slug: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}