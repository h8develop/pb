<template>
    <div class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <h2>Заходи каждый день и забирай бонус!</h2>
        <div class="missions-grid">
          <button
            v-for="day in 12"
            :key="day"
            :class="['mission-button', { completed: day < currentLevel, active: day === currentLevel }]"
            @click="collectReward(day)"
            :disabled="!canCollect(day)"
          >
            {{ getButtonText(day) }}
          </button>
        </div>
        <button class="close-button" @click="close">Закрыть</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import { useUserStore } from '@/stores/userStore'; // Создадим новый стор для пользователя
  import { useScoreStore } from '@/stores/score';
  
  const userStore = useUserStore();
  const scoreStore = useScoreStore();
  
  const currentLevel = ref(1);
  
  onMounted(async () => {
    await userStore.loadUserData();
    currentLevel.value = userStore.dailyMissionLevel;
  });
  
  function close() {
    // Закрыть модальное окно (реализуется в родительском компоненте)
    emit('close');
  }
  
  function getButtonText(day) {
    if (day < currentLevel.value) {
      return 'Выполнено';
    } else if (day === currentLevel.value) {
      return `День ${day}: ${getReward(day)} коинов`;
    } else {
      return `День ${day}`;
    }
  }
  
  function getReward(day) {
    // Логика увеличения награды каждый день
    return day * 10; // Например, каждый день награда увеличивается на 10
  }
  
  function canCollect(day) {
    return day === currentLevel.value;
  }
  
  async function collectReward(day) {
    if (!canCollect(day)) return;
  
    const reward = getReward(day);
    await scoreStore.addScore(reward);
  
    // Обновляем уровень миссии и дату
    await userStore.updateDailyMission(day + 1);
  
    currentLevel.value = day + 1;
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    /* Стили для затемнения фона */
  }
  
  .modal-content {
    /* Стили для модального окна */
  }
  
  .missions-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .mission-button {
    flex: 1 0 30%;
    padding: 10px;
    border: none;
    border-radius: 5px;
  }
  
  .mission-button.completed {
    background-color: gray;
    color: white;
  }
  
  .mission-button.active {
    background-color: gold;
  }
  
  .close-button {
    margin-top: 20px;
  }
  </style>
  