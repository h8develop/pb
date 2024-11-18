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
          <p>{{ hourlyEarnings }} голда / час</p>
        </div>
        <div class="earning-item">
          <p>{{ tapEarnings }} голда / тап</p>
        </div>
      </div>
    </div>

    <!-- Монетка -->
    <div class="circle">
      <img @click="increment" ref="img" id="circle" src="../assets/tap_bols.png" alt="Click Target" />
    </div>

    <!-- Счетчик энергии -->
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
    <div class="daily-icon" @click="isDailyModalOpen = true">
      <img src="" alt="Daily Missions" />
    </div>

    <!-- Модальное окно для ежедневных миссий -->
    <DailyMissionsModal v-if="isDailyModalOpen" @close="isDailyModalOpen = false" />

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
import { ref, onMounted, computed } from 'vue';
import { useScoreStore } from '@/stores/score';
import { useRouter } from 'vue-router';
import { useTelegram } from '@/services/telegram';
import DailyMissionsModal from '@/components/DailyMissionsModal.vue';

const scoreStore = useScoreStore();
const router = useRouter();
const { user } = useTelegram();
const img = ref(null);

// Данные пользователя
const userAvatar = ref('../assets/default-avatar.png');
const userName = ref('Имя пользователя');

// Проверяем, есть ли данные пользователя из Telegram
if (user) {
  userAvatar.value = user.photo_url || '../assets/default-avatar.png';
  userName.value = `${user.first_name || ''} ${user.last_name || ''}`.trim();
}

// Управление модальным окном для "О токене"
const isTokenModalOpen = ref(false);

// Управление модальным окном для ежедневных миссий
const isDailyModalOpen = ref(false);

// Таймер (пример без функциональности)
const timeLeft = ref('00:00:00');

// **Добавляем вычисляемое свойство tapEarnings**
const tapEarnings = computed(() => {
  // Логика для вычисления дохода за тап
  // Если мультитап не улучшен, доход за тап равен 1
  return scoreStore.multitapLevel > 0 ? scoreStore.multitapLevel + 1 : 1;
});

// Значения доходов (примерные значения, их можно получить из стора или вычислить)
const hourlyEarnings = computed(() => {
  // Логика для вычисления дохода в час
  // Здесь вы можете добавить свою формулу расчета
  return 0; // Пример значения
});

function openTokenModal() {
  isTokenModalOpen.value = true;
}

function closeTokenModal() {
  isTokenModalOpen.value = false;
}

// Переходы
function goToDailyMissions() {
  isDailyModalOpen.value = true; // Открыть модальное окно с ежедневными миссиями
}

// Функция для обработки клика по монетке
function increment(event) {
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
  plusOne.textContent = `+${tapEarnings.value}`;
  plusOne.style.left = `${event.clientX - rect.left}px`;
  plusOne.style.top = `${event.clientY - rect.top}px`;
  img.value.parentElement.appendChild(plusOne);
  setTimeout(() => plusOne.remove(), 2000);

  // Обновляем расчет количества тапов
  const taps = 1; // За один тап пользователь тратит 1 энергию
  scoreStore.add(taps);
}

// Загружаем данные пользователя при монтировании компонента
onMounted(() => {
  scoreStore.loadUserData();
});
</script>

