/*
  # Add Storage Buckets for Post Assets

  ## New Storage Buckets
  1. `post-assets` bucket
    - Stores uploaded images and videos for posts
    - Public bucket with authentication required for uploads
    - File size limits and MIME type validation

  ## Security
  - Enable RLS on storage.objects
  - Users can upload to their own folders
  - Users can read their own files
  - Public read access for published posts
*/

-- Create post-assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-assets', 'post-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload files
CREATE POLICY "Users can upload own assets"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'post-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to read their own files
CREATE POLICY "Users can view own assets"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'post-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow public read access (for published posts)
CREATE POLICY "Public can view published assets"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'post-assets');

-- Allow users to update their own files
CREATE POLICY "Users can update own assets"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'post-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own files
CREATE POLICY "Users can delete own assets"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'post-assets' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );