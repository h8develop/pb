<template>
  <div class="flex items-center flex-col p-4">
    <h1 class="text-center text-2xl font-extrabold dark:text-white mb-2">
      Друзья
    </h1>
    <div class="rounded-2xl p-10 bg-[#2a292e4d] relative mt-28">
      <img
        src="https://cdn-icons-png.flaticon.com/512/9592/9592247.png"
        alt=""
        class="absolute -bottom-2 -right-10 w-28 rotate-12"
      />
      <img
        src="https://cdn-icons-png.flaticon.com/512/9592/9592247.png"
        alt=""
        class="absolute -top-20 left-1 w-28 rotate-45"
      />

      <p class="mb-2 text-lg">
        Поделись ссылкой с друзьями и получи 20% с их дохода
      </p>
      <div class="flex gap-4">
        <button
          type="button"
          @click="copy"
          class="text-white bg-[#ffffff1a] hover:bg-blue-800 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-12 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          <span style="font-size: 12px">
            {{ referalText }}
          </span>
        </button>
        <button
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
        </button>
      </div>
    </div>
    <!-- Friends list -->
    <div
      class="rounded-2xl bg-[#2a292e4d] bg-card text-card-foreground shadow-sm w-full max-w-md mx-auto mt-4"
    >
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="text-2xl font-semibold leading-none tracking-tight">
          Friends List
        </h3>
      </div>
      <div class="p-6 pt-0">
        <ul class="space-y-4">
          <li
            class="flex items-center space-x-4"
            v-for="friend in friends_mock"
          >
            <span
              class="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full"
            >
              <img :src="friend.avatar" alt="" />
              <span
                class="flex h-full w-full items-center justify-center rounded-full bg-muted"
                >AJ</span
              ></span
            >
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">
                {{ friend.name }}
              </p>
              <p class="text-sm text-white truncate">{{ friend.status }}</p>
            </div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-green-400"
              v-if="friend.status == 'online'"
            ></div>
            <div
              class="w-2.5 h-2.5 rounded-full bg-gray-400"
              v-else-if="friend.status == 'offline'"
            ></div>
            <div class="w-2.5 h-2.5 rounded-full bg-yellow-400" v-else></div>
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

const referalText = ref("Your referal");
const friends_mock = [
  {
    id: 1,
    name: "Alice Johnson",
    avatar: "https://img.icons8.com/?size=96&id=23235&format=png",
    status: "online",
  },
  {
    id: 2,
    name: "Bob Smith",
    avatar: "https://img.icons8.com/?size=96&id=23236&format=png",
    status: "offline",
  },
  {
    id: 3,
    name: "Charlie Brown",
    avatar: "https://img.icons8.com/?size=96&id=23237&format=png",
    status: "online",
  },
  {
    id: 4,
    name: "Diana Prince",
    avatar: "https://img.icons8.com/?size=96&id=23238&format=png",
    status: "away",
  },
  {
    id: 5,
    name: "Ethan Hunt",
    avatar: "https://img.icons8.com/?size=96&id=23239&format=png",
    status: "online",
  },
];

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
<style scoped>
button {
  background: linear-gradient(to top, #fe4495, #d5095f);
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
