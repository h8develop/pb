// bot/supabase.js
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Загрузка переменных окружения из .env файла
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL и SUPABASE_SERVICE_ROLE_KEY обязательны.');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
export default supabase;
