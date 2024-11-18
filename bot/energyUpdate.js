import cron from 'node-cron';
import supabase from './supabase.js';

console.log(`[${new Date().toISOString()}] Запуск скрипта восстановления энергии`);

cron.schedule('* * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Выполнение запланированной задачи`);
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, energy, max_energy');

    if (error) {
      console.error('Ошибка при получении пользователей:', error);
      return;
    }

    const updatePromises = users.map(user => {
      const newEnergy = Math.min(user.energy + 1, user.max_energy);

      console.log(`Пользователь ID ${user.id}: энергия была ${user.energy}, стала ${newEnergy}`);

      return supabase
        .from('users')
        .update({
          energy: newEnergy,
          last_energy_update: new Date().toISOString(),
        })
        .eq('id', user.id);
    });

    await Promise.all(updatePromises);

    console.log('Энергия пользователей успешно обновлена');
  } catch (err) {
    console.error('Ошибка в запланированной задаче:', err);
  }
});
