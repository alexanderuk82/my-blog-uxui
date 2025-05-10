-- Enable Row Level Security for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Create policies for posts table
-- Policy for reading published posts (anyone can read published posts)
CREATE POLICY "Anyone can read published posts" 
ON posts FOR SELECT 
USING (published = true);

-- Policy for creating posts (authenticated users can create posts)
CREATE POLICY "Authenticated users can create posts" 
ON posts FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Policy for updating own posts (users can update their own posts)
CREATE POLICY "Users can update own posts" 
ON posts FOR UPDATE 
USING (auth.uid()::text = author_id::text)
WITH CHECK (auth.uid()::text = author_id::text);

-- Policy for deleting own posts (users can delete their own posts)
CREATE POLICY "Users can delete own posts" 
ON posts FOR DELETE 
USING (auth.uid()::text = author_id::text);

-- Create policies for profiles table
-- Policy for reading profiles (anyone can read profiles)
CREATE POLICY "Anyone can read profiles" 
ON profiles FOR SELECT 
USING (true);

-- Policy for updating own profile (users can update their own profile)
CREATE POLICY "Users can update own profile" 
ON profiles FOR UPDATE 
USING (auth.uid()::text = firebase_uid)
WITH CHECK (auth.uid()::text = firebase_uid);

-- Create policies for comments table
-- Policy for reading approved comments (anyone can read approved comments)
CREATE POLICY "Anyone can read approved comments" 
ON comments FOR SELECT 
USING (is_approved = true);

-- Policy for creating comments (authenticated users can create comments)
CREATE POLICY "Authenticated users can create comments" 
ON comments FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Policy for updating own comments (users can update their own comments)
CREATE POLICY "Users can update own comments" 
ON comments FOR UPDATE 
USING (auth.uid()::text = author_id::text)
WITH CHECK (auth.uid()::text = author_id::text);

-- Policy for deleting own comments (users can delete their own comments)
CREATE POLICY "Users can delete own comments" 
ON comments FOR DELETE 
USING (auth.uid()::text = author_id::text);

-- Create policies for categories table
-- Policy for reading categories (anyone can read categories)
CREATE POLICY "Anyone can read categories" 
ON categories FOR SELECT 
USING (true);

-- Create policies for posts_categories table
-- Policy for reading posts_categories (anyone can read posts_categories)
CREATE POLICY "Anyone can read posts_categories" 
ON posts_categories FOR SELECT 
USING (true);

-- Create policies for products table
-- Policy for reading products (anyone can read products)
CREATE POLICY "Anyone can read products" 
ON products FOR SELECT 
USING (true);

-- Create policies for orders table
-- Policy for reading own orders (users can read their own orders)
CREATE POLICY "Users can read own orders" 
ON orders FOR SELECT 
USING (auth.uid()::text = user_id::text);

-- Policy for creating orders (authenticated users can create orders)
CREATE POLICY "Authenticated users can create orders" 
ON orders FOR INSERT 
TO authenticated
WITH CHECK (auth.uid()::text = user_id::text);

-- Create policies for order_items table
-- Policy for reading own order items (users can read their own order items)
CREATE POLICY "Users can read own order items" 
ON order_items FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND auth.uid()::text = orders.user_id::text
  )
);

-- Policy for creating order items (authenticated users can create order items)
CREATE POLICY "Authenticated users can create order items" 
ON order_items FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND auth.uid()::text = orders.user_id::text
  )
);

-- Create a special policy for test posts in development
-- This allows creating posts without authentication for testing purposes
CREATE POLICY "Allow test posts creation" 
ON posts FOR INSERT 
WITH CHECK (true);
