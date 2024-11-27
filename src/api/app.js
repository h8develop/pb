// src/api/app.js
import supabase from '../services/supabase';
import { useTelegram } from '../services/telegram';

export async function getOrCreateUser() {
  const { user } = useTelegram();
  const telegramId = Number(user.id);

  const { data: existingUser, error } = await supabase
    .from('users')
    .select()
    .eq('telegram', telegramId)
    .single();

  if (existingUser) {
    return existingUser;
  }

  const newUser = {
    telegram: telegramId,
    friends: [],
    tasks: {},
    score: 0,
    energy: 1000,
    max_energy: 1000,
    multitap_level: 0, // Убедитесь, что уровень мультитапа установлен в 0
    last_energy_update: new Date().toISOString(), // Добавьте поле для отслеживания времени обновления энергии
  };
  

  const { data: insertedUser, error: insertError } = await supabase
    .from('users')
    .insert(newUser)
    .select()
    .single();

  if (insertError) {
    console.error('Ошибка при создании нового пользователя:', insertError);
    return null;
  }

  return insertedUser;
}

export async function fetchTasks() {
  try {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
      console.error('Ошибка при получении задач:', error);
      return [];
    }
    return data;
  } catch (err) {
    console.error('Ошибка при получении задач:', err);
    return [];
  }
}

export async function completeTask(user, task) {
  try {
    // Проверяем, выполнена ли задача ранее
    if (user.tasks && user.tasks[task.id]) {
      console.log('Задача уже выполнена');
      return;
    }

    // Обновляем список выполненных задач пользователя
    const updatedTasks = { ...user.tasks, [task.id]: true };

    // Начисляем вознаграждение пользователю
    const newScore = user.score + task.amount;

    // Обновляем данные пользователя в базе данных
    const { error } = await supabase
      .from('users')
      .update({ tasks: updatedTasks, score: newScore })
      .eq('id', user.id);

    if (error) {
      console.error('Ошибка при обновлении данных пользователя:', error);
    } else {
      console.log('Задача успешно выполнена и награда начислена');
    }
  } catch (err) {
    console.error('Ошибка при выполнении задачи:', err);
  }
}
