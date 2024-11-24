// bot/energyUpdate.js
import cron from 'node-cron';
import supabase from './supabase.js';
import logger from './logger.js';

logger.info('Запуск скрипта восстановления энергии');

// Расписание: каждую минуту
cron.schedule('* * * * *', async () => {
  logger.info('Выполнение запланированной задачи восстановления энергии');
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, energy, max_energy, last_energy_update')
      .lt('energy', supabase.raw('max_energy')); // Выбираем только тех пользователей, у кого энергия меньше максимальной

    if (error) {
      logger.error(`Ошибка при получении пользователей: ${error.message}`);
      return;
    }

    const currentTime = new Date();

    const updatePromises = users.map(async (user) => {
      const lastUpdate = new Date(user.last_energy_update);
      const timeDiff = (currentTime - lastUpdate) / 1000; // разница в секундах
      const energyToAdd = Math.floor(timeDiff / 60); // 1 энергия каждые 60 секунд

      if (energyToAdd > 0) {
        const newEnergy = Math.min(user.energy + energyToAdd, user.max_energy);

        const { error: updateError } = await supabase
          .from('users')
          .update({
            energy: newEnergy,
            last_energy_update: currentTime.toISOString(),
          })
          .eq('id', user.id);

        if (updateError) {
          logger.error(`Ошибка при обновлении пользователя ID ${user.id}: ${updateError.message}`);
        } else {
          logger.info(`Энергия пользователя ID ${user.id} обновлена до ${newEnergy}`);
        }
      }
    });

    await Promise.all(updatePromises);
    logger.info('Обновление энергии завершено');
  } catch (err) {
    logger.error(`Ошибка в запланированной задаче: ${err.message}`);
  }
});
