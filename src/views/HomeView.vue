<template>
  <div class="home-container">
    <!-- Верхняя панель с названием бота, профилем и кнопкой "О токене" -->
    <div class="flex gap-4 justify-between items-center mb-4">
      <div
        class="rounded-full flex items-center bg-[#2a292e] py-0.5 pr-2.5 pl-1.5 border border-transparent text-sm text-white transition-all shadow-sm"
      >
        <div class="">
          <img
            :alt="userAvatar"
            :src="userAvatar"
            class="h-8 w-8 rounded-full object-cover object-center"
          />
        </div>
        <span>
          {{ userName }}
        </span>
      </div>
      <h1 class="bot-title">GoldenBust</h1>
      <div
        class="max-w-full leading-none font-normal m-1 px-2 py-2 rounded-full bg-[#2a292e] text-xs text-white"
        role="button"
        @click="openTokenModal"
      >
        О токене
      </div>
    </div>

    <!-- Валюта и доходы -->
    <div class="header mt-10">
      <div class="flex">
        <img src="../assets/valuta.png" alt="coin" class="valuta-icon" />
        <h2 class="score" id="score">{{ scoreStore.score }}</h2>
      </div>
      <div class="earnings flex flex-col gap-2 mt-5">
        <div class="earning-item inline-flex items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9382/9382196.png"
            alt=""
            style="height: 16px; width: 16px"
          />
          <p>{{ hourlyEarnings }} голда / час</p>
        </div>
        <div class="earning-item inline-flex items-center">
          <img
            src="https://www.svgrepo.com/show/32426/tap.svg"
            alt=""
            style="height: 16px; width: 16px"
          />
          <p>{{ tapEarnings }} голда / тап</p>
        </div>
      </div>
    </div>

    <!-- Монетка -->
    <div class="circle mt-10">
      <img
        @click="increment"
        ref="img"
        id="circle"
        src="../assets/tap_bols.png"
        alt="Click Target"
      />
    </div>

    <div
      class="flex gap-2 justify-between items-baseline absolute bottom-24 w-full pl-7 pb-9 pr-5"
    >
      <!-- Счетчик энергии -->
      <div class="tap-counter">
        <img
          src="/src/assets/white_coin_energy.png"
          alt="Icon"
          class="tap-icon"
        />
        <p>
          <b>{{ scoreStore.energy }} </b> / {{ scoreStore.maxEnergy }}
        </p>
      </div>

      <!-- Контейнер для конкурса -->
      <div class="contest-container cursor-pointer" @click="goToDailyMissions">
        <img
          src="https://pngimg.com/d/iphone_13_PNG18.png"
          alt="Конкурс"
          class="contest-image"
        />
        <div class="timer">
          <p>Розыгрыш</p>
        </div>
      </div>
    </div>

    <!-- Кнопка для ежедневных миссий -->

    <button
      class="daily-missions-button menu-button bg-gradient-to-r from-[#ff8c00] via-yellow-800 to-[#ffdd57]"
      @click="openDailyMissions"
    >
      Ежедневные миссии
    </button>
    <!-- Модальное окно для ежедневных миссий -->
    <DailyMissionsModal
      v-if="isDailyModalOpen"
      @close="isDailyModalOpen = false"
    />

    <!-- Модальное окно для "О токене" -->
    <div v-if="isTokenModalOpen" class="modal-overlay" @click="closeTokenModal">
      <div class="modal-content" @click.stop>
        <h2>О токене</h2>
        <p>
          Здесь можно разместить информацию о токене, его особенности и другие
          важные детали.
        </p>
        <!-- Добавляем класс 'menu-button' к кнопке "Закрыть" -->
        <button class="menu-button close-button" @click="closeTokenModal">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useScoreStore } from "@/stores/score";
import { useRouter } from "vue-router";
import { useTelegram } from "@/services/telegram";
import DailyMissionsModal from "@/components/DailyMissionsModal.vue";
import DailyMissionButton from "@/components/DailyMissionButton.vue";
import DailyMissionButtonTest from "@/components/DailyMissionButtonTest.vue";

const scoreStore = useScoreStore();
const router = useRouter();
const { user } = useTelegram();
const img = ref(null);

// Данные пользователя
const userAvatar = new URL("../assets/default-avatar.png", import.meta.url)
  .href;
const userName = ref("Имя пользователя");

// Проверяем, есть ли данные пользователя из Telegram
if (user) {
  // userAvatar = user.photo_url || "../assets/default-avatar.png";
  userName.value = `${user.first_name || ""} ${user.last_name || ""}`.trim();
}

// Управление модальным окном для "О токене"
const isTokenModalOpen = ref(false);

// Управление модальным окном для ежедневных миссий
const isDailyModalOpen = ref(false);

// Таймер (пример без функциональности)
const timeLeft = ref("00:00:00");

// Добавляем вычисляемое свойство tapEarnings
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

function openDailyMissions() {
  isDailyModalOpen.value = true;
}
function goToDailyMissions() {
  window.open("https://t.me/testimGOLD/2", "_blank");
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
    img.value.style.transform = "rotateX(0deg) rotateY(0deg)";
  }, 300);

  const plusOne = document.createElement("div");
  plusOne.classList.add("plus-one");
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

<style scoped>
/* Стили для модального окна "О токене" и "Ежедневных миссий" */
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
  background: rgba(255, 255, 255, 0.2); /* Полупрозрачный белый фон */
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
    0.2
  ); /* Более яркий фон при наведении */
}

.close-button {
  margin-top: 20px;
}

/* Стили для кнопок миссий */
.missions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
}

.mission-button {
  flex: 1 0 50%; /* Сделать кнопки более широкими */
  padding: 10px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
}

.mission-button.completed {
  background-color: gray;
  color: white;
}

.mission-button.active {
  background-color: gold;
  color: black;
}

.daily-missions-button {
  background: rgba(42, 41, 46, 0.3); /* Полупрозрачный фон */
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 78px;
  left: 1.3rem;
  right: 1.3rem;
  justify-content: space-around;
  height: 40px;
  border-radius: 20px;
  font-size: 1.5rem;
  padding-top: 4px;
  padding-bottom: 4px;
  background-image: url("https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-3d-icon-download-in-png-blend-fbx-gltf-file-formats--present-surprise-package-new-year-party-pack-festival-days-icons-5740394.png?f=webp");
  background-position: top right;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 1;

  /* top: -0.1rem; Регулируем положение кнопки над меню */
}

.daily-missions-button:hover {
  background: rgba(42, 41, 46, 0.3); /* Полупрозрачный фон */

  animation: animate 8s linear infinite;
}
@keyframes animate {
  0% {
    background-position: 0%;
  }
  100% {
    background-position: 400%;
  }
}
.daily-missions-button:before {
  content: "";
  position: absolute;
  top: -5px;
  left: -5px;
  right: -5px;
  bottom: -5px;
  z-index: -1;
  /* background: linear-gradient(45deg, #f15523, #ef3224, #7c3697); */
  background-size: 400%;
  border-radius: 40px;
  opacity: 0;
  transition: 0.5%;
}
.daily-missions-button:hover:before {
  filter: blur(20px);
  opacity: 1;
  animation: animate 8s linear infinite;
}
</style>
