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
    hasCustomButton: false, // Новое свойство
    lastEnergyUpdate: null,
    purchasedItems: {},
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
        console.error("Ошибка: объект user или его id не определены");
        return;
      }

      const telegramId = Number(user.id);
      try {
        const { data, error } = await supabase
        .from('users')
        .select(
          'id, score, energy, max_energy, multitap_level, has_golden_trinket, has_custom_button, last_energy_update, purchased_items'
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
          this.hasCustomButton = data.has_custom_button ?? false;
          this.hasGoldenTrinket = data.has_golden_trinket ?? false;
          this.lastEnergyUpdate = data.last_energy_update
          
            ? new Date(data.last_energy_update)
            : new Date();
          this.purchasedItems = data.purchased_items || {}; // Загружаем купленные предметы
        }
      } catch (err) {
        console.error('Ошибка при загрузке данных пользователя:', err);
      }
    },

    async restoreEnergy() {
      const currentTime = new Date();
      const elapsedMinutes = Math.floor((currentTime - new Date(this.lastEnergyUpdate)) / (1000 * 60));

      if (elapsedMinutes > 0) {
        const energyToAdd = Math.min(elapsedMinutes, this.maxEnergy - this.energy);
        this.energy = Math.min(this.energy + energyToAdd, this.maxEnergy);
        this.lastEnergyUpdate = currentTime.toISOString();

        await supabase
          .from('users')
          .update({
            energy: this.energy,
            last_energy_update: this.lastEnergyUpdate,
          })
          .eq('id', this.userId);
      }
    },

    async add(taps = 1) {
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
            last_energy_update: this.lastEnergyUpdate,
          })
          .eq('id', this.userId);
      } else {
        alert('У вас недостаточно энергии!');
      }
    },

    // Новый метод для добавления очков без уменьшения энергии
    async addScore(amount) {
      this.score += amount;

      // Обновляем данные в Supabase
      await supabase
        .from('users')
        .update({
          score: this.score,
        })
        .eq('id', this.userId);
    },

    async updatePurchasedItems(newItemId) {
      if (!this.userId) return;

      try {
        const { data, error } = await supabase
          .from('users')
          .select('purchased_items')
          .eq('id', this.userId)
          .single();

        if (error) {
          console.error('Ошибка при получении purchased_items:', error);
          return;
        }

        const currentPurchasedItems = data.purchased_items || {};
        const updatedPurchasedItems = { ...currentPurchasedItems, [newItemId]: true };

        const { updateError } = await supabase
          .from('users')
          .update({ purchased_items: updatedPurchasedItems })
          .eq('id', this.userId);

        if (updateError) {
          console.error('Ошибка при обновлении purchased_items:', updateError);
        } else {
          console.log('purchased_items успешно обновлено:', updatedPurchasedItems);
        }
      } catch (err) {
        console.error('Ошибка при обновлении purchased_items:', err);
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
            has_custom_button: this.hasCustomButton, // Добавлено
            last_energy_update: this.lastEnergyUpdate
              ? this.lastEnergyUpdate.toISOString()
              : null,
          })
          .eq('id', this.userId);
    
        if (error) {
          console.error('Ошибка при обновлении счёта в Supabase:', error);
        }
      } catch (err) {
        console.error('Ошибка при обновлении счёта в Supabase:', err);
      }
    },
  },
});
