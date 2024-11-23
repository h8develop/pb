// bot/energyUpdate.js
import cron from 'node-cron';
import supabase from './supabase.js';

// Логирование при запуске скрипта
console.log(`[${new Date().toISOString()}] Запуск скрипта восстановления энергии`);

// Расписание: каждую минуту
cron.schedule('* * * * *', async () => {
  console.log(`[${new Date().toISOString()}] Выполнение запланированной задачи восстановления энергии`);
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, energy, max_energy, last_energy_update');

    if (error) {
      console.error('Ошибка при получении пользователей:', error);
      return;
    }

    const currentTime = new Date();
    const updatePromises = users.map(user => {
      const lastUpdate = new Date(user.last_energy_update);
      const timeDiff = (currentTime - lastUpdate) / 1000; // разница в секундах
      const energyToAdd = Math.floor(timeDiff / 60); // 1 энергия каждые 60 секунд
      if (energyToAdd > 0) {
        const newEnergy = Math.min(user.energy + energyToAdd, user.max_energy);
        return supabase
          .from('users')
          .update({
            energy: newEnergy,
            last_energy_update: currentTime.toISOString(),
          })
          .eq('id', user.id);
      }
      return Promise.resolve();
    });

    await Promise.all(updatePromises);
    console.log('Энергия пользователей успешно обновлена');
  } catch (err) {
    console.error('Ошибка в запланированной задаче:', err);
  }
});
