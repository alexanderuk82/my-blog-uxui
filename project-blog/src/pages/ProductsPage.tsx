import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, SlidersHorizontal, Check, Sparkles } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '../components/ui/sheet';
import { Slider } from '../components/ui/slider';
import { Separator } from '../components/ui/separator';
import { Button } from '../components/ui/button';
import FocusTrap from 'focus-trap-react';
import { DialogTitle } from "../components/ui/dialog"

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';

// UI Components

// Utils
import { formatPrice } from '../utils/formatters';

// Context
import { useCart } from '../context/CartContext';

// Hooks
import useProducts, { Product } from '../hooks/useProducts';

const ProductsPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Estados
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const sheetRef = useRef(null);
  
  // Hooks
  const { addItem, setCartOpen } = useCart();
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
        {/* Basic Meta Tags */}
        <title>UI Components Collection - Premium Design Resources</title>
        <meta name="description" content="Premium design resources crafted for modern web applications. Build faster, design better with our UI components collection." />
        <meta name="keywords" content={`UI components, design resources, web development, React components, ${allTags.join(', ')}, frontend development`} />
        
        {/* Open Graph */}
        <meta property="og:title" content="UI Components Collection - Premium Design Resources" />
        <meta property="og:description" content="Premium design resources crafted for modern web applications. Build faster, design better with our UI components collection." />
        <meta property="og:image" content={allProducts?.[0]?.image_url || '/assets/default-products-preview.jpg'} />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="UI HUB" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="UI Components Collection - Premium Design Resources" />
        <meta name="twitter:description" content="Premium design resources crafted for modern web applications. Build faster, design better with our UI components collection." />
        <meta name="twitter:image" content={allProducts?.[0]?.image_url || '/assets/default-products-preview.jpg'} />
        
        {/* Other */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="canonical" href={window.location.href} />
      </Helmet>

      <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y bg-surface">
      
      <Header />       
        
        {/* Hero Section */}
        <section 
          className="relative mb-16 rounded-2xl overflow-hidden bg-black text-white dark:bg-white dark:text-black p-16"
          role="banner"
          aria-labelledby="hero-title"
        >
          <div className="relative z-10">
            <motion.h1 
              id="hero-title"
              className="text-4xl md:text-7xl md:leading-[1.2] lg:leading-normal font-black mb-6 text-white dark:text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="sr-only">Welcome to our </span>
              UI COMPONENTS<br />COLLECTION
            </motion.h1>
            
            <motion.p 
              className="text-xl max-w-2xl mb-10 opacity-80"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Premium design resources crafted for modern web applications. 
              Build faster, design better.
            </motion.p>

            <motion.div 
              className="flex flex-wrap gap-4"
              role="group"
              aria-label="Filter by categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {allTags.slice(0, 5).map((tag, index) => (
                <motion.button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  aria-pressed={selectedTags.includes(tag)}
                  className={`px-6 py-2 rounded-full border transition-all duration-300 flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
                    selectedTags.includes(tag)
                      ? 'bg-white text-black dark:bg-black dark:text-white border-transparent shadow-lg'
                      : 'border-white/30 dark:border-black/30 hover:border-white dark:hover:border-black'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{tag}</span>
                  <span 
                    className={`text-xs px-2 py-0.5 rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-black/10 dark:bg-white/10'
                        : 'bg-white/10 dark:bg-black/10'
                    }`}
                    aria-label={`${tagCounts[tag]} items`}
                  >
                    {tagCounts[tag]}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>

          <div 
            className="absolute inset-0 opacity-20" 
            aria-hidden="true"
          >
            <div 
              className="absolute inset-0 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500 animate-gradient"
              role="presentation"
            ></div>
          </div>
        </section>

        {/* Search and Filter Bar */}
        <div 
          className="sticky top-0 z-20 my-6 bg-surface/80 backdrop-blur-xl rounded-full border border-keyline p-4"
          role="search"
          aria-label="Search and filter components"
        >
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <label htmlFor="search-input" className="sr-only">
                Search components
              </label>
              <Search 
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" 
                size={20}
                aria-hidden="true"
              />
              <input
                id="search-input"
                type="search"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-2 bg-transparent border-none rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                aria-label="Search components"
                role="searchbox"
              />
              {searchTerm && (
                <Button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black dark:hover:text-white"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </Button>
              )}
            </div>
            <motion.button 
              onClick={() => setIsFilterOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-expanded={isFilterOpen}
              aria-controls="filter-panel"
              aria-label="Open filters panel"
              tabIndex={0}
            >
              <SlidersHorizontal 
                size={20} 
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Filters</span>
            </motion.button>
          </div>
        </div>
        {/* Filter Sheet */}
        <Sheet 
          open={isFilterOpen} 
          onOpenChange={setIsFilterOpen}
        >
          <DialogTitle className="sr-only">Filter options</DialogTitle>
          <FocusTrap
              active={isFilterOpen}
              focusTrapOptions={{
                initialFocus: false, // Cambiamos esto para manejar el foco manualmente
                escapeDeactivates: true,
                allowOutsideClick: true,
                returnFocusOnDeactivate: true,
                tabbableOptions: {
                  displayCheck: 'full',
                }
              }}
            >
            <SheetContent 
                ref={sheetRef}
                id="filter-panel"
                className="w-full sm:max-w-xl overflow-y-auto bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-l border-keyline"
                aria-label="Filter options"
                onOpenAutoFocus={(e) => {
                  e.preventDefault();
                  // Enfocamos manualmente el primer elemento interactivo
                  setTimeout(() => {
                    const firstFocusableElement = sheetRef.current?.querySelector(
                      'button:not([aria-hidden="true"]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );
                    firstFocusableElement?.focus();
                  }, 0);
                }}
                onCloseAutoFocus={(e) => {
                  e.preventDefault();
                  // Devolvemos el foco al botón que abrió el sheet
                  document.querySelector('[aria-controls="filter-panel"]')?.focus();
                }}
                onEscapeKeyDown={() => setIsFilterOpen(false)}
                side="right"
              >
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-purple-500/5 dark:from-blue-500/10 dark:to-purple-500/10 pointer-events-none" aria-hidden="true" />
            <div className="relative z-10">
              <SheetHeader className="space-y-4 mb-8">
              <SheetTitle 
                id="sheet-title" 
                className="text-3xl font-bold flex items-center gap-2"
                tabIndex={0}
              >
                <Sparkles className="text-red-500" aria-hidden="true" />
                Filters
              </SheetTitle>
                <SheetDescription className="text-muted-foreground">
                  Refine your search with our powerful filters
                </SheetDescription>
              </SheetHeader>

              {/* Price Range */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 id="price-range-label" className="text-lg font-semibold">Price Range</h3>
                  <div className="px-4 py-6 bg-white/50 dark:bg-zinc-800/50 rounded-xl border border-keyline">
                    {/* Price Range Slider */}
                    <Slider
                      defaultValue={[0, 200]}
                      max={200}
                      step={1}
                      value={priceRange}
                      onValueChange={(value: [number, number]) => setPriceRange(value)}
                      className="w-full"
                      aria-labelledby="price-range-label"
                      aria-valuemin={0}
                      aria-valuemax={200}
                      aria-valuenow={priceRange[1]}
                      aria-valuetext={`Price range from £${priceRange[0]} to £${priceRange[1]}`}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'ArrowLeft') {
                          setPriceRange([priceRange[0] - 1, priceRange[1]]);
                        } else if (e.key === 'ArrowRight') {
                          setPriceRange([priceRange[0], priceRange[1] + 1]);
                        }
                      }}
                    />
                    <div className="flex justify-between mt-2 text-sm text-muted-foreground" aria-hidden="true">
                      <span>£{priceRange[0]}</span>
                      <span>£{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" role="separator" />

                {/* Categories */}
                <div className="space-y-4">
                  <h3 id="categories-label" className="text-lg font-semibold">Categories</h3>
                  <div 
                    className="grid grid-cols-2 gap-2"
                    role="group"
                    aria-labelledby="categories-label"
                  >
                    {/* Category Buttons */}
                    {allTags.map(tag => (
                      <Button
                        key={tag}
                        tabIndex={0}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className={`justify-start gap-2 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:bg-red-500 after:transition-all after:duration-300 
                          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 ${
                          selectedTags.includes(tag) 
                            ? 'after:w-full bg-zinc-900 text-white dark:bg-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200' 
                            : 'after:w-0 hover:after:w-full'
                        }`}
                        onClick={() => toggleTag(tag)}
                        aria-pressed={selectedTags.includes(tag)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleTag(tag);
                          }
                        }}
                      >
                        {selectedTags.includes(tag) && <Check size={16} aria-hidden="true" />}
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator className="my-6" role="separator" />

                {/* Active Filters */}
                {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 200) && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <h3 id="active-filters-label" className="text-lg font-semibold">Active Filters</h3>
                      <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" aria-hidden="true" />
                    </div>
                    <div 
                      className="p-4 bg-white/50 dark:bg-zinc-800/50 rounded-xl border border-keyline"
                      role="group"
                      aria-labelledby="active-filters-label"
                    >
                      <div className="flex flex-wrap gap-2">
                        {selectedTags.map(tag => (
                         <Button
                         key={tag}
                         variant="secondary"
                         size="sm"
                         onClick={() => toggleTag(tag)}
                         className="gap-2 p-4 bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 font-medium shadow-lg shadow-red-500/20 dark:shadow-red-500/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
                         aria-label={`Remove ${tag} filter`}
                       >
                         {tag}
                         <X size={14} aria-hidden="true" />
                       </Button>
                        ))}
                        {(priceRange[0] > 0 || priceRange[1] < 200) && (
                          <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPriceRange([0, 200])}
                          className="gap-2 p-4 bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 font-medium shadow-lg shadow-red-500/20 dark:shadow-red-500/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
                          aria-label="Reset price range filter"
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
                              <X size={14} className="ml-1 opacity-80 hover:opacity-100" aria-hidden="true" />
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
              className="hover:bg-red-500 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
              aria-label="Reset all filters"
              tabIndex={0}
            >
              Reset All
            </Button>
            <Button 
              onClick={() => setIsFilterOpen(false)}
              className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2"
              tabIndex={0}
            >
              Apply Filters
            </Button>
              </div>
            </SheetFooter>
          </SheetContent>
          </FocusTrap>
        </Sheet>

        {/* Products Grid */}
        <main className="mt-8 mb-12" role="main" aria-label="Products section">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-label="Loading products">
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
            <div className="text-center py-12" role="alert">
              <p className="text-red-500">Error loading products. Please try again later.</p>
            </div>
          ) : (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              role="grid"
              aria-label="Products grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {filteredProducts.map((product: Product, index: number) => (
                <motion.div
                  key={product.id}
                  className="group relative rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-keyline overflow-hidden hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500"
                  role="gridcell"
                  tabIndex={0}
                  onClick={() => navigate(`/products/${product.id}`)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      navigate(`/products/${product.id}`);
                    }
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  {/* Product Image */}
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-red-500/5 to-purple-500/5 dark:from-red-500/10 dark:to-purple-500/10 relative">
                    {product.image_url ? (
                      <img 
                        src={product.image_url} 
                        alt={`Product image of ${product.name}`}
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
                        {formatPrice(Number(product.price), product.currency)}
                      </span>
                      <Button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setAddingToCart(product.id.toString());
                          addItem(product);
                          setCartOpen(true);
                          // Resetear el estado después de un momento
                          setTimeout(() => setAddingToCart(null), 1000);
                        }}
                        className={`relative bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 font-medium shadow-lg shadow-red-500/20 dark:shadow-red-500/10 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black dark:focus-visible:ring-white focus-visible:ring-offset-2 ${addingToCart === product.id.toString() ? 'animate-pulse' : ''}`}
                        aria-label={`Add ${product.name} to cart`}
                        disabled={addingToCart === product.id.toString()}
                      >
                        {addingToCart === product.id.toString() ? 'Adding...' : 'Add to Cart'}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>

      <Footer />

      </div>

      
    </>
  );
};

export default ProductsPage;
