// src/api/users.js

export async function registerRef(userName, refId, userId) {
  try {
    console.log(`Регистрация реферала: userName=${userName}, refId=${refId}, userId=${userId}`);
    
    // Получаем данные реферера
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('friends')
      .eq('telegram', refId)
      .single();

    if (referrerError) {
      console.error('Ошибка при получении данных реферера:', referrerError.message);
      throw referrerError;
    }

    console.log('Текущий список друзей реферера:', referrerData.friends);

    // Обновляем список друзей реферера
    const updatedFriends = { ...referrerData.friends };
    updatedFriends[userId] = userName;

    console.log('Обновленный список друзей:', updatedFriends);

    const { error: updateError } = await supabase
      .from('users')
      .update({ friends: updatedFriends })
      .eq('telegram', refId);

    if (updateError) {
      console.error('Ошибка при обновлении списка друзей:', updateError.message);
      throw updateError;
    }

    console.log('Реферал успешно зарегистрирован!');
  } catch (error) {
    console.error('Ошибка при регистрации реферала:', error.message);
  }
}
