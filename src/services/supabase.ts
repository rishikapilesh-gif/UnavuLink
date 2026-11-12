import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!isSupabaseConfigured) {
  console.info(
    '%c[UnavuLink]%c Running in autonomous Demo Store mode with Tamil Nadu seed data. Connect VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY in .env for live Supabase sync.',
    'color: #2E6B3F; font-weight: bold;',
    'color: #68736C;'
  );
}
