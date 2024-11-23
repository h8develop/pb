// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL= "https://irymwiidzovsezjnbiux.supabase.co"
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlyeW13aWlkem92c2V6am5iaXV4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTE1ODkzMCwiZXhwIjoyMDQ2NzM0OTMwfQ.ZbWuQrnVvrhpXCqKt-kYYrpsNiDGkDEn1WSiXaQ8Dpg"

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error('VITE_SUPABASE_URL и VITE_SUPABASE_ANON_KEY обязательны.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
export default supabase;
