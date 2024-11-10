<template>
  <div class="home-container">
    <!-- Верхняя панель с названием бота, профилем и кнопкой "О токене" -->
    <div class="top-bar">
      <div class="profile">
        <img :src="userAvatar" alt="Avatar" class="avatar" />
        <span class="username">{{ userName }}</span>
      </div>
      <h1 class="bot-title">GoldenBust</h1>
      <button class="about-token" @click="openTokenModal">О токене</button>
    </div>

    <!-- Валюта и доходы -->
    <div class="header">
      <img src="../assets/valuta.png" alt="coin" class="valuta-icon" />
      <h2 class="score" id="score">{{ scoreStore.score }}</h2>
      <div class="earnings">
        <div class="earning-item">
          <p>{{ scoreStore.hourlyEarnings }} голда / час</p>
        </div>
        <div class="earning-item">
          <p>{{ scoreStore.tapEarnings }} голда / тап</p>
        </div>
      </div>
    </div>

    <!-- Монетка -->
    <div class="circle">
      <img @click="increment" ref="img" id="circle" src="../assets/tap_bols.png" alt="Click Target" />
    </div>

    <!-- Счетчик кликов -->
    <div class="tap-counter">
      <img src="/src/assets/white_coin_energy.png" alt="Icon" class="tap-icon" />
      <p>{{ scoreStore.energy }} / {{ scoreStore.maxEnergy }}</p>
    </div>

    <!-- Контейнер для конкурса -->
    <div class="contest-container" @click="goToDailyMissions">
      <img src="../assets/white_icon_dollar.png" alt="Конкурс" class="contest-image" />
      <div class="timer">
        <p>Стань участником розыгрыша {{ timeLeft }}</p>
      </div>
    </div>

    <!-- Иконка ежедневных миссий -->
    <div class="daily-icon" @click="openDailyMissions">
      <img src="" alt="Daily Missions" />
    </div>

    <!-- Модальное окно для ежедневных миссий -->
    <div v-if="isDailyModalOpen" class="modal">
      <div class="modal-content">
        <button class="close-modal" @click="closeDailyMissions">Закрыть</button>
        <DailyMissions />
      </div>
    </div>
    <!-- Модальное окно для "О токене" -->
    <div v-if="isTokenModalOpen" class="modal-overlay" @click="closeTokenModal">
      <div class="modal-content" @click.stop>
        <h2>О токене</h2>
        <p>Здесь можно разместить информацию о токене, его особенности и другие важные детали.</p>
        <button class="close-button" @click="closeTokenModal">Закрыть</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useScoreStore } from '@/stores/score';
import { useRouter } from 'vue-router';

const scoreStore = useScoreStore();
const img = ref(null);
const router = useRouter();

// Данные пользователя
const userAvatar = ref('../assets/default-avatar.png');
const userName = ref('Имя пользователя');

// Управление модальным окном для "О токене"
const isTokenModalOpen = ref(false);

// Функции для открытия и закрытия модального окна
function openTokenModal() {
  isTokenModalOpen.value = true;
}

function closeTokenModal() {
  isTokenModalOpen.value = false;
}

// Таймер
const timeLeft = ref('00:00:00');

// Управление модальным окном
const isDailyModalOpen = ref(false);

function openDailyMissions() {
  isDailyModalOpen.value = true;
}

function closeDailyMissions() {
  isDailyModalOpen.value = false;
}

// Таймер обратного отсчёта
function updateTimer() {
  const endTime = new Date('2024-12-31T23:59:59');
  const currentTime = new Date();
  const timeDiff = endTime - currentTime;

  if (timeDiff > 0) {
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
    const seconds = Math.floor((timeDiff / 1000) % 60);
    timeLeft.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    timeLeft.value = '00:00:00';
  }
}

onMounted(() => {
  updateTimer();
  setInterval(updateTimer, 1000);
});

// Переходы
function goToDailyMissions() {
  openDailyMissions(); // Открыть модальное окно с ежедневными миссиями
}

function increment(event) {
  scoreStore.add(); // Используем метод add из нового кода

  const rect = event.target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - rect.width / 2;
  const offsetY = event.clientY - rect.top - rect.height / 2;

  const DEG = 60;
  const tiltX = (offsetY / rect.height) * DEG;
  const tiltY = (offsetX / rect.width) * -DEG;
  img.value.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

  setTimeout(() => {
    img.value.style.transform = 'rotateX(0deg) rotateY(0deg)';
  }, 300);

  const plusOne = document.createElement('div');
  plusOne.classList.add('plus-one');
  plusOne.textContent = `+${scoreStore.tapEarnings}`;
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;
  img.value.parentElement.appendChild(plusOne);
  setTimeout(() => plusOne.remove(), 2000);
}
</script>
