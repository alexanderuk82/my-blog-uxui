import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../components/ui/sheet';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';

// UI Components


// Context
import { useAuth } from '../context/AuthContext';

// Hooks
import useProducts, { Product } from '../hooks/useProducts';

const ProductsPage = () => {
  // Estados
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  
  // Datos de productos
  const { products: allProducts, isLoading, error } = useProducts();

  // Obtener tags únicos de los productos
  const allTags = useMemo(() => {
    if (!allProducts) return [];
    const tagSet = new Set<string>();
    allProducts.forEach(product => {
      product.tags?.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet);
  }, [allProducts]);

  // Calcular contadores de tags
  const tagCounts = useMemo(() => {
    return allTags.reduce((acc, tag) => {
      acc[tag] = allProducts?.filter(product => 
        product.tags?.includes(tag)
      ).length || 0;
      return acc;
    }, {} as Record<string, number>);
  }, [allProducts, allTags]);

  // Filtrar productos
  const filteredProducts = useMemo(() => {
    return allProducts?.filter(product => {
      // Filtro por tags
      if (selectedTags.length > 0 && (!product.tags || !selectedTags.some(tag => product.tags.includes(tag)))) {
        return false;
      }

      // Filtro por búsqueda
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        return (
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
        );
      }

      return true;
    }) || [];
  }, [allProducts, selectedTags, searchTerm, allTags]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <Helmet>
        <title>UI Components Collection - Premium Design Resources</title>
        <meta 
          name="description" 
          content="Premium design resources crafted for modern web applications. Build faster, design better with our UI components collection." 
        />
      </Helmet>

      <main className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
      
      <Header cartItems={[]} onCartClick={() => {}} />       
        
        {/* Hero Section */}
        <div className="relative mb-16 rounded-2xl overflow-hidden bg-black text-white dark:bg-white dark:text-black p-16">
          <div className="relative z-10">
            <motion.h1 
              className="text-4xl md:text-7xl md:leading-[1.2] lg:leading-normal font-black mb-6 text-white dark:text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              UI COMPONENTS<br />COLLECTION
            </motion.h1>
            
            <motion.p 
              className="text-xl max-w-2xl mb-10 opacity-80 "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Premium design resources crafted for modern web applications. 
              Build faster, design better.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {allTags.slice(0, 5).map((tag, index) => (
                <motion.button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-6 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 ${
                    selectedTags.includes(tag)
                      ? 'bg-white text-black dark:bg-black dark:text-white border-transparent shadow-lg'
                      : 'border-white/30 dark:border-black/30 hover:border-white dark:hover:border-black'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{tag}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-black/10 dark:bg-white/10'
                      : 'bg-white/10 dark:bg-black/10'
                  }`}>
                    {tagCounts[tag]}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-gradient"></div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="sticky top-0 z-20  my-6 bg-surface/80 backdrop-blur-xl rounded-full border border-keyline p-4">
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
                <Button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            <motion.button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <SlidersHorizontal size={20} />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>
        </div>
        {/* Filter Sheet */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-l border-keyline">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 pointer-events-none" />
            <div className="relative z-10">
            <SheetHeader className="space-y-4 mb-8">
              <SheetTitle className="text-3xl font-bold flex items-center gap-2">
                <Sparkles className="text-red-500" />
                Filters
                
              </SheetTitle>
              <SheetDescription className="text-muted-foreground">
                Refine your search with our powerful filters
              </SheetDescription>
            </SheetHeader>

            {/* Price Range */}
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Price Range</h3>
                <div className="px-4 py-6 bg-white/50 dark:bg-zinc-800/50 rounded-xl border border-keyline">
                  <Slider
                    defaultValue={[0, 200]}
                    max={200}
                    step={1}
                    value={priceRange}
                    onValueChange={(value: [number, number]) => setPriceRange(value)}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>£{priceRange[0]}</span>
                    <span>£{priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Categories */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {allTags.map(tag => (
                    <Button
                      key={tag}
                      variant={selectedTags.includes(tag) ? "default" : "outline"}
                      className={`justify-start gap-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 ${selectedTags.includes(tag) ? 'after:w-full bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200' : 'after:w-0 hover:after:w-full'}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {selectedTags.includes(tag) && <Check size={16} />}
                      {tag}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-6" />

              {/* Active Filters */}
              {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 200) && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">Active Filters</h3>
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                  </div>
                  <div className="p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl border border-keyline">
                    <div className="flex flex-wrap gap-2">
                    {selectedTags.map(tag => (
                      <Button
                        key={tag}
                        variant="secondary"
                        size="sm"
                        onClick={() => toggleTag(tag)}
                        className="gap-2 p-4 bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 font-medium shadow-lg shadow-red-500/20 dark:shadow-red-500/10 transition-all duration-300"
                      >
                        {tag}
                        <X size={14} />
                      </Button>
                    ))}
                    {(priceRange[0] > 0 || priceRange[1] < 200) && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setPriceRange([0, 200])}
                        className="gap-2 p-4 bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 font-medium shadow-lg shadow-red-500/20 dark:shadow-red-500/10 transition-all duration-300"
                      >
                        <span className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            <span className="text-xs opacity-80">£</span>
                            <span className="font-semibold">{priceRange[0]}</span>
                          </span>
                          <span className="opacity-60">—</span>
                          <span className="inline-flex items-center gap-1">
                            <span className="text-xs opacity-80">£</span>
                            <span className="font-semibold">{priceRange[1]}</span>
                          </span>
                          <X size={14} className="ml-1 opacity-80 hover:opacity-100" />
                        </span>
                      </Button>
                    )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            </div>

            <SheetFooter className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border-t border-keyline">
              <div className="flex justify-between w-full gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedTags([]);
                    setPriceRange([0, 200]);
                  }}
                  className="hover:bg-red-500 hover:text-white transition-colors"
                >
                  Reset All
                </Button>
                <Button 
                  onClick={() => setIsFilterOpen(false)}
                  className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Apply Filters
                </Button>
              </div>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        {/* Products Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-keyline p-4 h-[400px] animate-pulse">
                  <div className="w-full h-48 bg-zinc-200 dark:bg-zinc-700 rounded-lg mb-4" />
                  <div className="space-y-3">
                    <div className="h-6 w-2/3 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-700 rounded" />
                    <div className="h-10 w-full bg-zinc-200 dark:bg-zinc-700 rounded-lg mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">Error loading products. Please try again later.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  className="group relative rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-keyline overflow-hidden hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Product Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-red-500/5 to-purple-500/5 dark:from-red-500/10 dark:to-purple-500/10 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-red-500/50" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>

                  {/* Product Info */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-red-500 transition-colors duration-300">{product.name}</h3>
                      <p className="text-muted-foreground line-clamp-2">{product.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black">
                        <span className="text-sm font-normal text-muted-foreground">{product.currency === 'usd' ? '$' : '£'}</span>
                        {product.price}
                      </span>
                      <Button 
                        onClick={() => {}}
                        className="bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 font-medium shadow-lg shadow-red-500/20 dark:shadow-red-500/10 transition-all duration-300"
                      >
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
      
    </>
  );
};

export default ProductsPage;
