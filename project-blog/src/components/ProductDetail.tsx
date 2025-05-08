import React, { useEffect } from 'react';
import { useSeo } from '../context/SeoContext';

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  category: string;
}

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const { updateMetaData } = useSeo();

  useEffect(() => {
    if (product) {
      updateMetaData({
        title: `${product.name} - UI HUB Store`,
        description: product.description,
        image: product.image,
        type: 'product',
        url: typeof window !== 'undefined' ? window.location.href : '',
        structuredData: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.image,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock'
          },
          category: product.category
        }
      });
    }
  }, [product, updateMetaData]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>
          <div className="space-y-4">
            <button className="w-full bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2">
              <span>Add to Cart</span>
            </button>
            <p className="text-sm text-gray-500 text-center">
              Free shipping on orders over $50
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
