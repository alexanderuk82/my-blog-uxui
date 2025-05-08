import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useSeo } from '../context/SeoContext';
import { useQuery } from '@tanstack/react-query';

interface Post {
  id: string;
  title: string;
  description: string;
  image: string;
  slug: string;
  publishedAt: string;
}

const Hero = () => {
  const { updateMetaData } = useSeo();
  
  // Fetch último post
  const { data: latestPost, isLoading } = useQuery<Post>({
    queryKey: ['latestPost'],
    queryFn: async () => {
      // TODO: Reemplazar con llamada real a Strapi
      const response = await fetch('/api/posts/latest');
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    },
    initialData: {
      id: '1',
      title: 'The Rise of Component-Driven Development',
      description: 'We believe in building software that serves humans through thoughtful design, robust engineering, and ethical business practices.',
      image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      slug: 'rise-of-component-driven-development',
      publishedAt: new Date().toISOString()
    }
  });

  useEffect(() => {
    if (latestPost) {
      updateMetaData({
        image: latestPost.image,
        title: `${latestPost.title} - UI HUB`,
        description: latestPost.description,
        type: 'article'
      });
    }
  }, [latestPost, updateMetaData]);

  return (
    <section className="py-64 md:py-32">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-8 leading-none">
            DIGITAL <br /> COMPONENT PHILOSOPHY.
          </h1>
          <div className="w-full aspect-video bg-gray-200 overflow-hidden mb-8">
            {isLoading ? (
              <div className="w-full h-full animate-pulse bg-gray-300" />
            ) : (
              <img 
                src={latestPost?.image} 
                alt={latestPost?.title} 
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
        
        <div className="md:col-span-4 flex flex-col justify-between">
          <div>
            <p className="max-w-[32ch] mb-8">
              {isLoading ? (
                <div className="h-20 animate-pulse bg-gray-300 rounded" />
              ) : (
                latestPost?.description
              )}
            </p>
            
            <div className="inline-block border border-black dark:border-white rounded-full text-xs px-4 py-1.5">
              2025®
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