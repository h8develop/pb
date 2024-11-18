// bot/passiveIncomeUpdate.js
import cron from 'node-cron';
import supabase from './supabase.js';

console.log(`[${new Date().toISOString()}] Запуск скрипта пассивного дохода`);

cron.schedule('0 * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Начисление пассивного дохода`);
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, score')
      .eq('has_golden_trinket', true);

    if (error) {
      console.error('Ошибка при получении пользователей:', error);
      return;
    }

    const updatePromises = users.map(user => {
      const newScore = user.score + 100;

      console.log(`Пользователь ID ${user.id}: начислено 100 монет`);

      return supabase
        .from('users')
        .update({
          score: newScore,
        })
        .eq('id', user.id);
    });

    await Promise.all(updatePromises);

    console.log('Пассивный доход успешно начислен');
  } catch (err) {
    console.error('Ошибка в запланированной задаче:', err);
  }
});
