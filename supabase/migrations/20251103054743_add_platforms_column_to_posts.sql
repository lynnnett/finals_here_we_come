/*
  # Add platforms column to posts table

  ## Changes
  - Adds `platforms` column to posts table
    - Type: text array (text[])
    - Stores selected social media platforms for the post
    - Default: empty array '{}'
    - Nullable: false
  - Adds `platform_captions` column to posts table
    - Type: jsonb
    - Stores platform-specific caption overrides
    - Nullable: true

  ## Purpose
  This migration adds columns to store platform selections directly in the posts table
  for easier access and querying. The platforms array stores which platforms the user
  selected (e.g., ['instagram', 'linkedin', 'tiktok']).

  ## Notes
  - Uses IF NOT EXISTS to prevent errors if columns already exist
  - Maintains backward compatibility with existing data
*/

-- Add platforms column to posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'platforms'
  ) THEN
    ALTER TABLE posts ADD COLUMN platforms text[] DEFAULT '{}' NOT NULL;
  END IF;
END $$;

-- Add platform_captions column to posts table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'platform_captions'
  ) THEN
    ALTER TABLE posts ADD COLUMN platform_captions jsonb;
  END IF;
END $$;

-- Create index for platforms column for faster queries
CREATE INDEX IF NOT EXISTS idx_posts_platforms ON posts USING GIN (platforms);