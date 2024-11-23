<template>
  <div class="flex flex-col p-4">
    <h1 class="text-center text-2xl font-extrabold dark:text-white mb-2">
      GoldenBust
    </h1>

    <div
      class="p-2 shadow-md hover:shodow-lg rounded-2xl mb-2 flex justify-between items-center"
      style="background: rgba(42, 41, 46, 0.3)"
      v-for="item in shopItems"
      :key="item.id"
    >
      <div class="p-2 flex items-center gap-2">
        <img
          :src="getImgURL(item.action)"
          alt=""
          class="w-12 h-12 object-cover rounded-md"
        />
        <div class="text-left">
          <p class="leading-none font-semibold text-sm text-gray-100 text-left">
            {{ item.name }}
          </p>
          <p class="text-sm font-light leading-none mt-1">
            {{ item.description }}
          </p>
        </div>
      </div>
      <div class="flex justify-end min-w-24">
        <button
          class="candy green inline-flex w-full py-1 px-2 cursor-pointer items-center justify-center bg-red-500 shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full"
          @click="buyItem(item)"
          :disabled="!canAfford(item.cost)"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/272/272525.png"
            alt=""
            class="h-4 w-4"
          />
          <span class="text-sm font-light">
            &nbsp;{{ formatNumberWithK(item.cost) }}
          </span>
        </button>
      </div>
      <!-- <button
              class="flex-no-shrink cursor-not-allowed bg-red-400 px-2 py-1 text-sm shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-400 text-white rounded-full"
              disabled
            >
              Купить
            </button> -->
      <!-- <button @click="buyItem(item)" :disabled="!canAfford(item.cost)">
              Купить
            </button> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useScoreStore } from "@/stores/score";

const scoreStore = useScoreStore();

const shopItems = ref([
  {
    id: 1,
    name: "Батарейка",
    description: "Восполни энергию до максимума",
    cost: 1000,
    action: "restoreEnergy",
  },
  {
    id: 2,
    name: "Аккумулятор ",
    description: "Увеличивает максимальную энергию до 2000 тапов",
    cost: 10000,
    action: "increaseMaxEnergyTo2000",
  },
  {
    id: 3,
    name: "Путь самурая",
    description: "Кастомизируй внешний вид кнопки для кликов",
    cost: 1000000,
    action: "customButton",
  },
  {
    id: 4,
    name: "Двойная монета",
    description: "Увеличь количество коинов - два за тап",
    cost: 10000,
    action: "increaseMultitap",
  },
  // Новые предметы
  {
    id: 5,
    name: "Электрощиток",
    description: "Увеличивает максимальную энергию до 4000 тапов",
    cost: 20000,
    action: "increaseMaxEnergyTo4000",
  },
  {
    id: 6,
    name: "Энергостанция",
    description: "Увеличивает максимальную энергию до 6000 тапов",
    cost: 30000,
    action: "increaseMaxEnergyTo6000",
  },
  {
    id: 7,
    name: "Золотой брелок",
    description: "Дает пассивный заработок в 100 монет каждый час",
    cost: 50000,
    action: "goldenTrinket",
  },
]);

function canAfford(cost) {
  return scoreStore.score >= cost;
}
function formatNumberWithK(number) {
  if (number >= 1000) {
    // return (number / 1000).toFixed(1) + "K";
    return `${Math.round(number / 1000)}k`;
  } else {
    return number;
  }
}

function getImgURL(image) {
  return new URL(`/src/assets/icon-${image}.jpg`, import.meta.url).href;
}
async function buyItem(item) {
  if (!canAfford(item.cost)) {
    alert("Недостаточно коинов для покупки");
    return;
  }

  // Вычитаем стоимость
  scoreStore.score -= item.cost;

  // Выполняем действие
  switch (item.action) {
    case "restoreEnergy":
      scoreStore.energy = scoreStore.maxEnergy;
      break;
    case "increaseMaxEnergyTo2000":
      scoreStore.maxEnergy = 2000;
      break;
    case "increaseMaxEnergyTo4000":
      scoreStore.maxEnergy = 4000;
      break;
    case "increaseMaxEnergyTo6000":
      scoreStore.maxEnergy = 6000;
      break;
    case "customButton":
      // Логика кастомизации кнопки
      break;
    case "increaseMultitap":
      scoreStore.multitapLevel += 1;
      break;
    case "goldenTrinket":
      scoreStore.hasGoldenTrinket = true;
      break;
    default:
      break;
  }

  // Обновляем данные в Supabase
  await scoreStore.updateScoreInSupabase();
  await scoreStore.updateEnergyInSupabase();
}
</script>

<style scoped>
.shop-container {
  padding: 20px;
}

.items {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.item {
  flex: 1 0 45%;
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 5px;
}

.item h3 {
  margin-bottom: 10px;
}

.item button {
  margin-top: 10px;
}
</style>
