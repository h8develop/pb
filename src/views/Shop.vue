<template>
  <div class="shop-container">
    <h1>Магазин улучшений</h1>
    <div class="items">
      <div class="item" v-for="item in shopItems" :key="item.id">
        <h3>{{ item.name }}</h3>
        <p>{{ item.description }}</p>
        <p>Стоимость: {{ item.cost }} коинов</p>
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
    description: 'Восстановить энергию до максимума (1000 тапов)',
    cost: 1000,
    action: 'restoreEnergy',
  },
  {
    id: 2,
    name: 'Увеличить максимальную энергию',
    description: 'Увеличить максимальное количество энергии до 2000 тапов',
    cost: 10000,
    action: 'increaseMaxEnergy',
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
    name: 'Мультитап',
    description: 'Увеличь количество тапов за одно нажатие',
    cost: 10000,
    action: 'increaseMultitap',
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
    case 'increaseMaxEnergy':
      scoreStore.maxEnergy = 2000;
      break;
    case 'customButton':
      // Логика кастомизации кнопки
      break;
    case 'increaseMultitap':
      scoreStore.multitapLevel += 1;
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
