// src/stores/score.js
import { defineStore } from 'pinia';
import debounce from 'lodash.debounce';
import supabase from '@/services/supabase';
import { useTelegram } from '@/services/telegram';

const debouncedUpdateScore = debounce(async (score, energy, userId) => {
  try {
    const { error } = await supabase
      .from('users')
      .update({ score, energy })
      .eq('id', userId);

    if (error) {
      console.error('Ошибка при обновлении счёта в Supabase:', error);
    }
  } catch (err) {
    console.error('Ошибка при обновлении счёта в Supabase:', err);
  }
}, 500);

export const useScoreStore = defineStore('score', {
  state: () => ({
    userId: null,
    score: 0,
    energy: 1000,
    maxEnergy: 1000,
    multitapLevel: 0, // Начальный уровень мультитапа - 0
    hasGoldenTrinket: false, // Новое свойство для золотого брелока
  }),

  actions: {
    setUserId(id) {
      this.userId = id;
    },

    setScore(newScore) {
      this.score = newScore;
    },

    async loadUserData() {
      const { user } = useTelegram();
      if (!user || !user.id) {
        console.error('Ошибка: объект user или его id не определены');
        return;
      }

      const telegramId = Number(user.id);
      try {
        const { data, error } = await supabase
          .from('users')
          .select(
            'id, score, energy, max_energy, multitap_level, has_golden_trinket'
          )
          .eq('telegram', telegramId)
          .single();

        if (error) {
          console.error('Ошибка при загрузке данных пользователя из Supabase:', error);
        } else {
          this.userId = data.id;
          this.score = data.score ?? 0;
          this.energy = data.energy ?? 0;
          this.maxEnergy = data.max_energy ?? 1000;
          this.multitapLevel = data.multitap_level ?? 0;
          this.hasGoldenTrinket = data.has_golden_trinket ?? false;

          // Запускаем пассивный заработок, если брелок приобретён
          if (this.hasGoldenTrinket) {
            this.startPassiveEarnings();
          }
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
      }
    },

    async add(taps = 1) {
      const coinsPerTap = this.multitapLevel > 0 ? this.multitapLevel + 1 : 1;

      if (this.energy >= taps) {
        this.score += taps * coinsPerTap;
        this.energy -= taps;

        debouncedUpdateScore(this.score, this.energy, this.userId);
      } else {
        alert('У вас недостаточно энергии!');
      }
    },

    async updateScoreInSupabase() {
      if (!this.userId) return;
      try {
        const { error } = await supabase
          .from('users')
          .update({
            score: this.score,
            max_energy: this.maxEnergy,
            energy: this.energy,
            multitap_level: this.multitapLevel,
            has_golden_trinket: this.hasGoldenTrinket, // Обновляем поле золотого брелока
          })
          .eq('id', this.userId);

        if (error) {
          console.error('Ошибка при обновлении счёта в Supabase:', error);
        }
      } catch (err) {
        console.error('Ошибка при обновлении счёта в Supabase:', err);
      }
    },

    // Метод для пассивного заработка
    startPassiveEarnings() {
      setInterval(() => {
        this.score += 100;
        this.updateScoreInSupabase();
      }, 3600000); // 1 час = 3600000 миллисекунд
    },
  },
});
