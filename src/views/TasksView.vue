<template>
  <div class="flex flex-col p-4">
    <h1 class="text-center text-2xl font-extrabold dark:text-white mb-2">
      GoldenBust
    </h1>
    <h3 v-if="app.tasks.length === 0" class="loading-text mt-4">
      Загружаем задания
    </h3>

    <div
      class="p-2 shadow-md hover:shodow-lg rounded-2xl mb-2 flex justify-between items-center"
      style="background: rgba(42, 41, 46, 0.3)"
      v-for="task in app.tasks"
      :key="task.id"
    >
      <div class="p-2 flex items-center gap-2">
        <img
          src="https://icon-library.com/images/gifts-icon/gifts-icon-3.jpg"
          alt=""
          class="w-8 h-8 rounded-md"
        />
        <div class="text-left">
          <p class="leading-none font-semibold text-sm text-gray-100 text-left">
            {{ task.title }}
          </p>
        </div>
      </div>
      <div class="flex justify-end min-w-24">
        <button
          class="candy green inline-flex w-full py-1 px-2 cursor-pointer items-center justify-center bg-red-500 shadow-sm hover:shadow-lg font-medium tracking-wider border-2 border-red-500 text-white rounded-full"
          @click.prevent="openTask(task)"
        >
          <img
            src="https://cdn-icons-png.flaticon.com/512/272/272525.png"
            alt=""
            class="h-4 w-4"
          />
          <span class="text-sm font-bold"> &nbsp;{{ task.amount }} </span>
        </button>
      </div>
    </div>
  </div>
  <!-- <div class="tasks-wrapper">
    <div class="text-content">
      <h1 class="tasks-header">Стань богаче</h1>
      <h3 v-if="app.tasks.length === 0" class="loading-text">Loading tasks...</h3>
      <ul class="list">
        <li class="list-item" v-for="task in app.tasks" :key="task.id">
          <span class="task-title">{{ task.title }}</span>
          <span>
            <a
              @click.prevent="openTask(task)"
              target="_blank"
              class="list-btn"
              :class="{ done: app.user?.tasks?.[task.id] }"
            >
              {{ task.amount }}
            </a>
          </span>
        </li>
      </ul>
    </div>
  </div> -->
</template>

<script setup>
import { useTelegram } from "@/services/telegram";
import { useAppStore } from "@/stores/app";
import { onMounted } from "vue";

const { tg } = useTelegram();
const app = useAppStore();

onMounted(() => {
  app.fetchTasks();
});

async function openTask(task) {
  await app.completeTask(task);
  if (task.url.includes("t.me")) {
    tg.openTelegramLink(task.url);
  } else {
    tg.openLink(task.url);
  }
}
</script>

<style scoped>
/* Оформление блока задач с полупрозрачным фоном */
.text-content {
  background-color: rgba(255, 255, 255, 0.2); /* Полупрозрачный белый фон */
  padding: 20px 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}

/* Заголовок */
.tasks-header {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 16px;
  color: #ffffff;
}

/* Текст загрузки */
.loading-text {
  font-size: 18px;
  color: #777;
}

/* Стили списка */
.list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  margin-bottom: 10px;
  background-color: rgba(255, 255, 255, 0.01);
  border-radius: 8px;
}

.list-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

/* Название задачи */
.task-title {
  font-size: 16px;
  color: #f3f3f3;
}

/* Кнопки */
.list-btn {
  text-decoration: none;
  color: #000000;
  font-weight: bold;
  padding: 6px 12px;
  background-color: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}

.list-btn:hover {
  background-color: inherit;
}

.list-btn.done {
  color: #030303;
  background-color: inherit;
}

.list-btn.done:hover {
  background-color: #28a745;
  color: #fff;
}
</style>
