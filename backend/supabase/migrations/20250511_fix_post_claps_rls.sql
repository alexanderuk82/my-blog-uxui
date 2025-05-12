-- Drop existing table and recreate with correct types
DROP TABLE IF EXISTS post_claps;

-- Create the table with Firebase compatible types
CREATE TABLE post_claps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL,
    user_id TEXT NOT NULL, -- Changed to TEXT to support Firebase UIDs
    clap_count INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_post UNIQUE (user_id, post_id)
);

-- Enable RLS
ALTER TABLE post_claps ENABLE ROW LEVEL SECURITY;

-- Create new policies
CREATE POLICY "Enable read access for all users" ON post_claps
    FOR SELECT USING (true);

CREATE POLICY "Enable insert/update for authenticated users" ON post_claps
    FOR ALL
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Create indexes
CREATE INDEX post_claps_user_id_idx ON post_claps(user_id);
CREATE INDEX post_claps_post_id_idx ON post_claps(post_id);
