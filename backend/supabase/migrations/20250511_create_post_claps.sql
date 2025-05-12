-- Create post_claps table
CREATE TABLE IF NOT EXISTS post_claps (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    clap_count INTEGER DEFAULT 0 CHECK (clap_count >= 0 AND clap_count <= 50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS post_claps_post_id_idx ON post_claps(post_id);
CREATE INDEX IF NOT EXISTS post_claps_user_id_idx ON post_claps(user_id);
CREATE UNIQUE INDEX IF NOT EXISTS post_claps_post_user_idx ON post_claps(post_id, user_id);

-- Add RLS policies
ALTER TABLE post_claps ENABLE ROW LEVEL SECURITY;

-- Policy for inserting claps (authenticated users only)
CREATE POLICY "Users can add claps" ON post_claps
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND
        clap_count <= 50
    );

-- Policy for updating own claps
CREATE POLICY "Users can update their own claps" ON post_claps
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (
        clap_count <= 50
    );

-- Policy for viewing claps (public)
CREATE POLICY "Anyone can view claps" ON post_claps
    FOR SELECT
    TO public
    USING (true);

-- Function to update updated_at on clap update
CREATE OR REPLACE FUNCTION update_post_claps_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER update_post_claps_updated_at
    BEFORE UPDATE ON post_claps
    FOR EACH ROW
    EXECUTE FUNCTION update_post_claps_updated_at();

-- Add comment for documentation
COMMENT ON TABLE post_claps IS 'Stores user claps for blog posts with a limit of 50 claps per user per post';
