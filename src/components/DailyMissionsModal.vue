<template>
  <div class="modal-overlay" @click="close">
    <div
      class="modal-content daily-modal-content relative flex flex-col items-center overflow-hidden"
      @click.stop
    >
      <button class="absolute top-1 right-2 text-2xl" @click="close">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1em"
          height="1em"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-miterlimit="10"
            stroke-width="1.5"
            d="m7.757 16.243l8.486-8.486m0 8.486L7.757 7.757"
          />
        </svg>
      </button>
      <h2>Заходи каждый день и забирай бонус!</h2>
      <div class="missions-grid grid grid-cols-2 mt-2 gap-2">
        <button
          v-for="day in 9"
          :key="day"
          :class="[
            'mission-button',
            'menu-button inline-flex flex-col items-center',
            { completed: day < currentLevel, active: day === currentLevel },
          ]"
          @click="collectReward(day)"
          :disabled="!canCollect(day)"
        >
          <span class="font-bold">
            {{ loadingDay === day ? "Получение..." : getButtonText(day) }}
          </span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5525/5525147.png"
            alt=""
            class="h-10 w-10"
          />
          <span
  class="text-sm font-normal mt-1 py-0.5 px-4 bg-yellow-500 rounded-full"
>
  {{ calculateReward(day) }}
</span>

        </button>
      </div>

      <!-- Временная кнопка сброса миссий (только для разработки) -->
      <button
        v-if="isDev"
        @click="resetMission"
        class="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Сбросить миссию (DEV)
      </button>
      
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useScoreStore } from "@/stores/score";
import { defineEmits } from "vue";

const emit = defineEmits(["close"]);

const userStore = useUserStore();
const scoreStore = useScoreStore();

const currentLevel = ref(1);
const loadingDay = ref(null);

// Проверка на режим разработки
const isDev = import.meta.env.MODE === "development";

onMounted(async () => {
  await userStore.loadUserData();
  currentLevel.value = userStore.dailyMissionLevel;

  console.log("Daily Mission Level:", currentLevel.value);
  console.log("Daily Mission Date:", userStore.dailyMissionDate);
});

function close() {
  emit("close");
}

function getButtonText(day) {
  if (day < currentLevel.value) {
    return "Выполнено";
  } else if (day === currentLevel.value) {
    return `День ${day}`;
  } else {
    return `День ${day} `;
  }
}

function calculateReward(day) {
  // Пример: разные награды для определенных дней
  const rewardConfig = {
    1: 1000,
    2: 2000,
    3: 3000,
    4: 4000,
    5: 8000,
    6: 10000,
    7: 12000,
    8: 14000,
    9: 16000,
  };

  return rewardConfig[day] || 0; // Возвращаем награду или 0, если день не найден
}


function canCollect(day) {
  const today = new Date();
  const isTodayCollected = userStore.dailyMissionDate
    && new Date(userStore.dailyMissionDate).toDateString() === today.toDateString();

  return day === currentLevel.value && !isTodayCollected;
}


async function collectReward(day) {
  if (!canCollect(day)) {
    console.log(`Нельзя собрать награду за день ${day}`);
    return;
  }

  loadingDay.value = day; // Устанавливаем состояние загрузки
  console.log(`Сбор награды за день ${day}`);

  const reward = calculateReward(day); // Вызов функции для расчета награды

  try {
    await scoreStore.addScore(reward);
    showRewardAnimation(day, reward);
    console.log(`Награда ${reward} успешно добавлена`);

    const newLevel = currentLevel.value + 1;
    await userStore.updateDailyMission(newLevel);
    console.log(`Уровень миссии обновлен до ${newLevel}`);

    currentLevel.value = newLevel;
  } catch (error) {
    console.error("Ошибка при получении награды:", error);
  } finally {
    loadingDay.value = null; // Сбрасываем состояние загрузки
    console.log("Состояние загрузки сброшено");
  }
}
function showRewardAnimation(day, reward) {
}


// Временная функция для сброса миссии
async function resetMission() {
  await userStore.resetDailyMission();
  currentLevel.value = 1;
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Полупрозрачный фон */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: rgba(
    42,
    41,
    46,
    0.9
  ); /* Полупрозрачный фон, аналогичный меню */
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 700px; /* Увеличенная максимальная ширина */
  width: 95%; /* Увеличенная ширина */
  height: auto; /* Автоматическая высота */
  max-height: 90vh; /* Максимальная высота до 90% от высоты окна */
  overflow-y: auto; /* Добавить прокрутку, если содержимое превышает высоту */
}

.daily-modal-content {
  padding: 30px 40px; /* Увеличенные внутренние отступы */
}

.menu-button {
  background: rgba(255, 255, 255, 0.15); /* Полупрозрачный белый фон */
  color: #ffffff; /* Белый цвет текста */
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s;
}

.menu-button:hover {
  background-color: rgba(
    255,
    255,
    255,
    0.25
  ); /* Более яркий фон при наведении */
}

.close-button {
  margin-top: 20px;
}

/* Стили для кнопок миссий */
.missions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.mission-button {
  border: none;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.mission-button.completed {
  background-color: gray;
  color: white;
  cursor: default;
}

.mission-button.active {
  background-color: #968a4c;
  color: white;
}

.mission-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.button-reset {
  /* Стили для временной кнопки сброса */
}
</style>
