-- =====================================================
-- PERSONALITY STAMP - SUPABASE SETUP
-- =====================================================
-- Run this SQL in your Supabase SQL Editor
-- After running, create a storage bucket named 'selfies'
-- =====================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  dob DATE NOT NULL,
  nationality TEXT NOT NULL,
  sex TEXT NOT NULL,
  human_robot TEXT NOT NULL,
  personality_type TEXT,
  sigil_url TEXT,
  selfie_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS users_created_at_idx ON users(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public access for demo purposes
-- In production, you would restrict these policies
CREATE POLICY "Allow public insert" ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON users
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public update" ON users
  FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

-- =====================================================
-- AFTER RUNNING THIS SQL:
-- =====================================================
-- 1. Go to Storage in Supabase dashboard
-- 2. Click "New bucket"
-- 3. Name it: selfies
-- 4. Make it PUBLIC (important for web display)
-- 5. Click "Create bucket"
-- 
-- Optional: Set up storage policies
-- =====================================================

-- Storage policies for 'selfies' bucket (run AFTER creating bucket)
-- These allow public read access and authenticated uploads

-- Allow public to read selfies
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'selfies');

-- Allow anyone to upload selfies
CREATE POLICY "Anyone can upload selfies"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'selfies');

-- Allow anyone to update their selfies
CREATE POLICY "Anyone can update selfies"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'selfies')
WITH CHECK (bucket_id = 'selfies');

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Your tables and storage are ready to use.
-- Update your .env.local with Supabase credentials:
-- NEXT_PUBLIC_SUPABASE_URL=your-project-url
-- NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
-- =====================================================
