// BlogPost.d.ts
export interface Author {
  id?: string;
  display_name?: string;
  name?: string;
  avatar_url?: string;
  avatar?: string;
  bio?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  image?: string; // For legacy support
  published: boolean;
  published_at?: string;
  created_at: string;
  updated_at: string;
  meta_title?: string;
  meta_description?: string;
  views?: number;
  read_time?: string;
  date?: string; // For legacy support
  author?: Author;
  categories?: Category[];
  tags?: { id: string; name: string; slug: string }[];
}
