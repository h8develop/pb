import express from 'express';
import supabase from '../services/supabase.js'; // Добавьте расширение .js
import cron from 'node-cron'; // Импортируем node-cron как ES-модуль
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Endpoint для обновления энергии
app.post('/update-energy', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ energy: 1 }) // Пример обновления
      .eq('id', req.body.userId);

    if (error) {
      return res.status(400).json({ message: 'Ошибка при обновлении энергии', error });
    }

    res.status(200).json({ message: 'Энергия обновлена', data });
  } catch (err) {
    res.status(500).json({ message: 'Внутренняя ошибка сервера', error: err });
  }
});

// Планировщик задачи: обновление энергии каждую минуту
cron.schedule('* * * * *', async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, energy');

    if (error) {
      console.error('Ошибка при получении пользователей:', error);
      return;
    }

    const updatePromises = data.map(user => {
      const newEnergy = Math.min(user.energy + 10, 100); // Предполагаем максимум 100
      return supabase
        .from('users')
        .update({ energy: newEnergy })
        .eq('id', user.id);
    });

    const results = await Promise.all(updatePromises);

    results.forEach(result => {
      if (result.error) {
        console.error(`Ошибка при обновлении энергии пользователя: ${result.error}`);
      }
    });

    console.log('Энергия пользователей успешно обновлена');
  } catch (err) {
    console.error('Ошибка в запланированной задаче:', err);
  }
}, {
  timezone: "Europe/Moscow" // Укажите ваш часовой пояс
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
