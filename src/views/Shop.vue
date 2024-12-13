<template>
  <div class="flex flex-col p-4">
    <h1 class="text-center text-2xl font-extrabold dark:text-white mb-2">
      Магазин улучшений
    </h1>

    <div
      v-for="item in shopItems"
      :key="item.id"
      class="p-2 shadow-md hover:shadow-lg rounded-2xl mb-2 flex justify-between items-center"
      :class="{ 'opacity-50 cursor-not-allowed': isItemPurchased(item) }"
      style="background: rgba(42, 41, 46, 0.3)"
    >
      <div class="p-2 flex items-center gap-2">
        <img
          :src="getImgURL(item.action)"
          alt="Item Icon"
          class="w-12 h-12 object-cover rounded-md"
        />
        <div class="text-left">
          <p class="font-semibold text-sm text-gray-100">
            {{ item.name }}
          </p>
          <p class="text-sm font-light mt-1">
            {{ item.description }}
          </p>
        </div>
      </div>

      <div class="flex justify-end min-w-24">
        <button
          class="candy green inline-flex w-full py-1 px-2 cursor-pointer items-center justify-center bg-red-500 shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full"
          @click="buyItem(item)"
          :disabled="!canBuyItem(item) || isItemPurchased(item)"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/272/272525.png"
            alt="Coin Icon"
            class="h-4 w-4"
          />
          <span class="text-sm font-light">
            &nbsp;{{ formatNumberWithK(item.cost) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useScoreStore } from "@/stores/score";
import supabase from "@/services/supabase";

const scoreStore = useScoreStore();

// Описание доступных предметов
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
    name: "Аккумулятор",
    description: "Увеличь максимальную энергию до 2000 ",
    cost: 10000,
    action: "increaseMaxEnergyTo2000",
  },
  {
    id: 5,
    name: "Электрощиток",
    description: "Увеличь максимальную энергию до 4000",
    cost: 35000,
    action: "increaseMaxEnergyTo4000",
  },
  {
    id: 6,
    name: "Энергостанция",
    description: "Увеличь максимальную энергию до 6000",
    cost: 70000,
    action: "increaseMaxEnergyTo6000",
  },
  {
    id: 4,
    name: "Двойная монета",
    description: "Каждое нажатие дает по две монеты",
    cost: 100000,
    action: "increaseMultitap",
  },
  {
    id: 7,
    name: "Золотой брелок",
    description: "Дает пассивный заработок в 100 монет каждый час",
    cost: 500000,
    action: "goldenTrinket",
  },
  {
    id: 3,
    name: "Путь самурая",
    description: "Поменяй кнопку и стань избранным",
    cost: 1000000,
    action: "customButton",
  },
]);

// Проверка, куплен ли предмет
function isItemPurchased(item) {
  return scoreStore.purchasedItems[item.id] && item.id !== 1; // Исключение для батарейки
}

// Проверка на доступность покупки
function canBuyItem(item) {
  if (scoreStore.purchasedItems[item.id] && item.id !== 1) {
    return false; // Уникальные предметы уже куплены
  }
  return scoreStore.score >= item.cost;
}

// Форматирование чисел
function formatNumberWithK(number) {
  return number >= 1000 ? `${Math.round(number / 1000)}K` : number;
}

// Получение иконки предмета
function getImgURL(action) {
  return new URL(`/src/assets/icon-${action}.png`, import.meta.url).href;
}

// Покупка предмета
async function buyItem(item) {
  const purchasedItems = scoreStore.purchasedItems || {};

  // Проверяем, можно ли купить предмет
  if (!canBuyItem(item)) {
    return;
  }

  // Списание стоимости
  scoreStore.score -= item.cost;

  // Выполнение действия
  switch (item.action) {
    case "restoreEnergy":
      scoreStore.energy = scoreStore.maxEnergy;
      break;
    case "increaseMaxEnergyTo2000":
      if (scoreStore.maxEnergy < 2000) scoreStore.maxEnergy = 2000;
      break;
    case "increaseMaxEnergyTo4000":
      if (scoreStore.maxEnergy < 4000) scoreStore.maxEnergy = 4000;
      break;
    case "increaseMaxEnergyTo6000":
      if (scoreStore.maxEnergy < 6000) scoreStore.maxEnergy = 6000;
      break;
    case "customButton":
      scoreStore.hasCustomButton = true;
      break;
    case "increaseMultitap":
      scoreStore.multitapLevel += 1;
      break;
    case "goldenTrinket":
      scoreStore.hasGoldenTrinket = true;
      break;
    default:
  }

  // Обновление списка купленных предметов
  purchasedItems[item.id] = true;
  scoreStore.purchasedItems = purchasedItems;

  // Сохранение в Supabase
  const { error } = await supabase
    .from("users")
    .update({
      purchased_items: purchasedItems,
      score: scoreStore.score,
      max_energy: scoreStore.maxEnergy,
      energy: scoreStore.energy,
      multitap_level: scoreStore.multitapLevel,
      has_golden_trinket: scoreStore.hasGoldenTrinket,
      has_custom_button: scoreStore.hasCustomButton,
    })
    .eq("id", scoreStore.userId);
  if (error) {
    console.error("Ошибка обновления данных в Supabase:", error);
    
    return;
  }


}
</script>

<style scoped>
/* Стили для купленных предметов */
button:disabled {
  background-color: #7e7e7e;
  cursor: not-allowed;
  opacity: 0.5;
}

.opacity-50 {
  opacity: 0.5;
}
.cursor-not-allowed {
  cursor: not-allowed;
}
</style>
