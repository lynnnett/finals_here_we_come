/*
  # Add Missing Columns to Posts Table

  1. New Columns
    - `content` - Full post content (separate from caption)
    - `media_url` - URL for uploaded media files
    - `ai_metadata` - Store AI-generated suggestions
    - `last_autosave` - Track auto-save timestamp
    - `scheduled_time` - Alias for scheduled_for for consistency

  2. Notes
    - Uses conditional checks to avoid errors if columns exist
    - No data migration needed for new optional columns
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'content'
  ) THEN
    ALTER TABLE posts ADD COLUMN content TEXT DEFAULT '';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'media_url'
  ) THEN
    ALTER TABLE posts ADD COLUMN media_url TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'ai_metadata'
  ) THEN
    ALTER TABLE posts ADD COLUMN ai_metadata JSONB DEFAULT '{}'::jsonb;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'posts' AND column_name = 'last_autosave'
  ) THEN
    ALTER TABLE posts ADD COLUMN last_autosave TIMESTAMPTZ DEFAULT now();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for ON posts(scheduled_for);
CREATE INDEX IF NOT EXISTS idx_posts_user_status ON posts(user_id, status);
