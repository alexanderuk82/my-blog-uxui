// SeoContext.d.ts
import { ReactNode } from 'react';

export interface MetaData {
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article' | 'product';
  url: string;
  structuredData?: Record<string, any>;
}

export interface SeoContextType {
  updateMetaImage: (imageUrl: string) => void;
  updateMetaData: (data: Partial<MetaData>) => void;
}

export interface SeoProviderProps {
  children: ReactNode;
}
