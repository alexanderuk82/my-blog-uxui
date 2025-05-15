import Stripe from 'stripe';
import { STRIPE_SECRET_KEY } from '../lib/stripe';

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.basil'
});

export const getProducts = async () => {
  try {
    const MIN_YEAR = 2025;
    
    // Primero obtenemos los productos
    const productsResponse = await stripe.products.list({
      active: true,
      limit: 100
    });

    // Filtramos productos desde 2025 y que tengan descripción
    const filteredProducts = productsResponse.data.filter(product => {
      const createdDate = new Date(product.created * 1000);
      return createdDate.getFullYear() >= MIN_YEAR && product.description !== null;
    });

    // Luego obtenemos los precios de todos los productos
    const pricesResponse = await stripe.prices.list({
      active: true,
      limit: 100
    });

    // Creamos un mapa de precios por producto
    const pricesByProduct = pricesResponse.data.reduce((acc, price) => {
      if (!acc[price.product as string]) {
        acc[price.product as string] = [];
      }
      acc[price.product as string].push(price);
      return acc;
    }, {} as Record<string, Stripe.Price[]>);

    // Mapeamos los productos con sus precios
    return filteredProducts.map(product => {
      const prices = pricesByProduct[product.id] || [];
      const defaultPrice = prices[0]; // Tomamos el primer precio como default

      return {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.images?.[0] || '',
        price: defaultPrice?.unit_amount ? defaultPrice.unit_amount / 100 : 0,
        currency: defaultPrice?.currency || 'usd'
      };
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Error fetching products from Stripe');
  }
};
