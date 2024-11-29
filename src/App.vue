<template>
  <main
    v-if="loaded"
    style="
      padding: 20px;
      margin-top: 30px;
      scroll-behavior: smooth;
      overflow-x: hidden;
      height: calc(100vh - 100px); /* Adjust based on the height of TheMenu */
      overflow-y: auto; /* Enable vertical scrolling */
    "
  >
    <div class="" v-if="isMobile">
      <RouterView />
    </div>
    <div v-else class="text-white flex items-center min-h-96">
      <img src="@/assets/QR.png" alt="" />
    </div>
  </main>
  <TheMenu v-if="isMobile" />
</template>

<script setup>
import { useDeviceCheck } from "./composables/useDeviceCheck";
import { RouterView } from "vue-router";
import TheMenu from "./components/TheMenu.vue";
import { onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useTelegram } from "@/services/telegram";
import { useScoreStore } from "@/stores/score";

const { isMobile } = useDeviceCheck();
const scoreStore = useScoreStore();
scoreStore.loadUserData();

const loaded = ref(false);
const app = useAppStore();
const { tg } = useTelegram();

const urlParams = new URLSearchParams(window.location.search);
const refParam = urlParams.get("ref");
console.log(urlParams.get('ref'))

app.init(refParam !== 'unknown' ? refParam : null).then(() => {
  loaded.value = true;
});

onMounted(() => {
  tg.ready();
  tg.expand();
});
</script>
