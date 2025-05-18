import { supabase } from '../lib/supabaseClient';
import { CartItem } from '../context/CartContext';

// Nota: Ya no necesitamos generar tokens en el frontend
// Los tokens ahora se generan en el backend para mayor seguridad

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

  // Ensure URLs are absolute (tokens will be added by the Edge Function)
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
    // Asegurarnos de que los datos estén en el formato correcto que Stripe espera
    const lineItems = items.map(item => ({
      price: item.product.stripe_price_id,
      quantity: item.quantity,
    }));

    // Log line items for debugging
    console.log('Line items:', JSON.stringify(lineItems, null, 2));

    // Llamar a la función Edge original que estaba funcionando
    const requestBody = {
      line_items: lineItems,  // Usar snake_case para compatibilidad
      success_url: fullSuccessUrl,
      cancel_url: fullCancelUrl,
      customer_email: user?.email || null
    };
    
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { data, error } = await supabase.functions.invoke('create-checkout-session', {
      body: requestBody
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
