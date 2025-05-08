import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Helmet } from 'react-helmet-async';

interface MetaData {
  title: string;
  description: string;
  image: string;
  type: 'website' | 'article' | 'product';
  url: string;
  structuredData?: Record<string, any>;
}

interface SeoContextType {
  updateMetaImage: (imageUrl: string) => void;
  updateMetaData: (data: Partial<MetaData>) => void;
}

interface SeoProviderProps {
  children: ReactNode;
}

export const SeoContext = createContext<SeoContextType | undefined>(undefined);

export const SeoProvider: React.FC<SeoProviderProps> = ({ children }) => {
  const initialMetaData: MetaData = {
    title: 'UI HUB - Digital Components and Resources',
    description: 'Discover high-quality UI components, digital resources, and design inspiration for your next web project.',
    image: '/images/og-image.jpg',
    type: 'website',
    url: typeof window !== 'undefined' ? window.location.href : ''
  };

  const [metaData, setMetaData] = useState(initialMetaData);

  const updateMetaImage = useCallback((imageUrl: string) => {
    setMetaData(prev => ({ ...prev, image: imageUrl }));
  }, []);

  const updateMetaData = useCallback((data: Partial<MetaData>) => {
    setMetaData(prev => ({ ...prev, ...data }));
  }, []);

  // Schema.org structured data
  const getSchema = () => {
    if (metaData.structuredData) {
      return metaData.structuredData;
    }
    const baseSchema = {
      "@context": "https://schema.org",
      "name": metaData.title,
      "description": metaData.description,
      "image": metaData.image,
      "url": metaData.url
    };

    if (metaData.type === 'article') {
      return {
        ...baseSchema,
        "@type": "Article",
        "publisher": {
          "@type": "Organization",
          "name": "UI HUB",
          "logo": {
            "@type": "ImageObject",
            "url": "/images/logo.png"
          }
        }
      };
    }

    if (metaData.type === 'product') {
      return {
        ...baseSchema,
        "@type": "Product"
      };
    }

    return {
      ...baseSchema,
      "@type": "WebSite",
      "potentialAction": {
        "@type": "SearchAction",
        "target": typeof window !== 'undefined' ? window.location.origin + '/search?q={search_term_string}' : '/search?q={search_term_string}',
        "query-input": "required name=search_term_string"
      }
    };
  };

  const memoizedValue = React.useMemo(() => ({ 
    updateMetaImage, 
    updateMetaData 
  }), [updateMetaImage, updateMetaData]);

  return (
    <SeoContext.Provider value={memoizedValue}>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{metaData.title}</title>
        <meta name="description" content={metaData.description} />
        <link rel="canonical" href={metaData.url} />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={metaData.title} />
        <meta property="og:description" content={metaData.description} />
        <meta property="og:image" content={metaData.image} />
        <meta property="og:url" content={metaData.url} />
        <meta property="og:type" content={metaData.type} />
        <meta property="og:site_name" content="UI HUB" />

        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@uihub" />
        <meta name="twitter:title" content={metaData.title} />
        <meta name="twitter:description" content={metaData.description} />
        <meta name="twitter:image" content={metaData.image} />

        {/* Schema.org JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify(getSchema())}
        </script>
      </Helmet>
      {children}
    </SeoContext.Provider>
  );
};

export const useSeo = () => {
  const context = useContext(SeoContext);
  if (context === undefined) {
    throw new Error('useSeo must be used within a SeoProvider');
  }
  return context;
};
