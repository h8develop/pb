import supabase from '@/services/supabase';
import { useTelegram } from '@/services/telegram';
import { useScoreStore } from '@/stores/score';

const { user } = useTelegram();
const MY_ID = user?.id ?? 4252;

// Переносим вызов `useScoreStore` внутрь функций, чтобы Pinia была активной
export async function fetchTasks() {
  const { data } = await supabase.from('tasks').select('*');
  return data;
}

export async function getOrCreateUser() {
  const pontentialUser = await supabase
    .from('users')
    .select()
    .eq('telegram', MY_ID);

  if (pontentialUser.data.length !== 0) {
    return pontentialUser.data[0];
  }

  const newUser = {
    telegram: MY_ID,
    friends: {},
    tasks: {},
    score: 0,
  };

  await supabase.from('users').insert(newUser);
  return newUser;
}

export async function updateScore(newScore) {
  await supabase.from('users').update({ score: newScore }).eq('telegram', MY_ID);
}

export async function registerRef(userName, refId) {
  const { data } = await supabase.from('users').select().eq('telegram', +refId);
  const refUser = data[0];

  await supabase
    .from('users')
    .update({
      friends: { ...refUser.friends, [MY_ID]: userName },
      score: refUser.score + 50,
    })
    .eq('telegram', +refId);
}

export async function completeTask(user, task) {
  // Переносим вызов `useScoreStore` внутрь функции
  const scoreStore = useScoreStore();
  const newScore = scoreStore.score + task.amount;

  // Убедитесь, что `setScore` вызывается корректно
  if (typeof scoreStore.setScore === 'function') {
    scoreStore.setScore(newScore);
  } else {
    console.error("Ошибка: `setScore` не является функцией");
  }

  await supabase
    .from('users')
    .update({
      tasks: { ...user.tasks, [task.id]: true },
      score: newScore,
    })
    .eq('telegram', MY_ID);
}

export async function updateIncomeWithReferral(userId, income) {
  try {
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('friends')
      .eq('telegram', userId)
      .single();

    if (userError) throw userError;

    const { error: incomeUpdateError } = await supabase
      .from('users')
      .update({ score: supabase.raw(`score + ${income}`) })
      .eq('telegram', userId);

    if (incomeUpdateError) throw incomeUpdateError;

    for (const friendId in user.friends) {
      const bonusIncome = income * 0.2;
      const { data: referrer, error: referrerError } = await supabase
        .from('users')
        .select('score')
        .eq('telegram', friendId)
        .single();

      if (referrerError) {
        console.error(`Error fetching referrer data for ${friendId}:`, referrerError.message);
        continue;
      }

      const { error: referrerIncomeUpdateError } = await supabase
        .from('users')
        .update({ score: supabase.raw(`score + ${bonusIncome}`) })
        .eq('telegram', friendId);

      if (referrerIncomeUpdateError) {
        console.error(`Error updating score for referrer ${friendId}:`, referrerIncomeUpdateError.message);
        continue;
      }

      const { error: referralIncomeInsertError } = await supabase
        .from('referral_income')
        .insert({
          user_id: userId,
          referrer_id: friendId,
          amount: bonusIncome,
          timestamp: new Date().toISOString()
        });

      if (referralIncomeInsertError) {
        console.error(`Error inserting referral income for ${friendId}:`, referralIncomeInsertError.message);
      } else {
        console.log(`Bonus income of ${bonusIncome} recorded for referrer ${friendId}`);
      }
    }
  } catch (error) {
    console.error('Error updating income with referral bonus:', error.message);
  }
}
