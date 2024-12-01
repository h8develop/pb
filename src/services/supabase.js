// src/services/supabase.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("SUPABASE_URL и SUPABASE_ANON_KEY обязательны.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default supabase;
