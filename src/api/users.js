// src/api/users.js
import supabase from '../services/supabase';

export async function registerRef(userName, refId) {
  try {
    // Получаем данные реферера
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('friends')
      .eq('telegram', refId)
      .single();

    if (referrerError) throw referrerError;

    // Обновляем список друзей реферера
    const updatedFriends = { ...referrerData.friends };
    updatedFriends[userName] = true;

    const { error: updateError } = await supabase
      .from('users')
      .update({ friends: updatedFriends })
      .eq('telegram', refId);

    if (updateError) throw updateError;

    console.log('Реферал успешно зарегистрирован!');
  } catch (error) {
    console.error('Ошибка при регистрации реферала:', error.message);
  }
}
