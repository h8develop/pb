<template>
  <main
    v-if="loaded"
    style="
      padding: 20px;
      margin-top: 30px;
      height: calc(100vh - 80px);
      height: calc(100vh - 80px); /* Adjust based on the height of TheMenu */
      overflow-y: auto; /* Enable vertical scrolling */
    "
  >
    <div class="">
      <RouterView />
    </div>
  </main>
  <TheMenu />
</template>

<script setup>
import { RouterView } from "vue-router";
import TheMenu from "./components/TheMenu.vue";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useTelegram } from "@/services/telegram";
import { useScoreStore } from "@/stores/score";
const scoreStore = useScoreStore();
scoreStore.loadUserData();

const loaded = ref(false);
const app = useAppStore();

const { tg } = useTelegram();

const urlParams = new URLSearchParams(window.location.search);

app.init(urlParams.get("ref")).then(() => {
  loaded.value = true;
});

onMounted(() => {
  tg.ready();

  tg.expand();
});
</script>
