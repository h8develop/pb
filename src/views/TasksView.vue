<template>
  <div class="tasks-wrapper">
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
  </div>
</template>

<script setup>
import { useTelegram } from '@/services/telegram';
import { useAppStore } from '@/stores/app';
import { onMounted } from 'vue';

const { tg } = useTelegram();
const app = useAppStore();

onMounted(() => {
  app.fetchTasks();
});

async function openTask(task) {
  await app.completeTask(task);
  if (task.url.includes('t.me')) {
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
  background-color: inherit
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
