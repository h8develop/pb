<template>
  <div class="flex items-center flex-col p-4">
    <h1 class="text-center text-2xl font-extrabold dark:text-white mb-2">
      Друзья
    </h1>
    <div class="rounded-2xl p-10 bg-[#2a292e4d] relative mt-20">
      <img
        src="https://cdn-icons-png.flaticon.com/512/9592/9592247.png"
        alt=""
        class="absolute bottom-1 -right-7 w-28 rotate-12"
      />
      <img
        src="https://cdn-icons-png.flaticon.com/512/9592/9592247.png"
        alt=""
        class="absolute -top-20 left-1 w-28 rotate-45"
      />

      <p class="mb-2 text-lg">
       Поделись и получи вознаграждение !
      </p>
      <div class="flex gap-4">
        <button
          type="button"
          @click="copy"
          class="text-white bg-[#ffffff1a] hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm w-full px-12 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <span style="font-size: 14px">
            {{ referalText }}
          </span>
        </button>
        <!-- <button
          type="button"
          @click="copy"
          class="text-white bg-[#ffffff1a] hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-6 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M6.6 11.397c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c2.715 0 4.073 0 4.916.847c.844.847.844 2.21.844 4.936v4.82c0 2.726 0 4.089-.844 4.936c-.843.847-2.201.847-4.916.847h-2.88c-2.716 0-4.073 0-4.917-.847s-.843-2.21-.843-4.936z"
            />
            <path
              fill="currentColor"
              d="M4.172 3.172C3 4.343 3 6.229 3 10v2c0 3.771 0 5.657 1.172 6.828c.617.618 1.433.91 2.62 1.048c-.192-.84-.192-1.996-.192-3.66v-4.819c0-2.726 0-4.089.843-4.936c.844-.847 2.201-.847 4.917-.847h2.88c1.652 0 2.8 0 3.638.19c-.138-1.193-.43-2.012-1.05-2.632C16.657 2 14.771 2 11 2S5.343 2 4.172 3.172"
              opacity="0.5"
            />
          </svg>
        </button> -->
      </div>
    </div>
    <!-- Friends list -->
    <div
      class="rounded-2xl bg-[#2a292e4d] bg-card text-card-foreground shadow-sm w-full mt-4"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-2xl font-semibold leading-none tracking-tight">
          Друзья
        </h3>
      </div>
      <div class="p-6 pt-0">
        <span v-if="!friends.length"> У тебя еще нет друзей༼ つ ಥ_ಥ ༽つ </span>
        <ul class="space-y-4" v-if="friends.length > 0">
          <li class="flex items-center space-x-4" v-for="friend in friends" :key="friend.id">
  <span class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full">
    <img src="https://ggheaven.com/wp-content/uploads/2021/11/3-2034x2048.png" alt="avatar" />
  </span>
  <div class="flex-1 min-w-0">
    <p class="text-sm font-medium text-white truncate">
      {{ friend.name }}
    </p>
  </div>
</li>

        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useTelegram } from "@/services/telegram";
import { useAppStore } from "@/stores/app";
import { ref, computed } from "vue";

const app = useAppStore();
const { user } = useTelegram();

const referalText = ref("Твоя персональная ссылка");


const friends = computed(() => {
  // Проверка на существование данных о пользователе и друзьях
  if (app.user && app.user.friends) {
    return Object.entries(app.user.friends).map(([userId, userName]) => ({
      id: userId, // userId теперь является id
      name: userName || "Неизвестный друг", // userName — это имя друга
    }));
  }
  return [];
});



function copy() {
  const userId = user?.id;
  if (!userId || userId === 'unknown') {
    alert('Не удалось получить ваш Telegram ID. Пожалуйста, попробуйте позже.');
    return;
  }
  navigator.clipboard.writeText(`https://t.me/GoldenBustBot?start=${userId}`);
  referalText.value = "Поделись!";
}
</script>
<style scoped>
button {
  background: linear-gradient(to top, #cd28ff, #dab305);
  box-shadow: 0 6px 3px -3px rgba(0, 0, 0, 0.75);
  text-shadow: 3px 2px 0 rgba(0, 0, 0, 0.3);
  font-weight: bold;
}
button:active {
  transition: all 0.25s cubic-bezier(1, -0.4, 0, 1.4);
  animation: bounce 1s ease-out 0s 1 normal both;
  transform: translateY(4px);
}
</style>
