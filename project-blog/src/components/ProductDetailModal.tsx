import React, { useState } from 'react';
import { ShoppingCart, Tag, Info, Maximize2, Minimize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '../types';
import Modal from './ui/Modal';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  isOpen, 
  onClose, 
  product 
}) => {
  const { addItem } = useCart(); // Use useCart hook
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '1:1'>('16:9');
  
  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product.name}
      icon={<Info size={20} className="text-black dark:text-white" />}
    >
      <div className="flex flex-col gap-6">
        <div className="relative">
          <div 
            className={`overflow-hidden rounded-lg ${aspectRatio === '16:9' ? 'aspect-video' : 'aspect-square'} transition-all duration-300`}
          >
            <img 
              src={product.image_url || '/placeholder-product.jpg'} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Botón para cambiar el aspect ratio */}
          <motion.button
            className="absolute bottom-3 right-3 p-2 bg-white/80 dark:bg-black/80 rounded-full shadow-md backdrop-blur-sm"
            onClick={() => setAspectRatio(prev => prev === '16:9' ? '1:1' : '16:9')}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Change to ${aspectRatio === '16:9' ? '1:1' : '16:9'} aspect ratio`}
          >
            {aspectRatio === '16:9' ? (
              <Minimize2 size={16} className="text-black dark:text-white" />
            ) : (
              <Maximize2 size={16} className="text-black dark:text-white" />
            )}
          </motion.button>
        </div>
        
        <div className="flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-bold mb-2">{product.name}</h3>
            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {product.tags.map((tag, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1 px-3 py-1 bg-surface rounded-full text-xs"
              >
                <Tag size={12} />
                <span>{tag}</span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center pt-4 border-t border-keyline">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600 dark:text-gray-400">Price</span>
              <span className="text-2xl font-bold">{formatPrice(product.price, product.currency)}</span>
            </div>
            
            <motion.button 
              onClick={(e) => {
                e.stopPropagation(); // Evitar que el evento se propague
                addItem(product);
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-all text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart size={16} />
              Add to Cart
            </motion.button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;
