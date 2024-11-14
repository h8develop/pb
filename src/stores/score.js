// score.js
import { defineStore } from 'pinia';
import debounce from 'lodash.debounce';
import supabase from '@/services/supabase';
import { updateScore } from '@/api/app'; // Импортируем функцию updateScore
import { useTelegram } from '@/services/telegram';

const { user } = useTelegram();
const debouncedUpdateScore = debounce(updateScore, 500);

export const useScoreStore = defineStore('score', {
  state: () => ({
    score: 0,
    energy: 1000, // Начальное значение
    maxEnergy: 1000,
    lastEnergyUpdate: Date.now(),
  }),

  actions: {
    setScore(newScore) {
      this.score = newScore;
    },

    // Метод для загрузки данных пользователя из базы данных Supabase
    async loadUserData() {
      if (!user || !user.id) {
        console.error('Ошибка: объект user или его id не определены');
        return;
      }

      try {
        // Выполняем запрос к базе данных
        const { data, error } = await supabase
          .from('users')
          .select('score, energy, max_energy') // Обратите внимание: правильное имя поля max_energy
          .eq('telegram', user.id)
          .single();

        if (error) {
          console.error('Ошибка при загрузке данных пользователя из Supabase:', error);
        } else {
          // Устанавливаем загруженные данные в состояние
          this.score = data.score ?? 0; // Используем оператор ?? для подстраховки
          this.energy = data.energy ?? 0;
          this.maxEnergy = data.max_energy ?? 1000; // Обратите внимание: правильное имя поля
          this.lastEnergyUpdate = Date.now();
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
      }
    },

    // Метод для обновления энергии пользователя в базе данных
    async updateEnergyInSupabase() {
      if (!user || !user.id) {
        console.error('Ошибка: объект user или его id не определены');
        return;
      }

      try {
        const { error } = await supabase
          .from('users')
          .update({ energy: this.energy })
          .eq('telegram', user.id);

        if (error) {
          console.error('Ошибка при обновлении энергии в Supabase:', error);
        }
      } catch (err) {
        console.error('Ошибка при обновлении энергии в Supabase:', err);
      }
    },

    // Метод для добавления очков и уменьшения энергии
    async add() {
      if (this.energy > 0) {
        this.score += 1;
        this.energy -= 1;
        debouncedUpdateScore(this.score); // Используем debouncedUpdateScore для обновления счета
        await this.updateEnergyInSupabase();
      } else {
        alert("У вас закончилась энергия!");
      }
    },
  },
});
