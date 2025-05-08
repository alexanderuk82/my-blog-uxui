import React, { useState, useEffect, useRef } from 'react';
import { Product } from '../types';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { ShoppingCart, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import ProductDetailModal from './ProductDetailModal';

interface ProductGalleryProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

// Componente de tarjeta de producto para el carrusel
const ProductCard: React.FC<{ 
  product: Product; 
  onAddToCart: (product: Product) => void;
  isActive?: boolean;
  index?: number;
  onClick: () => void;
}> = ({ product, onAddToCart, isActive = false, index = 0, onClick }) => {
  return (
    <motion.div 
      className={`relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg flex-shrink-0 w-[280px] sm:w-[320px] md:w-[340px] h-[420px] cursor-pointer transition-all duration-300 ${isActive ? 'ring-2 ring-black dark:ring-white' : ''}`}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onClick={onClick}
      layout
    >
      <div className="h-[55%] overflow-hidden relative group">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-5 h-[45%] flex flex-col justify-between relative">
        <div>
          <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span 
                key={index} 
                className="text-xs px-2 py-1 bg-surface rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-xl">${product.price}</span>
          <motion.button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-all text-sm"
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <ShoppingCart size={14} />
            Add to Cart
          </motion.button>
        </div>
        
        {/* Indicador de elemento activo */}
        {isActive && (
          <motion.div 
            className="absolute -top-2 -right-2 bg-black dark:bg-white text-white dark:text-black rounded-full p-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring" }}
          >
            <Plus size={16} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Componente principal del carrusel moderno
const ModernCarousel: React.FC<{ products: Product[]; onAddToCart: (product: Product) => void }> = ({ products, onAddToCart }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoPlayIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Valores de movimiento para el arrastre
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-100, 0, 100], [0.5, 1, 0.5]);
  
  // Avanzar al siguiente elemento
  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % products.length);
  };
  
  // Retroceder al elemento anterior
  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
  };
  
  // Gestionar autoplay
  useEffect(() => {
    if (autoPlay) {
      autoPlayIntervalRef.current = setInterval(() => {
        nextSlide();
      }, 4000);
    }
    
    return () => {
      if (autoPlayIntervalRef.current) {
        clearInterval(autoPlayIntervalRef.current);
      }
    };
  }, [autoPlay, products.length]);
  
  // Pausar autoplay al interactuar
  const pauseAutoPlay = () => {
    setAutoPlay(false);
  };
  
  // Reanudar autoplay después de un tiempo
  const resumeAutoPlayAfterDelay = () => {
    setTimeout(() => setAutoPlay(true), 5000);
  };
  
  // Manejar el arrastre del carrusel
  const handleDragEnd = (e: any, { offset, velocity }: any) => {
    setIsDragging(false);
    
    const swipeThreshold = 50;
    if (offset.x < -swipeThreshold) {
      nextSlide();
    } else if (offset.x > swipeThreshold) {
      prevSlide();
    }
    
    pauseAutoPlay();
    resumeAutoPlayAfterDelay();
  };
  
  // Abrir modal con detalles del producto
  const handleProductClick = (product: Product) => {
    if (!isDragging) {
      setSelectedProduct(product);
      setIsModalOpen(true);
      pauseAutoPlay();
    }
  };
  
  return (
    <div className="relative w-full overflow-hidden py-8" ref={carouselRef}>
      {/* Controles de navegación */}
      <div className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2">
        <motion.button 
          onClick={() => {
            prevSlide();
            pauseAutoPlay();
            resumeAutoPlayAfterDelay();
          }}
          className="p-3 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black shadow-lg backdrop-blur-sm transition-colors"
          aria-label="Previous product"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <ChevronLeft className="text-black dark:text-white" size={20} />
        </motion.button>
      </div>
      
      <div className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2">
        <motion.button 
          onClick={() => {
            nextSlide();
            pauseAutoPlay();
            resumeAutoPlayAfterDelay();
          }}
          className="p-3 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black shadow-lg backdrop-blur-sm transition-colors"
          aria-label="Next product"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
        >
          <ChevronRight className="text-black dark:text-white" size={20} />
        </motion.button>
      </div>
      
      {/* Contenedor del carrusel */}
      <div className="overflow-hidden mx-4 md:mx-8 lg:mx-12 py-4">
        <motion.div 
          className="flex gap-6 px-4"
          style={{ 
            x: isDragging ? x : -activeIndex * (340 + 24), // Ancho de tarjeta + gap
            opacity 
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={handleDragEnd}
          transition={{ 
            type: "spring", 
            damping: 20, 
            stiffness: 100,
            when: "afterChildren" 
          }}
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              isActive={index === activeIndex}
              index={index}
              onClick={() => handleProductClick(product)}
            />
          ))}
          
          {/* Añadir tarjetas adicionales para efecto infinito */}
          {products.slice(0, 3).map((product, index) => (
            <ProductCard
              key={`duplicate-${product.id}`}
              product={product}
              onAddToCart={onAddToCart}
              index={products.length + index}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Indicadores de posición */}
      <div className="flex justify-center mt-6 gap-2">
        {products.map((_, index) => (
          <motion.button
            key={index}
            className={`h-2 rounded-full transition-all ${index === activeIndex ? 'bg-black dark:bg-white w-8' : 'bg-gray-300 dark:bg-gray-600 w-2'}`}
            onClick={() => {
              setActiveIndex(index);
              pauseAutoPlay();
              resumeAutoPlayAfterDelay();
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            aria-label={`Go to product ${index + 1}`}
          />
        ))}
      </div>
      
      {/* Modal de detalles del producto */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resumeAutoPlayAfterDelay();
        }}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />
    </div>
  );
};

// Componente principal de la galería de productos
const ProductGallery: React.FC<ProductGalleryProps> = ({ products, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Crear productos adicionales para el carrusel si no hay suficientes
  const extendedProducts = products.length >= 6 ? products : [
    ...products,
    ...products.map(product => ({
      ...product,
      id: product.id + 100, // Asegurar IDs únicos
      name: `${product.name} Pro`,
      price: product.price + 20
    })).slice(0, 6 - products.length)
  ];
  
  return (
    <section id="products" className="py-20 md:py-32 border-t border-keyline">
      <div className="flex flex-col gap-8">
        <div>
          <span className="text-sm uppercase tracking-wide">PRODUCTS</span>
          <div className="w-24 h-px bg-black dark:bg-white mt-2"></div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl uppercase font-bold">FEATURED PRODUCTS</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">Explore our collection of premium UI components designed to elevate your next project.</p>
        </div>
        
        {/* Carrusel moderno para todas las pantallas */}
        <ModernCarousel products={extendedProducts} onAddToCart={onAddToCart} />
        
        {/* Sección de productos destacados */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold uppercase">Popular Items</h3>
            <motion.button 
              className="text-sm font-medium underline-offset-4 hover:underline"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              View All Products
            </motion.button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.slice(0, 3).map((product) => (
              <motion.div 
                key={product.id} 
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                whileHover={{ y: -5 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setSelectedProduct(product);
                  setIsModalOpen(true);
                }}
              >
                <div className="overflow-hidden h-48">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                
                <div className="p-4">
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
                    <motion.button 
                      onClick={() => onAddToCart(product)}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-all text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Modal de detalles del producto para la sección de productos destacados */}
      <ProductDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={selectedProduct}
        onAddToCart={onAddToCart}
      />
    </section>
  );
};

export default ProductGallery;