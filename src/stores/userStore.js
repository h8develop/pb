import { defineStore } from 'pinia';
import supabase from '../services/supabase';
import { useTelegram } from '../services/telegram';

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
      this.dailyMissionDate = data.daily_mission_date;
    },

    async updateDailyMission(newLevel) {
      if (!this.userId) {
        console.error('userId не определен');
        return;
      }

      const today = new Date().toISOString().split('T')[0]; // Формат YYYY-MM-DD

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
        this.dailyMissionDate = today;
      }
    },
  },
});
