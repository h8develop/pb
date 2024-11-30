import { defineStore } from 'pinia';
import supabase from '@/services/supabase';
import { useTelegram } from '@/services/telegram';
import { differenceInCalendarDays } from 'date-fns';

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    dailyMissionLevel: 1,
    dailyMissionDate: null,
  }),

  actions: {
    async loadUserData() {
      const { user } = useTelegram();
      if (!user || !user.id) {
        console.error('Пользователь не авторизован');
        return;
      }

      const telegramId = Number(user.id);

      const { data, error } = await supabase
        .from('users')
        .select('id, daily_mission_level, daily_mission_date')
        .eq('telegram', telegramId)
        .single();

      if (error) {
        console.error('Ошибка загрузки данных пользователя:', error);
        return;
      }

      this.userId = data.id;
      this.dailyMissionLevel = data.daily_mission_level || 1;
      this.dailyMissionDate = data.daily_mission_date; // Загружаем дату из базы данных

      // Проверяем, прошел ли день с последнего сбора награды
      const today = new Date();
      const lastCollectedDate = this.dailyMissionDate ? new Date(this.dailyMissionDate) : null;

      let shouldReset = false;

      if (lastCollectedDate) {
        const difference = differenceInCalendarDays(today, lastCollectedDate);
        shouldReset = difference > 1; // Если прошло больше 1 календарного дня
      }

      if (shouldReset) {
        await this.resetDailyMission();
      }
    },

    async resetDailyMission() {
      if (!this.userId) {
        console.error('userId не определен');
        return;
      }

      try {
        const { error } = await supabase
          .from('users')
          .update({
            daily_mission_level: 1,
            daily_mission_date: null,
          })
          .eq('id', this.userId);

        if (error) {
          console.error('Ошибка сброса ежедневной миссии:', error);
        } else {
          this.dailyMissionLevel = 1;
          this.dailyMissionDate = null;
          console.log('Ежедневная миссия успешно сброшена.'); 
        }
      } catch (err) {
        console.error('Ошибка сброса ежедневной миссии:', err);
      }
    },

    async updateDailyMission(newLevel) {
      if (!this.userId) {
        console.error('userId не определен');
        return;
      }

      const today = new Date().toISOString(); // Полный формат даты с временем

      const { error } = await supabase
        .from('users')
        .update({
          daily_mission_level: newLevel,
          daily_mission_date: today,
        })
        .eq('id', this.userId);

      if (error) {
        console.error('Ошибка обновления ежедневной миссии:', error);
      } else {
        this.dailyMissionLevel = newLevel;
        this.dailyMissionDate = today; // Обновляем локально
      }
    },
  },
});
