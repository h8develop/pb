// src/stores/app.js
import { defineStore } from 'pinia';
import { useScoreStore } from './score';
import { useTelegram } from '@/services/telegram';
import { registerRef } from '@/api/users';
import {
  getOrCreateUser,
  fetchTasks,
  completeTask,
} from '@/api/app';

export const useAppStore = defineStore('app', {
  state: () => ({
    user: {},
    tasks: [],
  }),
  actions: {
    async init(ref) {
      const { user: telegramUser } = useTelegram();
    
      this.user = await getOrCreateUser();
    
      const scoreStore = useScoreStore();
    
      if (typeof scoreStore.setScore === 'function') {
        scoreStore.setScore(this.user.score);
        scoreStore.setUserId(this.user.id);
      } else {
        console.error('Ошибка: метод setScore не найден в scoreStore');
      }
    
      // Если есть реферальный код и он не принадлежит самому пользователю
      if (ref && +ref !== + this.user.telegram) {
        await registerRef(telegramUser.first_name, ref, this.user.id);
      }
    },

    async completeTask(task) {
      await completeTask(this.user, task);
      // Обновляем данные пользователя после выполнения задачи
      this.user = await getOrCreateUser();
    },

    async fetchTasks() {
      this.tasks = await fetchTasks();
    },
  },
});
