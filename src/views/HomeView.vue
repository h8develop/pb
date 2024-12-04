<!-- src/views/HomeView.vue -->
<template>
  <div class="home-container">
    <!-- Верхняя панель с названием бота, профилем и кнопкой "О токене" -->
    <div class="flex gap-4 justify-between items-center mb-4">
      <div
        class="rounded-full flex flex-col items-center  py-0.5 pr-2.5 pl-1.5 border border-transparent text-sm text-white transition-all shadow-sm"
      >
        <div>
          <img
            alt="user"
            :src="userAvatar"
            class="h-8 w-8 rounded-full object-cover object-center"
          />
        </div>
        <span class="text-[12px]">
          {{ userName }}
        </span>
      </div>
      <h1 class="bot-title">GoldenBust</h1>
      <div
      class="max-w-full leading-none font-normal m-1 px-2 py-2 rounded-full bg-[linear-gradient(to_top,#cd28ff,#dab305)] text-xs text-white"

        role="button"
        @click="openTokenModal"
      >
        О токене
      </div>
    </div>

    <!-- Валюта и доходы -->
    <div class="header mt-2">
      <div class="flex">
        <img src="../assets/valuta1.png" alt="coin" class="valuta-icon" />
        <h2 class="score" id="score">{{ scoreStore.score }}</h2>
      </div>
      <div class="earnings flex gap-2">
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

    <div class="circle">
    <img
      @click="increment"
      ref="img"
      id="circle"
      :src="clickButtonImage"
      alt="Click Target"

      :style="{ cursor: scoreStore.energy > 0 ? 'pointer' : 'not-allowed' }"
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
          src="/src/assets/iphoneKONKURS1.png"
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
      class="daily-missions-button menu-button"
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
          ✨Golden Bust – это уникальная платформа, где вы превращаете простые действия в реальные награды! 💰
Выполняйте интересные задания, подписывайтесь на каналы и зарабатывайте золото, которое можно использовать для участия в розыгрышах крутых призов. 🎁

📢 Ваши действия - Ваши награды🚀


        </p>
        <button class="menu-button close-button" @click="closeTokenModal">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useScoreStore } from "@/stores/score";
import { useTelegram } from "@/services/telegram";
import DailyMissionsModal from "@/components/DailyMissionsModal.vue";
import tapBolsImage from '../assets/tap_bols.png';
import customButtonImage from '../assets/custom_button.png';



const scoreStore = useScoreStore();
const { user } = useTelegram();
const img = ref(null);

// Данные пользователя
const userAvatar = ref("../assets/default-avatar.png");
const userName = ref("Имя пользователя");

// Проверяем, есть ли данные пользователя из Telegram
if (user) {
  userAvatar.value = user.photo_url || "../assets/default-avatar.png";
  userName.value = `${user.first_name || ""} ${user.last_name || ""}`.trim();
}

// Управление модальным окном для "О токене"
const isTokenModalOpen = ref(false);

// Управление модальным окном для ежедневных миссий
const isDailyModalOpen = ref(false);

// Добавляем вычисляемое свойство tapEarnings
const tapEarnings = computed(() => {
  return scoreStore.multitapLevel > 0 ? scoreStore.multitapLevel + 1 : 1;
});

// Значения доходов
const hourlyEarnings = computed(() => {
  return scoreStore.hasGoldenTrinket ? 100 : 0;
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
  window.open("https://t.me/GOLDENBUST_CHANNEL/6", "_blank");
}


const clickButtonImage = computed(() => {
  if (scoreStore.hasCustomButton) {
    return customButtonImage;
  } else {
    return tapBolsImage;
  }
});



// Функция для обработки клика по монетке
async function increment(event) {
  const rect = event.target.getBoundingClientRect();
  const offsetX = event.clientX - rect.left - rect.width / 2;
  const offsetY = event.clientY - rect.top - rect.height / 2;

  const DEG =45;
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
  await scoreStore.add(taps);
}

// Загружаем данные пользователя при монтировании компонента
onMounted(() => {
  scoreStore.loadUserData();
});
</script>

<style scoped>
/* Стили для модального окна "О токене" и "Ежедневных миссий" */
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
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
  height: 50px;
  border-radius: 20px;
  font-size: 1.2rem;
  padding-top: 4px;
  padding-bottom: 4px;
  padding: 4px;
  background-image: url("https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-3d-icon-download-in-png-blend-fbx-gltf-file-formats--present-surprise-package-new-year-party-pack-festival-days-icons-5740394.png?f=webp"),
    url("https://cdn3d.iconscout.com/3d/premium/thumb/gift-box-3d-icon-download-in-png-blend-fbx-gltf-file-formats--present-surprise-package-new-year-party-pack-festival-days-icons-5740394.png?f=webp");
  background-position: top right, top left;
  background-size: contain;
  background-repeat: no-repeat;
  z-index: 1;


}

.daily-missions-button:hover {
  /* background: rgba(42, 41, 46, 0.3); Полупрозрачный фон */
  /* animation: animate 10s linear infinite; */
  transform: scale(0.9);
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
