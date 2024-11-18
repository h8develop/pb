<template>
  <div class="shop-container">
    <h1>Магазин улучшений</h1>
    <div class="items">
      <div class="item" v-for="item in shopItems" :key="item.id">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <p>Стоимость: {{ item.cost }} голды</p>
        <button @click="buyItem(item)" :disabled="!canAfford(item.cost)">
          Купить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useScoreStore } from '@/stores/score';

const scoreStore = useScoreStore();


const shopItems = ref([
  {
    id: 1,
    name: 'Восполнить энергию',
    description: '',
    cost: 1000,
    action: 'restoreEnergy',
  },
  {
    id: 2,
    name: 'Увеличить максимальную энергию до 2000',
    description: 'Увеличивает максимальную энергию до 2000 тапов',
    cost: 10000,
    action: 'increaseMaxEnergyTo2000',
  },
  {
    id: 3,
    name: 'Кастомная кнопка',
    description: 'Кастомизируй внешний вид кнопки для кликов',
    cost: 1000000,
    action: 'customButton',
  },
  {
    id: 4,
    name: 'Удвой заработок',
    description: 'Увеличь количество монет за тап в 2 раза',
    cost: 10000,
    action: 'increaseMultitap',
  },
  // Новые предметы
  {
    id: 5,
    name: 'Увеличить максимальную энергию до 4000',
    description: 'Увеличивает максимальную энергию до 4000 тапов',
    cost: 20000,
    action: 'increaseMaxEnergyTo4000',
  },
  {
    id: 6,
    name: 'Увеличить максимальную энергию до 6000',
    description: 'Увеличивает максимальную энергию до 6000 тапов',
    cost: 30000,
    action: 'increaseMaxEnergyTo6000',
  },
  {
    id: 7,
    name: 'Золотой брелок',
    description: 'Дает пассивный заработок в 100 монет каждый час',
    cost: 50000,
    action: 'goldenTrinket',
  },
]);

function canAfford(cost) {
  return scoreStore.score >= cost;
}

async function buyItem(item) {
  if (!canAfford(item.cost)) {
    alert('Недостаточно коинов для покупки');
    return;
  }

  // Вычитаем стоимость
  scoreStore.score -= item.cost;

  // Выполняем действие
  switch (item.action) {
    case 'restoreEnergy':
      scoreStore.energy = scoreStore.maxEnergy;
      break;
    case 'increaseMaxEnergyTo2000':
      scoreStore.maxEnergy = 2000;
      break;
    case 'increaseMaxEnergyTo4000':
      scoreStore.maxEnergy = 4000;
      break;
    case 'increaseMaxEnergyTo6000':
      scoreStore.maxEnergy = 6000;
      break;
    case 'customButton':
      // Логика кастомизации кнопки
      break;
    case 'increaseMultitap':
      scoreStore.multitapLevel += 1;
      break;
    case 'goldenTrinket':
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
