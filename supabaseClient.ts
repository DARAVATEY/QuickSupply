
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rkhyswsbmaqoweedwiwr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJraHlzd3NibWFxb3dlZWR3aXdyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYxNjM5MDIsImV4cCI6MjA4MTczOTkwMn0.kec3KhkkHYPABQt_omlNKspuvZsnSlQOwuytMBXmTW0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
