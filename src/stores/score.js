// src/stores/score.js
import { defineStore } from 'pinia';
import supabase from '@/services/supabase';
import { useTelegram } from '@/services/telegram';

export const useScoreStore = defineStore('score', {
  state: () => ({
    userId: null,
    score: 0,
    energy: 1000,
    maxEnergy: 1000,
    multitapLevel: 0,
    hasGoldenTrinket: false,
    lastEnergyUpdate: null,
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
            'id, score, energy, max_energy, multitap_level, has_golden_trinket, last_energy_update'
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
          this.lastEnergyUpdate = data.last_energy_update ? new Date(data.last_energy_update) : new Date();

          // Восстановление энергии
          await this.restoreEnergy();
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
      }
    },

    async restoreEnergy() {
      const currentTime = new Date();
      const lastUpdate = this.lastEnergyUpdate || currentTime;
  
      const elapsedMinutes = Math.floor((currentTime - lastUpdate) / (1000 * 60));
      const energyToAdd = elapsedMinutes; // 1 энергия за минуту
  
      if (energyToAdd <= 0) return;
  
      const newEnergy = Math.min(this.energy + energyToAdd, this.maxEnergy);
      const actualEnergyAdded = newEnergy - this.energy;
  
      if (actualEnergyAdded > 0) {
        this.energy = newEnergy;
        this.lastEnergyUpdate = currentTime;
  
        await supabase
          .from('users')
          .update({
            energy: this.energy,
            last_energy_update: this.lastEnergyUpdate.toISOString(),
          })
          .eq('id', this.userId);
      }
    },

    async add(taps = 1) {
      // Восстанавливаем энергию перед действием
      await this.restoreEnergy();

      const coinsPerTap = this.multitapLevel > 0 ? this.multitapLevel + 1 : 1;

      if (this.energy >= taps) {
        this.score += taps * coinsPerTap;
        this.energy -= taps;

        await supabase
          .from('users')
          .update({
            score: this.score,
            energy: this.energy,
            last_energy_update: this.lastEnergyUpdate.toISOString(),
          })
          .eq('id', this.userId);
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
            has_golden_trinket: this.hasGoldenTrinket,
            last_energy_update: this.lastEnergyUpdate.toISOString(),
          })
          .eq('id', this.userId);

        if (error) {
          console.error('Ошибка при обновлении счёта в Supabase:', error);
        }
      } catch (err) {
        console.error('Ошибка при обновлении счёта в Supabase:', err);
      }
    },

    // Метод для пассивного заработка (может быть реализован по аналогии)
    startPassiveEarnings() {
      // Реализуйте пассивный доход при каждом взаимодействии пользователя
    },
  },
});
