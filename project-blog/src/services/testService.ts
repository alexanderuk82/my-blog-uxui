import { supabase } from '../lib/supabaseClient';

/**
 * Interface for test product response
 */
interface TestProductResponse {
  productId: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
}

/**
 * Creates a test product in Stripe for testing checkout flow
 * @returns TestProductResponse object
 */
export async function createTestProduct(): Promise<TestProductResponse> {
  try {
    // Llamar a la función Edge para crear un producto de prueba
    const { data, error } = await supabase.functions.invoke('create-test-product', {
      body: {}
    });

    if (error) {
      console.error('Error creating test product:', error);
      throw error;
    }

    return data as TestProductResponse;
  } catch (error) {
    console.error('Error in createTestProduct:', error);
    throw error instanceof Error ? error : new Error('Unknown error creating test product');
  }
}

/**
 * Creates a test checkout session with the test product
 * @returns Checkout session URL
 */
export async function createTestCheckout(): Promise<{ url: string; sessionId: string }> {
  try {
    // Crear un producto de prueba
    const testProduct = await createTestProduct();
    
    // Crear un item para el checkout
    const lineItems = [
      {
        price: testProduct.priceId,
        quantity: 1
      }
    ];
    
    // Crear la sesión de checkout
    const requestBody = {
      line_items: lineItems,  // Usar snake_case para mayor compatibilidad
      success_url: `${window.location.origin}/checkout/success`,
      cancel_url: `${window.location.origin}/checkout/cancel`,
      customer_email: 'test@example.com'  // Proporcionar un email de prueba
    };
    
    console.log('Sending request body:', JSON.stringify(requestBody));
    
    const { data, error } = await supabase.functions.invoke('stripe-checkout', {
      body: requestBody
    });
    
    if (error) {
      console.error('Error creating test checkout:', error);
      throw error;
    }
    
    return {
      url: data.url,
      sessionId: data.sessionId
    };
  } catch (error) {
    console.error('Error in createTestCheckout:', error);
    throw error instanceof Error ? error : new Error('Unknown error creating test checkout');
  }
}
