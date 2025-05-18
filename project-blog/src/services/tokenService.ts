import { supabase } from '../lib/supabaseClient';

/**
 * Interface for token validation response
 */
interface TokenValidationResponse {
  valid: boolean;
  session?: {
    id: string;
    stripe_session_id: string;
    customer_email: string;
    status: string;
    amount: number;
    created_at: string;
    completed_at: string | null;
    order_id: string | null;
  };
  error?: string;
}

/**
 * Validates a checkout token (success or cancel)
 * @param token The token to validate
 * @param type The type of token ('success' or 'cancel')
 * @param markAsUsed Whether to mark the token as used after validation
 * @returns TokenValidationResponse object
 */
export async function validateCheckoutToken(
  token: string,
  type: 'success' | 'cancel',
  markAsUsed: boolean = false
): Promise<TokenValidationResponse> {
  try {
    // Validar parámetros
    if (!token || !['success', 'cancel'].includes(type)) {
      return {
        valid: false,
        error: 'Invalid token or type parameter'
      };
    }

    // Llamar a la función Edge para validar el token
    const { data, error } = await supabase.functions.invoke('validate-checkout-token', {
      body: { token, type, markAsUsed }
    });

    if (error) {
      console.error('Error validating token:', error);
      return {
        valid: false,
        error: error.message
      };
    }

    return data as TokenValidationResponse;
  } catch (error) {
    console.error('Error in validateCheckoutToken:', error);
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
}
