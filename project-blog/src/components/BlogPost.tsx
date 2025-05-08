import React from 'react';
import { useSeo } from '../context/SeoContext';

interface BlogPostProps {
  title: string;
  description: string;
  image: string;
  content: string;
  author: string;
  date: string;
}

const BlogPost: React.FC<BlogPostProps> = ({
  title,
  description,
  image,
  content,
  author,
  date
}) => {
  const { updateMetaData } = useSeo();

  React.useEffect(() => {
    // Actualizar los meta tags con la información del post
    updateMetaData({
      title: `${title} - UI HUB Blog`,
      description,
      image,
      type: 'article',
      url: typeof window !== 'undefined' ? window.location.href : ''
    });
  }, [title, description, image, updateMetaData]);

  return (
    <article className="max-w-4xl mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
          <span>{author}</span>
          <span className="mx-2">•</span>
          <time dateTime={date}>{new Date(date).toLocaleDateString()}</time>
        </div>
      </header>
      
      <img 
        src={image} 
        alt={title}
        className="w-full h-[400px] object-cover rounded-lg mb-8"
      />
      
      <div className="prose dark:prose-invert max-w-none">
        {content}
      </div>
    </article>
  );
};

export default BlogPost;
