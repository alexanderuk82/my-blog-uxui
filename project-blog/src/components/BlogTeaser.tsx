import React from 'react';
import { ArrowRight } from 'lucide-react';
import { blogPosts } from '../data/blogPosts';

const BlogTeaser: React.FC = () => {
  return (
    <section id="blog" className="py-64 md:py-32 border-t border-keyline">
      <div className="flex flex-col gap-8">
        <div>
          <span className="text-sm uppercase tracking-wide">LATEST POSTS</span>
          <div className="w-24 h-px bg-black dark:bg-white mt-2"></div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-t border-b border-keyline">
            <thead>
              <tr className="text-left text-sm border-b border-keyline">
                <th className="py-4 font-medium">TITLE</th>
                <th className="py-4 font-medium hidden md:table-cell">DATE</th>
                <th className="py-4 font-medium text-right">READ</th>
              </tr>
            </thead>
            <tbody>
              {blogPosts.map(post => (
                <tr key={post.id} className="border-b border-keyline hover:bg-surface/50 transition-colors">
                  <td className="py-4">{post.title}</td>
                  <td className="py-4 hidden md:table-cell">{post.date}</td>
                  <td className="py-4 text-right">
                    <a 
                      href={`/blog/${post.slug}`} 
                      className="inline-flex items-center gap-2 hover:underline"
                    >
                      <span>{post.readTime}</span>
                      <ArrowRight size={16} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BlogTeaser;