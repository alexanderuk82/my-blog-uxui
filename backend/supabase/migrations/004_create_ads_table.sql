-- Create ads table for dynamic advertisement management
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    cta_text VARCHAR(100), -- Call to action text
    cta_url TEXT,
    background_from VARCHAR(50), -- Gradient from color
    background_to VARCHAR(50),   -- Gradient to color
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    position VARCHAR(50), -- e.g., 'sidebar', 'header', 'footer'
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add sample ad
INSERT INTO ads (
    title,
    description,
    cta_text,
    cta_url,
    background_from,
    background_to,
    active,
    position
) VALUES (
    'Premium UI Kit',
    'UI Components for your next project',
    'View Offer',
    'https://uihub.com/premium',
    'rgb(59, 130, 246)',
    'rgb(124, 58, 237)',
    true,
    'sidebar'
);
