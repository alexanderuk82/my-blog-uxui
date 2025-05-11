import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { cn } from '../../lib/utils';

const AdCard = ({ ad }) => {
  const { theme } = useTheme();
  
  // Si no hay anuncio, mostrar un anuncio por defecto
  const defaultAd = {
    title: 'Premium UI Kit',
    description: 'UI Components for your next project',
    cta_text: 'View Offer',
    cta_url: '#',
    background_from: '#3b82f6',
    background_to: '#7c3aed'
  };

  // Usar el anuncio proporcionado o el anuncio por defecto
  const displayAd = ad || defaultAd;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-xl p-6',
        'bg-gradient-to-br shadow-lg',
        theme === 'dark' ? 'shadow-purple-900/20' : 'shadow-blue-100/50',
        'hover:shadow-xl transition-all duration-300'
      )}
      style={{
        background: `linear-gradient(135deg, ${ad.background_from || '#3b82f6'}, ${ad.background_to || '#7c3aed'})`
      }}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {ad.image_url && (
          <img 
            src={ad.image_url} 
            alt=""
            className="w-16 h-16 object-cover rounded-lg mb-4"
          />
        )}
        
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {ad.title}
        </h3>
        
        {ad.description && (
          <p className="text-white/90">
            {ad.description}
          </p>
        )}

        <motion.a
          href={ad.cta_url}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'inline-flex items-center gap-2 mt-4',
            'px-4 py-2 rounded-lg',
            'bg-white/10 hover:bg-white/20',
            'text-white font-medium',
            'transition-colors duration-200'
          )}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {ad.cta_text || 'Learn More'}
          <ArrowRight className="w-4 h-4" />
        </motion.a>
      </div>
    </motion.div>
  );
};

export default AdCard;
