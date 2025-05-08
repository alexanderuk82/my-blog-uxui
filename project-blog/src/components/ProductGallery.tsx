import React from 'react';
import { Product } from '../types';

import { ShoppingCart } from 'lucide-react';

interface ProductGalleryProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<{ product: Product; onAddToCart: (product: Product) => void }> = ({ product, onAddToCart }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden card-hover">
      <div className="overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full aspect-video object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>
      
      <div className="p-16">
        <h3 className="font-bold text-lg mb-2">{product.name}</h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.map((tag, index) => (
            <span 
              key={index} 
              className="text-xs px-2 py-1 bg-surface rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold">${product.price}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity text-sm"
          >
            <ShoppingCart size={14} />
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

const ProductGallery: React.FC<ProductGalleryProps> = ({ products, onAddToCart }) => {
  return (
    <section id="products" className="py-64 md:py-32 border-t border-keyline">
      <div className="flex flex-col gap-8">
        <div>
          <span className="text-sm uppercase tracking-wide">PRODUCTS</span>
          <div className="w-24 h-px bg-black dark:bg-white mt-2"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGallery;