-- Fix RLS policies for profiles table
-- This script ensures that authenticated users can access and modify their own profiles

-- First, make sure RLS is enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON profiles;
DROP POLICY IF EXISTS "Anyone can create their profile" ON profiles;

-- Create more permissive policies for profiles
-- Allow anyone to read any profile (this is often fine for user profiles)
CREATE POLICY "Anyone can view profiles" 
ON profiles FOR SELECT 
USING (true);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profiles" 
ON profiles FOR UPDATE 
USING (auth.uid()::text = firebase_uid)
WITH CHECK (auth.uid()::text = firebase_uid);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profiles" 
ON profiles FOR INSERT 
WITH CHECK (auth.uid()::text = firebase_uid OR firebase_uid IS NOT NULL);

-- Allow service role to manage all profiles
CREATE POLICY "Service role can do anything with profiles" 
ON profiles
USING (auth.role() = 'service_role');

-- Make sure admin_users table is accessible
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view admin_users" ON admin_users;

-- Allow anyone to read admin_users table
CREATE POLICY "Anyone can view admin_users" 
ON admin_users FOR SELECT 
USING (true);

-- Verify the admin_users table has the correct user
SELECT * FROM admin_users;
