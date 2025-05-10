-- Create admin_users table if it doesn't exist
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add admin user(s)
-- Add your Google email as an admin user
INSERT INTO admin_users (email)
VALUES ('alexanderburgosuk82@gmail.com') -- Replace with your actual Google email
ON CONFLICT (email) DO NOTHING;
