export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          company_name: string | null
          industry: string | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          company_name?: string | null
          industry?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          company_name?: string | null
          industry?: string | null
          onboarding_completed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      social_accounts: {
        Row: {
          id: string
          user_id: string
          platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter'
          platform_user_id: string
          platform_username: string
          access_token: string | null
          refresh_token: string | null
          token_expires_at: string | null
          is_active: boolean
          connected_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform: 'instagram' | 'tiktok' | 'linkedin' | 'twitter'
          platform_user_id: string
          platform_username: string
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          is_active?: boolean
          connected_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform?: 'instagram' | 'tiktok' | 'linkedin' | 'twitter'
          platform_user_id?: string
          platform_username?: string
          access_token?: string | null
          refresh_token?: string | null
          token_expires_at?: string | null
          is_active?: boolean
          connected_at?: string
          updated_at?: string
        }
      }
      posts: {
        Row: {
          id: string
          user_id: string
          title: string | null
          caption: string | null
          status: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_for: string | null
          published_at: string | null
          platforms: string[]
          platform_captions: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          caption?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_for?: string | null
          published_at?: string | null
          platforms?: string[]
          platform_captions?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          caption?: string | null
          status?: 'draft' | 'scheduled' | 'published' | 'failed'
          scheduled_for?: string | null
          published_at?: string | null
          platforms?: string[]
          platform_captions?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      post_platforms: {
        Row: {
          id: string
          post_id: string
          social_account_id: string
          platform: string
          caption_override: string | null
          hashtags: string[]
          platform_post_id: string | null
          status: 'pending' | 'publishing' | 'published' | 'failed'
          error_message: string | null
          published_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          social_account_id: string
          platform: string
          caption_override?: string | null
          hashtags?: string[]
          platform_post_id?: string | null
          status?: 'pending' | 'publishing' | 'published' | 'failed'
          error_message?: string | null
          published_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          social_account_id?: string
          platform?: string
          caption_override?: string | null
          hashtags?: string[]
          platform_post_id?: string | null
          status?: 'pending' | 'publishing' | 'published' | 'failed'
          error_message?: string | null
          published_at?: string | null
          created_at?: string
        }
      }
      post_assets: {
        Row: {
          id: string
          post_id: string
          asset_type: 'image' | 'video'
          original_url: string
          storage_path: string
          file_size: number | null
          mime_type: string | null
          width: number | null
          height: number | null
          duration: number | null
          display_order: number
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          asset_type: 'image' | 'video'
          original_url: string
          storage_path: string
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          duration?: number | null
          display_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          asset_type?: 'image' | 'video'
          original_url?: string
          storage_path?: string
          file_size?: number | null
          mime_type?: string | null
          width?: number | null
          height?: number | null
          duration?: number | null
          display_order?: number
          created_at?: string
        }
      }
      asset_variants: {
        Row: {
          id: string
          asset_id: string
          platform: string
          format_type: 'square' | 'portrait' | 'landscape' | 'story'
          url: string
          storage_path: string
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          asset_id: string
          platform: string
          format_type: 'square' | 'portrait' | 'landscape' | 'story'
          url: string
          storage_path: string
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          asset_id?: string
          platform?: string
          format_type?: 'square' | 'portrait' | 'landscape' | 'story'
          url?: string
          storage_path?: string
          width?: number | null
          height?: number | null
          created_at?: string
        }
      }
      ai_conversations: {
        Row: {
          id: string
          user_id: string
          title: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          created_at?: string
          updated_at?: string
        }
      }
      ai_messages: {
        Row: {
          id: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: 'user' | 'assistant'
          content: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          role?: 'user' | 'assistant'
          content?: string
          created_at?: string
        }
      }
      caption_templates: {
        Row: {
          id: string
          user_id: string
          name: string
          tone: 'professional' | 'witty' | 'chill' | 'inspirational' | 'urgent' | null
          purpose: 'announcement' | 'engagement' | 'traffic' | 'education' | null
          template_text: string
          platforms: string[]
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          tone?: 'professional' | 'witty' | 'chill' | 'inspirational' | 'urgent' | null
          purpose?: 'announcement' | 'engagement' | 'traffic' | 'education' | null
          template_text: string
          platforms?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          tone?: 'professional' | 'witty' | 'chill' | 'inspirational' | 'urgent' | null
          purpose?: 'announcement' | 'engagement' | 'traffic' | 'education' | null
          template_text?: string
          platforms?: string[]
          created_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          event_date: string
          event_type: 'holiday' | 'product_launch' | 'industry_event' | 'custom'
          source: 'google_calendar' | 'manual' | 'system'
          external_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          event_date: string
          event_type: 'holiday' | 'product_launch' | 'industry_event' | 'custom'
          source?: 'google_calendar' | 'manual' | 'system'
          external_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          event_date?: string
          event_type?: 'holiday' | 'product_launch' | 'industry_event' | 'custom'
          source?: 'google_calendar' | 'manual' | 'system'
          external_id?: string | null
          created_at?: string
        }
      }
      analytics_snapshots: {
        Row: {
          id: string
          post_platform_id: string
          likes: number
          shares: number
          comments: number
          views: number
          engagement_rate: number
          profile_visits: number
          snapshot_at: string
          created_at: string
        }
        Insert: {
          id?: string
          post_platform_id: string
          likes?: number
          shares?: number
          comments?: number
          views?: number
          engagement_rate?: number
          profile_visits?: number
          snapshot_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          post_platform_id?: string
          likes?: number
          shares?: number
          comments?: number
          views?: number
          engagement_rate?: number
          profile_visits?: number
          snapshot_at?: string
          created_at?: string
        }
      }
      onboarding_progress: {
        Row: {
          id: string
          user_id: string
          step_name: string
          completed: boolean
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          step_name: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          step_name?: string
          completed?: boolean
          completed_at?: string | null
          created_at?: string
        }
      }
    }
  }
}
