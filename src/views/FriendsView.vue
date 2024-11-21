<template>
  <div class="">
    <h1>Друзья</h1>

    <div class="center">
      <button class="referal" @click="copy">{{ referalText }}</button>
    </div>

    <!-- Сообщение, если нет друзей -->
    <h3 v-if="friends.length === 0">
      Поделись ссылкой с друзьями и получи 20% с их дохода
    </h3>

    <!-- Список друзей -->
    <ul class="list" v-if="friends.length > 0">
      <li class="list-item" v-for="friend in friends" :key="friend.id">
        {{ friend.name }}
        <span class="list-btn done">50</span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { useTelegram } from "@/services/telegram";
import { useAppStore } from "@/stores/app";
import { ref, computed } from "vue";

const app = useAppStore();
const { user } = useTelegram();

const referalText = ref("Your referal");

// Безопасная обработка данных друзей
const friends = computed(() => {
  // Проверка на существование данных о пользователе и друзьях
  if (app.user && app.user.friends) {
    return Object.keys(app.user.friends).map((id) => ({
      id,
      name: app.user.friends[id] || "Неизвестный друг", // Подстраховка на случай отсутствия имени
    }));
  }
  return [];
});

function copy() {
  const userId = user?.id || "unknown";
  navigator.clipboard.writeText(`https://t.me/testikbt_bot?start=${userId}`);
  referalText.value = "Copied!";
}
</script>
