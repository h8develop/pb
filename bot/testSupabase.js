// bot/testSupabase.js
import supabase from './supabase.js';

(async () => {
  try {
    const { data, error } = await supabase.from('users').select('*').limit(1);
    if (error) {
      console.error('Ошибка:', error);
    } else {
      console.log('Данные:', data);
    }
  } catch (err) {
    console.error('Ошибка выполнения запроса:', err);
  }
})();
