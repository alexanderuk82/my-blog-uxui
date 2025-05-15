import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, ArrowRight, Search, SlidersHorizontal, X } from 'lucide-react';
import { products } from '../../data/products';
import { Product } from '../src/types/index';

interface ShopProps {
  onAddToCart: (product: Product) => void;
}

const Shop: React.FC<ShopProps> = ({ onAddToCart }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  
  const allTags = Array.from(new Set(products.flatMap(p => p.tags)));
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || 
                       selectedTags.some(tag => product.tags.includes(tag));
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesSearch && matchesTags && matchesPrice;
  });

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="py-32">
      {/* Hero Section */}
      <div className="relative mb-16 rounded-2xl overflow-hidden bg-black text-white dark:bg-white dark:text-black p-16">
        <div className="relative z-10">
          <h1 className="text-6xl sm:text-7xl font-black mb-6">UI COMPONENTS<br />COLLECTION</h1>
          <p className="text-xl max-w-2xl mb-8 opacity-80">
            Premium design resources crafted for modern web applications. 
            Build faster, design better.
          </p>
          <div className="flex flex-wrap gap-4">
            {allTags.slice(0, 5).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-6 py-2 rounded-full border transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-white text-black dark:bg-black dark:text-white border-transparent'
                    : 'border-white/30 dark:border-black/30 hover:border-white dark:hover:border-black'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-gradient"></div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="sticky top-0 z-20 -mt-8 mb-16 bg-surface/80 backdrop-blur-xl rounded-full border border-keyline p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search components..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-2 bg-transparent border-none rounded-full focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
          >
            <SlidersHorizontal size={20} />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 w-full max-w-lg m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 hover:bg-surface rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <h4 className="font-medium mb-4">Price Range</h4>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                    className="w-full"
                  />
                  <span className="w-16 text-right">${priceRange[0]}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                    className="w-full"
                  />
                  <span className="w-16 text-right">${priceRange[1]}</span>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="font-medium mb-4">Categories</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-2 rounded-full border transition-colors ${
                        selectedTags.includes(tag)
                          ? 'bg-black text-white dark:bg-white dark:text-black border-transparent'
                          : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 200) && (
                <div>
                  <h4 className="font-medium mb-4">Active Filters</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className="px-3 py-1 bg-surface rounded-full text-sm flex items-center gap-2"
                      >
                        {tag}
                        <X size={14} />
                      </button>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < 200) && (
                      <button
                        onClick={() => setPriceRange([0, 200])}
                        className="px-3 py-1 bg-surface rounded-full text-sm flex items-center gap-2"
                      >
                        ${priceRange[0]} - ${priceRange[1]}
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 mt-8">
                <button
                  onClick={() => {
                    setSelectedTags([]);
                    setPriceRange([0, 200]);
                  }}
                  className="px-6 py-2 text-sm hover:underline"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="px-6 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full text-sm"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div 
            key={product.id} 
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden"
          >
            <Link 
              to={`/shop/product/${product.id}`}
              className="block group relative"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-3 py-1 bg-surface rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <Link 
                to={`/shop/product/${product.id}`}
                className="group/title"
              >
                <h2 className="font-bold text-2xl mb-4 group-hover/title:text-blue-500 transition-colors">
                  {product.name}
                </h2>
              </Link>

              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold">${product.price}</span>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onAddToCart(product);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-black text-white dark:bg-white dark:text-black rounded-full hover:opacity-90 transition-opacity"
                >
                  <ShoppingCart size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;