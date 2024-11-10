
import supabase from '@/services/supabase';

// Функция для привязки реферала к пользователю
export async function registerReferral(referrerId, newUserId) {
  try {
    // Получаем данные реферала
    const { data: referrerData, error: referrerError } = await supabase
      .from('users')
      .select('friends')
      .eq('telegram', referrerId)
      .single();

    if (referrerError) throw referrerError;

    // Обновляем список друзей реферала
    const updatedFriends = { ...referrerData.friends, [newUserId]: true };

    const { error: updateError } = await supabase
      .from('users')
      .update({ friends: updatedFriends })
      .eq('telegram', referrerId);

    if (updateError) throw updateError;

    console.log('Referral registered successfully!');
  } catch (error) {
    console.error('Error registering referral:', error.message);
  }
}
// src/api/users.js
export async function updateIncomeWithReferral(userId, income) {
    try {
      // Получаем данные пользователя и его реферала
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('score, friends')
        .eq('telegram', userId)
        .single();
  
      if (userError) throw userError;
  
      // Обновляем доход пользователя
      const newScore = userData.score + income;
      const { error: scoreUpdateError } = await supabase
        .from('users')
        .update({ score: newScore })
        .eq('telegram', userId);
  
      if (scoreUpdateError) throw scoreUpdateError;
  
      // Начисляем 20% дохода всем друзьям (рефералам)
      for (const referrerId in userData.friends) {
        const bonusIncome = income * 0.2;
        const { data: referrer, error: referrerError } = await supabase
          .from('users')
          .select('score')
          .eq('telegram', referrerId)
          .single();
  
        if (referrerError) {
          console.error(`Error fetching referrer data for ${referrerId}:`, referrerError.message);
          continue;
        }
  
        // Обновляем доход реферала
        const updatedScore = referrer.score + bonusIncome;
        const { error: bonusUpdateError } = await supabase
          .from('users')
          .update({ score: updatedScore })
          .eq('telegram', referrerId);
  
        if (bonusUpdateError) {
          console.error(`Error updating score for referrer ${referrerId}:`, bonusUpdateError.message);
        } else {
          console.log(`Bonus income of ${bonusIncome} added to referrer ${referrerId}`);
        }
      }
    } catch (error) {
      console.error('Error updating income with referral bonus:', error.message);
    }
  }
  