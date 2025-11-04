import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dvzjzewgxyustvyrjdli.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR2emp6ZXdneHl1c3R2eXJqZGxpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjQzNzQsImV4cCI6MjA3Nzg0MDM3NH0.15G_3w_9_viIvuVACTwinacxaUQgrmwWEhrjtBj3gb4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
