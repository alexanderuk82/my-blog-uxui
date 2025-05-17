import { supabase } from '../lib/supabaseClient';
import { CartItem } from '../context/CartContext';

interface CreateCheckoutSessionParams {
  items: CartItem[];
  successUrl: string;
  cancelUrl: string;
}

/**
 * Creates a Stripe checkout session for the given cart items
 */
export async function createCheckoutSession({ 
  items, 
  successUrl, 
  cancelUrl 
}: CreateCheckoutSessionParams) {
  // Validate URLs
  if (!successUrl || !cancelUrl) {
    throw new Error('Success and cancel URLs are required');
  }

  // Ensure URLs are absolute
  const baseUrl = window.location.origin;
  const fullSuccessUrl = successUrl.startsWith('http') ? successUrl : `${baseUrl}${successUrl}`;
  const fullCancelUrl = cancelUrl.startsWith('http') ? cancelUrl : `${baseUrl}${cancelUrl}`;
  try {
    // Get current user (optional)
    const { data: { user } } = await supabase.auth.getUser();

    // Log cart items for debugging
    console.log('Cart items:', JSON.stringify(items, null, 2));

    // Log product details for debugging
    items.forEach((item, index) => {
      console.log(`Product ${index} details:`, {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        stripe_price_id: item.product.stripe_price_id,
        quantity: item.quantity
      });
    });

    // Validate that all products have stripe_price_id
    const invalidProducts = items.filter(item => !item.product.stripe_price_id);
    if (invalidProducts.length > 0) {
      console.error('Products missing stripe_price_id:', invalidProducts);
      throw new Error(`Missing stripe_price_id for products: ${invalidProducts.map(item => item.product.name).join(', ')}`);
    }

    // Transform cart items to line items using existing price IDs
    const lineItems = items.map(item => ({
      price: item.product.stripe_price_id,
      quantity: item.quantity,
    }));

    // Log line items for debugging
    console.log('Line items:', JSON.stringify(lineItems, null, 2));

    // Call the Edge Function
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: {
        lineItems,
        successUrl: fullSuccessUrl,
        cancelUrl: fullCancelUrl,
        userId: user?.id, // Optional
        customerEmail: user?.email, // Optional - Stripe recolectará el email
      },
    });

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error;
  }
}

/**
 * Retrieves a checkout session by its ID
 */
export async function getCheckoutSession(sessionId: string) {
  try {
    const { data, error } = await supabase.functions.invoke('get-checkout-session', {
      body: { sessionId },
    });

    if (error) throw error;
    return data;

  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    throw error;
  }
}
