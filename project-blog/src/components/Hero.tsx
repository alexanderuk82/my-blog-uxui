import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSeo } from '../context/SeoContext';
import useBlog from '../hooks/useBlog';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  featured_image: string;
  slug: string;
  created_at: string;
  categories: Category[];
  author: {
    id: number;
    name: string;
    avatar_url?: string;
  };
}

const Hero: React.FC = () => {
  const { updateMetaData } = useSeo();
  
  // Fetch último post usando useBlog
  const { usePosts } = useBlog();
  const { data: posts, isLoading } = usePosts(1, 1);
  const latestPost = posts?.[0] as Post | undefined;

  useEffect(() => {
    if (latestPost) {
      updateMetaData({
        image: latestPost.featured_image,
        title: `${latestPost.title} - UI HUB`,
        description: latestPost.content.substring(0, 129) + '...',
        type: 'article'
      });
    }
  }, [latestPost, updateMetaData]);

  return (
    <section className="py-64 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none uppercase">
            {isLoading ? (
              <div className="animate-pulse">
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-[20px] mb-2 w-3/4"></div>
                <div className="h-10 bg-gray-300 dark:bg-gray-700 rounded-[20px] w-4/5"></div>
              </div>
            ) : (
              <>
                {latestPost?.title && (
                  <>
                    {latestPost.title.substring(0, 10)}
                    <br />
                    {latestPost.title.substring(10, 30)}
                    {latestPost.title.length > 30 && '...'}
                  </>
                )}
              </>
            )}
          </h1>
          <div className="w-full aspect-video bg-gray-200 overflow-hidden mb-8">
            {isLoading ? (
              <div className="w-full h-full animate-pulse bg-gray-300" />
            ) : (
              <img 
                src={latestPost?.featured_image} 
                alt={latestPost?.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        
        <div className="md:col-span-4 flex flex-col justify-between">
          <div>
            {isLoading ? (
              <div className="h-20 animate-pulse bg-gray-300 rounded mb-8" />
            ) : (
              <p className="max-w-[32ch] mb-8">
                {latestPost?.content?.substring(0, 129)}...
              </p>
            )}
            
            <div className="inline-block border border-black dark:border-white rounded-full text-xs px-4 py-1.5">
              {latestPost?.categories?.[0]?.name || '2025®'}
            </div>
          </div>
          
          <a 
            href={`/blog/${latestPost?.slug}`} 
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-black dark:border-white px-8 py-2 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors whitespace-nowrap"
          >
            <span>VIEW LATEST POST</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;