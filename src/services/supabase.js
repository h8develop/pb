import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://irymwiidzovsezjnbiux.supabase.co'
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeW13aWlkem92c2V6am5iaXV4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzExNTg5MzAsImV4cCI6MjA0NjczNDkzMH0.xbnP-Dp5AeBSAa_hiPWpk3Lv1Dftc1J57kEtv2i9odc'

if (!SUPABASE_URL || !SUPABASE_API_KEY) {
  throw new Error('SUPABASE_URL и SUPABASE_API_KEY обязательны.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_API_KEY);
export default supabase;
