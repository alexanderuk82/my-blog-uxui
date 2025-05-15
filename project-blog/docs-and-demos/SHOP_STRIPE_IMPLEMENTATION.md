# Digital Shop Implementation with Stripe Integration

## Table of Contents
1. [Project Structure](#project-structure)
2. [Stripe Integration](#stripe-integration)
3. [Page Implementation](#page-implementation)
4. [Cart System](#cart-system)
5. [Customer Portal](#customer-portal)
6. [Webhooks & Sync](#webhooks--sync)

## Project Structure

### Folders and Files
```
src/
├── components/
│   └── shop/
│       ├── ProductCard.jsx
│       ├── ProductGrid.jsx
│       ├── ShopFilters.jsx
│       ├── CartDrawer.jsx
│       ├── CartItem.jsx
│       ├── OrderCard.jsx
│       └── CheckoutButton.jsx
├── pages/
│   ├── ShopPage.jsx
│   ├── ProductPage.jsx
│   └── OrdersPage.jsx
├── hooks/
│   ├── useCart.js
│   └── useOrders.js
├── context/
│   └── CartContext.js
└── services/
    └── shop.js
```

### Database Schema (Supabase)

```sql
-- Products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_product_id TEXT NOT NULL,
  stripe_price_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL NOT NULL,
  images JSONB,
  category TEXT,
  tags TEXT[],
  features JSONB,
  is_digital BOOLEAN DEFAULT false,
  download_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  stripe_session_id TEXT NOT NULL,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Order Items
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders NOT NULL,
  product_id UUID REFERENCES products NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL NOT NULL
);
```

## Stripe Integration

### 1. Product Creation
Products should be created in your admin panel and synced with Stripe:

```javascript
// services/shop.js
export const createProduct = async (productData) => {
  try {
    // 1. Create product in Stripe
    const stripeProduct = await mcp6_create_product({
      name: productData.name,
      description: productData.description
    });

    // 2. Create price in Stripe
    const stripePrice = await mcp6_create_price({
      product: stripeProduct.id,
      unit_amount: Math.round(productData.price * 100), // Convert to cents
      currency: 'usd'
    });

    // 3. Save in Supabase with Stripe references
    const { data, error } = await supabase
      .from('products')
      .insert({
        name: productData.name,
        description: productData.description,
        price: productData.price,
        images: productData.images,
        category: productData.category,
        stripe_product_id: stripeProduct.id,
        stripe_price_id: stripePrice.id
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
```

### 2. Customer Management
When a user registers, create a Stripe customer:

```javascript
// services/shop.js
export const createCustomer = async (userData) => {
  try {
    const customer = await mcp6_create_customer({
      name: userData.name,
      email: userData.email
    });

    // Update user profile with Stripe customer ID
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id })
      .eq('id', userData.id);

    return customer;
  } catch (error) {
    console.error('Error creating customer:', error);
    throw error;
  }
};
```

## Page Implementation

### ShopPage Component
```javascript
// pages/ShopPage.jsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ProductGrid, ShopFilters } from '../components/shop';

export const ShopPage = () => {
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    sortBy: 'newest'
  });

  const { data: products, isLoading } = useQuery(
    ['products', filters],
    () => fetchProducts(filters)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <ShopFilters 
          filters={filters} 
          onChange={setFilters} 
        />
        <ProductGrid 
          products={products} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  );
};
```

### ProductPage Component
```javascript
// pages/ProductPage.jsx
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '../hooks/useCart';

export const ProductPage = () => {
  const { productId } = useParams();
  const { addToCart } = useCart();
  
  const { data: product, isLoading } = useQuery(
    ['product', productId],
    () => fetchProduct(productId)
  );

  const handlePurchase = async () => {
    // Create payment link for single product
    const paymentLink = await mcp6_create_payment_link({
      price: product.stripe_price_id,
      quantity: 1
    });

    window.location.href = paymentLink.url;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-2 gap-8">
        <ProductGallery images={product?.images} />
        
        <div className="space-y-6">
          <h1 className="text-3xl font-bold">{product?.name}</h1>
          <p className="text-xl">${product?.price}</p>
          <div className="prose">{product?.description}</div>
          
          <div className="flex gap-4">
            <button 
              onClick={() => addToCart(product)}
              className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg"
            >
              Add to Cart
            </button>
            <button 
              onClick={handlePurchase}
              className="flex-1 bg-primary text-white py-3 rounded-lg"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## Cart System

### Cart Context
```javascript
// context/CartContext.js
import { createContext, useReducer } from 'react';

export const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM':
      // Add item logic
    case 'REMOVE_ITEM':
      // Remove item logic
    case 'UPDATE_QUANTITY':
      // Update quantity logic
    case 'CLEAR_CART':
      return { items: [] };
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, { items: [] });

  return (
    <CartContext.Provider value={{ cart, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};
```

### Checkout Process
```javascript
// components/shop/CheckoutButton.jsx
export const CheckoutButton = ({ cart }) => {
  const handleCheckout = async () => {
    try {
      // 1. Create invoice
      const invoice = await mcp6_create_invoice({
        customer: cart.customerId,
        days_until_due: 7
      });

      // 2. Add items to invoice
      for (const item of cart.items) {
        await mcp6_create_invoice_item({
          customer: cart.customerId,
          price: item.stripe_price_id,
          invoice: invoice.id
        });
      }

      // 3. Finalize invoice
      await mcp6_finalize_invoice({
        invoice: invoice.id
      });

      // Clear cart after successful checkout
      dispatch({ type: 'CLEAR_CART' });

    } catch (error) {
      console.error('Checkout error:', error);
      // Show error toast
    }
  };

  return (
    <button
      onClick={handleCheckout}
      className="w-full bg-primary text-white py-3 rounded-lg"
    >
      Proceed to Checkout
    </button>
  );
};
```

## Customer Portal

### Orders Page
```javascript
// pages/OrdersPage.jsx
import { useQuery } from '@tanstack/react-query';

export const OrdersPage = () => {
  // Fetch orders using Stripe MCP
  const { data: orders } = useQuery(['orders'], async () => {
    const paymentIntents = await mcp6_list_payment_intents({
      customer: currentUser.stripeCustomerId,
      limit: 10
    });
    return paymentIntents;
  });

  const redirectToPortal = async () => {
    // Create portal session and redirect
    const session = await createPortalSession(user.stripeCustomerId);
    window.location.href = session.url;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <button 
          onClick={redirectToPortal}
          className="text-primary hover:underline"
        >
          Manage Payments →
        </button>
      </div>

      <div className="space-y-4">
        {orders?.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
};
```

## Webhooks & Sync

### Webhook Handler
```javascript
// api/webhooks/stripe.js
export const handleWebhook = async (req, res) => {
  const event = req.body;

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = await mcp6_list_payment_intents({
          payment_intent: event.data.object.id
        });
        await updateOrderStatus(paymentIntent);
        break;

      case 'charge.refunded':
        await mcp6_create_refund({
          payment_intent: event.data.object.payment_intent
        });
        break;
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
};
```

## Implementation Steps

1. **Setup Phase**
   - Create database tables in Supabase
   - Set up webhook endpoints
   - Configure error handling

2. **Shop Implementation**
   - Create ShopPage with filters
   - Implement ProductPage
   - Set up cart system

3. **Stripe Integration**
   - Product synchronization
   - Customer management
   - Payment processing
   - Portal integration

4. **Testing**
   - Test payment flow
   - Test webhooks
   - Test order management
   - Test customer portal

Would you like to start with any specific component or phase?
