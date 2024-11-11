import { defineStore } from 'pinia';
import debounce from 'lodash.debounce';
import { updateIncomeWithReferral } from '@/api/app';
import { updateScore } from '@/api/app';


const debouncedUpdateScore = debounce(updateIncomeWithReferral, 500);

export const useScoreStore = defineStore('score', {
  state: () => ({
    score: parseInt(localStorage.getItem('score')) || 0, // Счёт
    energy: parseInt(localStorage.getItem('energy')) || 1000, // Энергия
    maxEnergy: 1000, // Максимальная энергия
    taps: parseInt(localStorage.getItem('taps')) || 0, // Количество тапов
    maxTaps: 1000, // Максимальное количество тапов
    tapEarnings: 1, // Очки за один тап
    lastEnergyUpdate: parseInt(localStorage.getItem('lastEnergyUpdate')) || Date.now(), // Время последнего восстановления энергии
  }),
  getters: {
    currentScore: (state) => state.score, // Возвращаем текущий счёт
  },
  actions: {
    // Добавляем очки при клике, если есть энергия
// Добавляем очки при клике, если есть энергия
async add(score = 1) {
  if (this.energy > 0) {
    this.score += this.tapEarnings;
    this.energy -= 1;
    this.taps += 1;
    this.saveState();
    await updateScore(this.score); // Синхронизируем с базой данных
  } else {
    alert("У вас закончилась энергия!");
  }
},

// Устанавливаем новый счёт
async setScore(score) {
  this.score = score;
  this.saveState();
  await updateScore(this.score); // Синхронизируем с базой данных
},


    // Восстанавливаем всю энергию
    restoreEnergy() {
      this.energy = this.maxEnergy;
      this.saveState();
    },

    // Восстанавливаем энергию с течением времени
    restoreEnergyOverTime() {
      const currentTime = Date.now();
      const timeDiff = currentTime - this.lastEnergyUpdate;
      const energyToRestore = Math.floor(timeDiff / (1000 * 60)); // Восстановление 1 единицы энергии каждую минуту

      if (energyToRestore > 0) {
        this.energy = Math.min(this.energy + energyToRestore, this.maxEnergy);
        this.lastEnergyUpdate = currentTime;
        this.saveState();
      }
    },

    // Сохраняем состояние в localStorage
    saveState() {
      localStorage.setItem('score', this.score);
      localStorage.setItem('energy', this.energy);
      localStorage.setItem('taps', this.taps);
      localStorage.setItem('lastEnergyUpdate', this.lastEnergyUpdate);
    },

    // Загружаем состояние из localStorage и восстанавливаем энергию
    loadState() {
      this.score = parseInt(localStorage.getItem('score')) || 0;
      this.energy = parseInt(localStorage.getItem('energy')) || this.maxEnergy;
      this.taps = parseInt(localStorage.getItem('taps')) || 0;
      this.lastEnergyUpdate = parseInt(localStorage.getItem('lastEnergyUpdate')) || Date.now();
      this.restoreEnergyOverTime();
    },
  },
});