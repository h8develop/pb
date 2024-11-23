<template>
  <div class="modal-overlay" @click="close">
    <div class="modal-content daily-modal-content relative" @click.stop>
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
      <div class="missions-grid grid grid-cols-3 mt-4 gap-2">
        <button
          v-for="day in 12"
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
            {{ getButtonText(day) }}
          </span>
          <img
            src="https://cdn-icons-png.flaticon.com/512/5525/5525147.png"
            alt=""
            class="h-10 w-10"
          />
          <span
            class="text-sm font-normal mt-1 py-0.5 px-4 bg-yellow-500 rounded-full"
          >
            {{ day * 10 }}
          </span>
        </button>
      </div>
      <!-- Claim Button -->
      <div>
        <button class="mission-button menu-button mt-4">Получить</button>
      </div>
    </div>

    <!--  -->
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useUserStore } from "@/stores/userStore";
import { useScoreStore } from "@/stores/score";
import { defineEmits } from "vue";

const emit = defineEmits(["close"]);

const userStore = useUserStore();
const scoreStore = useScoreStore();

const currentLevel = ref(1);

onMounted(async () => {
  await userStore.loadUserData();
  currentLevel.value = userStore.dailyMissionLevel;
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
    return `День ${day}`;
  }
}

function getReward(day) {
  return day * 10; // Формула расчета награды за день
}

function canCollect(day) {
  return day === currentLevel.value;
}

async function collectReward(day) {
  if (!canCollect(day)) return;

  const reward = getReward(day);
  await scoreStore.add(reward); // Используем метод add для добавления очков

  await userStore.updateDailyMission(day + 1);

  currentLevel.value = day + 1;
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
  /* display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0; */
}

.mission-button {
  /* flex: 1 0 45%; Сделать кнопки более широкими */
  /* padding: 10px; */
  border: none;
  /* border-radius: 8px; */
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.mission-button.completed {
  background-color: gray;
  color: white;
}

.mission-button.active {
  background-color: #968a4c;
  color: white;
}
</style>
