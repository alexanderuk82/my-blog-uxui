import { useEffect, useState } from 'react';
import { type CarouselApi } from "../components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "../components/ui/carousel";
import { cn } from "../lib/utils";
import { Product } from '../hooks/useProducts';

interface ProductImageCarouselProps {
  product: Product;
}

const ProductImageCarousel = ({ product }: ProductImageCarouselProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  // Get all images, with the primary image first
  const allImages = [
    ...(product.images?.filter(img => img.is_primary) || []),
    ...(product.images?.filter(img => !img.is_primary) || []),
  ];

  // If no images in the new format, use the legacy image_url
  if (allImages.length === 0 && product.image_url) {
    allImages.push({
      id: 'legacy',
      image_url: product.image_url,
      order_index: 0,
      is_primary: true
    });
  }

  // Update count when images change
  useEffect(() => {
    if (api) {
      const newCount = allImages.length;
      setCount(newCount);
      console.log('Images changed, new count:', newCount); // Debug
    }
  }, [allImages.length, api]);

  useEffect(() => {
    if (!api) return;

    const updateCount = () => {
      const newCount = api.scrollSnapList().length;
      setCount(newCount);
      console.log('Current count:', newCount); // Debug
    };

    // Actualizar count inicial
    updateCount();

    // Actualizar current slide
    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap());
    };
    updateCurrent();

    // Configurar autoplay solo si hay más de una imagen
    const autoplayInterval = count > 1 ? setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext();
      } else {
        api.scrollTo(0);
      }
    }, 4000) : null;

    // Suscribirse a eventos
    api.on("select", updateCurrent);
    api.on("reInit", updateCount);

    // Limpiar
    return () => {
      if (autoplayInterval) {
        clearInterval(autoplayInterval);
      }
      api.off("select", updateCurrent);
      api.off("reInit", updateCount);
    };
  }, [api, count]);

  return (
    <div className="relative aspect-square">
      <Carousel 
        setApi={setApi} 
        className="w-full"
        opts={{
          loop: count > 1, // Solo activar loop si hay más de una imagen
          align: "start",
          watchDrag: count > 1 // Solo activar drag si hay más de una imagen
        }}
      >
        <CarouselContent>
          {allImages.map((image, index) => (
            <CarouselItem key={image.id}>
              <div className="relative aspect-square overflow-hidden rounded-xl">
                <img
                  src={image.image_url}
                  alt={`${product.name} - Image ${index + 1}`}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
                  loading={index === 0 ? "eager" : "lazy"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Dots navigation */}
        {allImages.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-10">
            {allImages.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-300 shadow-lg",
                  "border-2 border-white/50",
                  index === current
                    ? "bg-red-500 w-6 border-red-500"
                    : "bg-white/30 backdrop-blur-sm hover:bg-white/50 hover:border-white"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
};

export default ProductImageCarousel;
