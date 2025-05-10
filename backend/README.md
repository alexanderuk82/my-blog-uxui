# UI HUB Backend

This directory contains the backend configuration and services for the UI HUB project, which uses Supabase as the primary database and storage solution.

## Structure

```
backend/
├── supabase/
│   ├── config/           # Configuration files for Supabase
│   ├── migrations/       # SQL migration files for database schema
│   ├── functions/        # Edge functions and database functions
│   └── services/         # Service modules for interacting with Supabase
└── README.md             # This file
```

## Getting Started

### 1. Set up Supabase

1. Create a new project in [Supabase](https://supabase.com)
2. Copy your project URL and anon key from the Supabase dashboard
3. Create a `.env` file in the root directory based on `.env.example`
4. Add your Supabase URL and keys to the `.env` file

### 2. Run Database Migrations

1. Install the Supabase CLI if you haven't already:
   ```bash
   npm install -g supabase
   ```

2. Login to Supabase:
   ```bash
   supabase login
   ```

3. Link your project:
   ```bash
   supabase link --project-ref <your-project-ref>
   ```

4. Apply the migrations:
   ```bash
   supabase db push
   ```

## Integration with Firebase Auth

This project uses Firebase Authentication for user management, but stores user data and application data in Supabase. The integration works as follows:

1. Users authenticate through Firebase Auth
2. User profiles are synchronized with Supabase using the `syncUserWithSupabase` function
3. The Firebase UID is stored in the `profiles` table to link the two systems
4. Admin access is controlled through the `admin_users` table in Supabase

## Services

### Authentication Service (`services/auth.js`)

Handles user authentication and synchronization between Firebase and Supabase.

```javascript
import authService from '../backend/supabase/services/auth';

// Sync a Firebase user with Supabase
await authService.syncUserWithSupabase(firebaseUser);

// Check if a user has admin access
const isAdmin = await authService.checkAdminAccess(userEmail);
```

### Database Service (`services/database.js`)

Provides methods for interacting with the Supabase database tables.

```javascript
import dbService from '../backend/supabase/services/database';

// Get blog posts
const posts = await dbService.blog.getPosts(1, 10);

// Get a product by slug
const product = await dbService.product.getProductBySlug('product-slug');

// Create an order
const order = await dbService.order.createOrder(orderData);
```

## Database Schema

The database schema is defined in the migration files. The main tables are:

- `profiles`: User profiles
- `admin_users`: Users with admin access
- `posts`: Blog posts
- `products`: Shop products
- `categories`: Categories for posts and products
- `comments`: Comments on blog posts
- `reviews`: Reviews for products
- `orders`: Customer orders
- `order_items`: Items in orders
- `user_library`: Digital products purchased by users

## Security

The database uses Row Level Security (RLS) policies to ensure that:

1. Users can only access their own data
2. Published content is publicly accessible
3. Admin users have access to all data
4. Sensitive operations require authentication

## Environment Variables

The following environment variables are required:

- `REACT_APP_SUPABASE_URL`: Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY`: Your Supabase anonymous key

For server-side operations, you may also need:

- `SUPABASE_SERVICE_KEY`: Your Supabase service role key (never expose this in client-side code)

## Adding New Tables or Fields

1. Create a new migration file in the `migrations` directory
2. Apply the migration using the Supabase CLI
3. Update the corresponding service in the `services` directory

## Best Practices

1. Always use the service modules instead of direct Supabase client calls
2. Handle errors properly in all database operations
3. Use transactions for operations that modify multiple tables
4. Keep sensitive operations server-side
5. Test thoroughly before deploying to production
