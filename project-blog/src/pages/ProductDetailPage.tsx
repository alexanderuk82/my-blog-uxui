import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ShoppingCart, Star, Shield, Truck } from 'lucide-react';

// Components
import ProductImageCarousel from '../components/ProductImageCarousel';

// Components
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';

// Hooks & Utils
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatters';
import useProducts from '../hooks/useProducts';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, setCartOpen } = useCart();
  const { products } = useProducts();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Encontrar el producto por ID
  const product = products?.find(p => p.id.toString() === slug);

  // Scroll to top cuando el componente se monte o cuando cambie el producto
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]); // Agregamos slug como dependencia para que se ejecute cuando cambie el producto

  // Manejar producto no encontrado
  useEffect(() => {
    if (products && !product) {
      navigate('/products');
    }
  }, [products, product, navigate]);

  if (!products) return null;

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    addItem(product!);
    setCartOpen(true);
    setTimeout(() => setIsAddingToCart(false), 1000);
  };

  // Obtener productos recomendados
  const recommendedProducts = products
    .filter(p => p.id !== product?.id) // Excluir producto actual si existe
    .sort(() => Math.random() - 0.5) // Ordenar aleatoriamente
    .slice(0, 3); // Tomar solo 3 productos

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>
          {product
            ? `${product.seo?.title || product.name} | UI HUB Store`
            : 'Product Not Found - UI HUB Store'}
        </title>
        <meta 
          name="description" 
          content={product
            ? product.seo?.description ||
              product.description ||
              `High-quality ${product.name} available at UI HUB Store`
            : 'Product not found'}
        />
        <meta 
          name="keywords" 
          content={product
            ? product.seo?.keywords?.join(', ') ||
              `${product.category || ''}, ${product.tags?.join(', ') || ''}, UI resources, digital assets, design templates`
            : 'UI resources, digital assets, design templates'}
        />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${product?.name || 'Product'} - UI HUB Store`} />
        <meta 
          property="og:description" 
          content={product?.seo?.description || product?.description || `Explore our ${product?.name} and other digital resources`}
        />
        <meta 
          property="og:image" 
          content={product?.image_url || product?.images?.[0]?.image_url}
        />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="product" />
        <meta property="og:site_name" content="UI HUB Store" />
        <meta property="product:price:amount" content={product?.price?.toString()} />
        <meta property="product:price:currency" content={product?.currency} />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta 
          name="twitter:title" 
          content={`${product?.seo?.title || product?.name || 'Product'} - UI HUB Store`}
        />
        <meta 
          name="twitter:description" 
          content={product?.seo?.description || product?.description || `Explore our ${product?.name} and other digital resources`}
        />
        <meta 
          name="twitter:image" 
          content={product?.image_url || product?.images?.[0]?.image_url}
        />
        <meta name="twitter:creator" content="@uihub" />

        {/* Product Specific Meta Tags */}
        {product?.category && (
          <meta property="product:category" content={product.category} />
        )}
        {product?.tags?.map(tag => (
          <meta property="product:tag" content={tag} key={tag} />
        ))}
        
        {/* Other Important Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ef4444" />
        <link rel="canonical" href={window.location.href} />

        {/* Structured Data for Product */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product?.name,
            "description": product?.seo?.description || product?.description,
            "image": product?.image_url || product?.images?.[0]?.image_url,
            "category": product?.category,
            "brand": product?.brand || {
              "@type": "Brand",
              "name": "UI HUB"
            },
            "offers": {
              "@type": "Offer",
              "price": product?.price,
              "priceCurrency": product?.currency,
              "availability": product?.stock_status === 'out_of_stock'
                ? "https://schema.org/OutOfStock"
                : "https://schema.org/InStock"
            }
          })}
        </script>
      </Helmet>

      <div className="w-container mx-auto lg:mx-0 px-4 sm:px-8 md:px-content-x py-content-y ">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8" role="main">
          {/* Back button with animation */}
          <motion.button
            onClick={() => navigate('/products')}
            className="group flex items-center gap-2 my-6 text-muted-foreground hover:text-foreground transition-all duration-300"
            whileHover={{ x: -5 }}
            aria-label="Back to products"
          >
            <ArrowLeft className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
            <span>Back to products</span>
          </motion.button>

          {product ? (
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Product Image Carousel */}
              <motion.div
                className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-red-500/5 to-purple-500/5 dark:from-red-500/10 dark:to-purple-500/10 border border-keyline hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <ProductImageCarousel product={product} />
              </motion.div>

            {/* Detalles del Producto */}
            <motion.div
              className="flex flex-col space-y-32"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Title and Price */}
              <div className="mb-8">
                <motion.h1 
                  className="leading-[120%] text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500" 
                  tabIndex={0}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {product.name}
                </motion.h1>
                <motion.div 
                  className="flex items-baseline gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <span 
                    className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500" 
                    aria-label={`Price: ${formatPrice(Number(product.price), product.currency)}`}
                  >
                    {formatPrice(Number(product.price), product.currency)}
                  </span>
                </motion.div>
              </div>

              {/* Description with gradient border */}
              <motion.div
                className="relative p-6 rounded-xl bg-white/50 dark:bg-zinc-800/50 border border-keyline mb-8 overflow-hidden group hover:shadow-lg transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <p className="text-lg text-muted-foreground relative z-10" tabIndex={0}>
                  {product.description}
                </p>
              </motion.div>

              {/* Tags with hover effect */}
              <motion.div 
                className="flex flex-wrap gap-2 mb-8" 
                role="list" 
                aria-label="Product tags"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                {product.tags.map((tag, index) => (
                  <motion.span
                    key={tag}
                    className="px-4 py-2 bg-gradient-to-r from-red-500/10 to-purple-500/10 hover:from-red-500/20 hover:to-purple-500/20 text-red-500 rounded-full text-sm font-medium border border-red-500/20 hover:border-red-500/40 transition-all duration-300 cursor-default"
                    role="listitem"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </motion.div>

              {/* Features with hover effects */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8" 
                role="list" 
                aria-label="Product features"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <motion.div 
                  className="group flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-zinc-800/50 border border-keyline hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300" 
                  role="listitem"
                  whileHover={{ scale: 1.02 }}
                >
                  <Shield className="w-5 h-5 text-red-500 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <span>Lifetime Warranty</span>
                </motion.div>
                <motion.div 
                  className="group flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-zinc-800/50 border border-keyline hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300" 
                  role="listitem"
                  whileHover={{ scale: 1.02 }}
                >
                  <Truck className="w-5 h-5 text-red-500 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <span>Instant Delivery</span>
                </motion.div>
                <motion.div 
                  className="group flex items-center gap-3 p-4 rounded-lg bg-white/50 dark:bg-zinc-800/50 border border-keyline hover:shadow-lg hover:shadow-red-500/10 transition-all duration-300" 
                  role="listitem"
                  whileHover={{ scale: 1.02 }}
                >
                  <Star className="w-5 h-5 text-red-500 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                  <span>Premium Support</span>
                </motion.div>
              </motion.div>

              {/* Add to Cart Button */}
              <div className="mt-auto">
                <Separator className="mb-8" />
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isAddingToCart ? 'adding' : 'normal'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={handleAddToCart}
                      disabled={isAddingToCart}
                      className="group w-full  text-lg bg-red-500 text-white hover:bg-red-600 dark:bg-red-500 dark:text-white dark:hover:bg-red-600 font-medium shadow-lg shadow-red-500/20 dark:shadow-red-500/10 transition-all duration-300"
                      aria-label={isAddingToCart ? 'Adding to cart...' : 'Add to cart'}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                      {isAddingToCart ? 'Adding to cart...' : 'Add to cart'}
                    </Button>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>


            </div>
          ) : (
            <div className="text-center py-16">
              <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
              <p className="text-muted-foreground mb-8">The product you're looking for doesn't exist or has been removed.</p>
            </div>
          )}

          {/* Product Recommendations */}
          {recommendedProducts.length > 0 && (
            <motion.div
              className="mt-24"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
                You May Also Like
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-9">
                {recommendedProducts.map((recommendedProduct, index) => (
                  <motion.div
                    key={recommendedProduct.id}
                    className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-red-500/5 to-purple-500/5 dark:from-red-500/10 dark:to-purple-500/10 border border-keyline hover:shadow-xl hover:shadow-red-500/10 transition-all duration-500 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 * index }}
                    onClick={() => {
                      navigate(`/products/${recommendedProduct.id}`);
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    {/* Product Image */}
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={recommendedProduct.image_url}
                        alt={recommendedProduct.name}
                        className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="text-xl font-bold mb-2 line-clamp-1">{recommendedProduct.name}</h3>
                      <p className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-purple-500">
                        {formatPrice(recommendedProduct.price, recommendedProduct.currency)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;
