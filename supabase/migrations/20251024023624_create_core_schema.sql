/*
  # Social Media Management Platform - Core Schema

  ## Overview
  This migration creates the foundational database structure for a comprehensive AI-powered social media management platform.

  ## 1. New Tables

  ### `users`
  Extends Supabase auth.users with application-specific profile data
  - `id` (uuid, primary key) - Links to auth.users
  - `email` (text) - User's email address
  - `full_name` (text) - User's full name
  - `company_name` (text) - Optional company/startup name
  - `industry` (text) - User's industry for AI personalization
  - `onboarding_completed` (boolean) - Tracks onboarding progress
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `social_accounts`
  Stores connected social media platform credentials
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `platform` (text) - Platform name: instagram, tiktok, linkedin, twitter
  - `platform_user_id` (text) - User ID from the platform
  - `platform_username` (text) - Username on the platform
  - `access_token` (text) - Encrypted OAuth token
  - `refresh_token` (text) - Encrypted refresh token
  - `token_expires_at` (timestamptz) - Token expiration time
  - `is_active` (boolean) - Whether account is currently active
  - `connected_at` (timestamptz) - When account was connected
  - `updated_at` (timestamptz)

  ### `posts`
  Central table for all social media posts (drafts and published)
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `title` (text) - Internal post title/reference
  - `caption` (text) - Main post caption
  - `status` (text) - draft, scheduled, published, failed
  - `scheduled_for` (timestamptz) - When to publish
  - `published_at` (timestamptz) - When actually published
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `post_platforms`
  Junction table for multi-platform posts with platform-specific content
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key) - References posts
  - `social_account_id` (uuid, foreign key) - References social_accounts
  - `platform` (text) - Platform name for easy filtering
  - `caption_override` (text) - Platform-specific caption if different
  - `hashtags` (text array) - Platform-specific hashtags
  - `platform_post_id` (text) - ID from platform after publishing
  - `status` (text) - pending, publishing, published, failed
  - `error_message` (text) - Error details if failed
  - `published_at` (timestamptz)
  - `created_at` (timestamptz)

  ### `post_assets`
  Stores all media assets for posts
  - `id` (uuid, primary key)
  - `post_id` (uuid, foreign key) - References posts
  - `asset_type` (text) - image, video
  - `original_url` (text) - URL to original uploaded file
  - `storage_path` (text) - Path in Supabase storage
  - `file_size` (integer) - File size in bytes
  - `mime_type` (text) - File MIME type
  - `width` (integer) - Image/video width
  - `height` (integer) - Image/video height
  - `duration` (integer) - Video duration in seconds
  - `display_order` (integer) - Order in post carousel
  - `created_at` (timestamptz)

  ### `asset_variants`
  Platform-specific resized versions of assets
  - `id` (uuid, primary key)
  - `asset_id` (uuid, foreign key) - References post_assets
  - `platform` (text) - Target platform
  - `format_type` (text) - square, portrait, landscape, story
  - `url` (text) - URL to resized asset
  - `storage_path` (text) - Path in storage
  - `width` (integer)
  - `height` (integer)
  - `created_at` (timestamptz)

  ### `ai_conversations`
  Tracks AI co-pilot chat sessions
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `title` (text) - Auto-generated conversation title
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `ai_messages`
  Individual messages in AI conversations
  - `id` (uuid, primary key)
  - `conversation_id` (uuid, foreign key) - References ai_conversations
  - `role` (text) - user or assistant
  - `content` (text) - Message content
  - `created_at` (timestamptz)

  ### `caption_templates`
  User-saved caption templates
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `name` (text) - Template name
  - `tone` (text) - professional, witty, chill, inspirational, urgent
  - `purpose` (text) - announcement, engagement, traffic, education
  - `template_text` (text) - The template content
  - `platforms` (text array) - Target platforms
  - `created_at` (timestamptz)

  ### `calendar_events`
  Imported calendar events and custom events
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `title` (text) - Event title
  - `description` (text) - Event description
  - `event_date` (date) - Event date
  - `event_type` (text) - holiday, product_launch, industry_event, custom
  - `source` (text) - google_calendar, manual, system
  - `external_id` (text) - ID from external calendar
  - `created_at` (timestamptz)

  ### `analytics_snapshots`
  Periodic snapshots of post performance metrics
  - `id` (uuid, primary key)
  - `post_platform_id` (uuid, foreign key) - References post_platforms
  - `likes` (integer)
  - `shares` (integer)
  - `comments` (integer)
  - `views` (integer)
  - `engagement_rate` (numeric) - Calculated engagement rate
  - `profile_visits` (integer)
  - `snapshot_at` (timestamptz) - When metrics were captured
  - `created_at` (timestamptz)

  ### `onboarding_progress`
  Tracks user progress through onboarding steps
  - `id` (uuid, primary key)
  - `user_id` (uuid, foreign key) - References users
  - `step_name` (text) - Name of onboarding step
  - `completed` (boolean) - Whether step is completed
  - `completed_at` (timestamptz)
  - `created_at` (timestamptz)

  ## 2. Security

  All tables have Row Level Security (RLS) enabled with policies that:
  - Restrict all access to authenticated users only
  - Ensure users can only access their own data
  - Use auth.uid() for user identification

  ## 3. Indexes

  Indexes added for:
  - Foreign key relationships
  - Frequently queried fields (user_id, platform, status, scheduled_for)
  - Date-based queries (created_at, published_at, event_date)

  ## 4. Important Notes

  - All tokens are stored as text and should be encrypted at the application layer
  - Timestamps use timestamptz for timezone awareness
  - Arrays are used for hashtags and platforms for flexible multi-value storage
  - Status fields use text for flexibility and clarity
*/

-- Create users profile table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  company_name text,
  industry text,
  onboarding_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram', 'tiktok', 'linkedin', 'twitter')),
  platform_user_id text NOT NULL,
  platform_username text NOT NULL,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  is_active boolean DEFAULT true,
  connected_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, platform_user_id)
);

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social accounts"
  ON social_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social accounts"
  ON social_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social accounts"
  ON social_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social accounts"
  ON social_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_accounts_platform ON social_accounts(platform);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text,
  caption text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
  scheduled_for timestamptz,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own posts"
  ON posts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_for ON posts(scheduled_for);

-- Create post_platforms table
CREATE TABLE IF NOT EXISTS post_platforms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform text NOT NULL,
  caption_override text,
  hashtags text[] DEFAULT '{}',
  platform_post_id text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
  error_message text,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_platforms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own post platforms"
  ON post_platforms FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_platforms.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own post platforms"
  ON post_platforms FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_platforms.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own post platforms"
  ON post_platforms FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_platforms.post_id
      AND posts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_platforms.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own post platforms"
  ON post_platforms FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_platforms.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_post_platforms_post_id ON post_platforms(post_id);
CREATE INDEX IF NOT EXISTS idx_post_platforms_platform ON post_platforms(platform);

-- Create post_assets table
CREATE TABLE IF NOT EXISTS post_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  asset_type text NOT NULL CHECK (asset_type IN ('image', 'video')),
  original_url text NOT NULL,
  storage_path text NOT NULL,
  file_size integer,
  mime_type text,
  width integer,
  height integer,
  duration integer,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own post assets"
  ON post_assets FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_assets.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own post assets"
  ON post_assets FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_assets.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own post assets"
  ON post_assets FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_assets.post_id
      AND posts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_assets.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own post assets"
  ON post_assets FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM posts
      WHERE posts.id = post_assets.post_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_post_assets_post_id ON post_assets(post_id);

-- Create asset_variants table
CREATE TABLE IF NOT EXISTS asset_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_id uuid NOT NULL REFERENCES post_assets(id) ON DELETE CASCADE,
  platform text NOT NULL,
  format_type text NOT NULL CHECK (format_type IN ('square', 'portrait', 'landscape', 'story')),
  url text NOT NULL,
  storage_path text NOT NULL,
  width integer,
  height integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE asset_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own asset variants"
  ON asset_variants FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM post_assets
      JOIN posts ON posts.id = post_assets.post_id
      WHERE post_assets.id = asset_variants.asset_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own asset variants"
  ON asset_variants FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM post_assets
      JOIN posts ON posts.id = post_assets.post_id
      WHERE post_assets.id = asset_variants.asset_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own asset variants"
  ON asset_variants FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM post_assets
      JOIN posts ON posts.id = post_assets.post_id
      WHERE post_assets.id = asset_variants.asset_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_asset_variants_asset_id ON asset_variants(asset_id);

-- Create ai_conversations table
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text DEFAULT 'New Conversation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai conversations"
  ON ai_conversations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai conversations"
  ON ai_conversations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai conversations"
  ON ai_conversations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own ai conversations"
  ON ai_conversations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON ai_conversations(user_id);

-- Create ai_messages table
CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own ai messages"
  ON ai_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own ai messages"
  ON ai_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM ai_conversations
      WHERE ai_conversations.id = ai_messages.conversation_id
      AND ai_conversations.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);

-- Create caption_templates table
CREATE TABLE IF NOT EXISTS caption_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  tone text CHECK (tone IN ('professional', 'witty', 'chill', 'inspirational', 'urgent')),
  purpose text CHECK (purpose IN ('announcement', 'engagement', 'traffic', 'education')),
  template_text text NOT NULL,
  platforms text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE caption_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own caption templates"
  ON caption_templates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own caption templates"
  ON caption_templates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own caption templates"
  ON caption_templates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own caption templates"
  ON caption_templates FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_caption_templates_user_id ON caption_templates(user_id);

-- Create calendar_events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date date NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('holiday', 'product_launch', 'industry_event', 'custom')),
  source text NOT NULL DEFAULT 'manual' CHECK (source IN ('google_calendar', 'manual', 'system')),
  external_id text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar events"
  ON calendar_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own calendar events"
  ON calendar_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own calendar events"
  ON calendar_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own calendar events"
  ON calendar_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id ON calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_event_date ON calendar_events(event_date);

-- Create analytics_snapshots table
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_platform_id uuid NOT NULL REFERENCES post_platforms(id) ON DELETE CASCADE,
  likes integer DEFAULT 0,
  shares integer DEFAULT 0,
  comments integer DEFAULT 0,
  views integer DEFAULT 0,
  engagement_rate numeric(5,2) DEFAULT 0,
  profile_visits integer DEFAULT 0,
  snapshot_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE analytics_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analytics snapshots"
  ON analytics_snapshots FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM post_platforms
      JOIN posts ON posts.id = post_platforms.post_id
      WHERE post_platforms.id = analytics_snapshots.post_platform_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own analytics snapshots"
  ON analytics_snapshots FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM post_platforms
      JOIN posts ON posts.id = post_platforms.post_id
      WHERE post_platforms.id = analytics_snapshots.post_platform_id
      AND posts.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_post_platform_id ON analytics_snapshots(post_platform_id);
CREATE INDEX IF NOT EXISTS idx_analytics_snapshots_snapshot_at ON analytics_snapshots(snapshot_at);

-- Create onboarding_progress table
CREATE TABLE IF NOT EXISTS onboarding_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, step_name)
);

ALTER TABLE onboarding_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own onboarding progress"
  ON onboarding_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own onboarding progress"
  ON onboarding_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own onboarding progress"
  ON onboarding_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_onboarding_progress_user_id ON onboarding_progress(user_id);