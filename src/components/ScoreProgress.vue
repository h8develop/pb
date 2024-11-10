<template>
  <div class="progress">
    <h4 class="progress-score">
    </h4>
  </div>
</template>

<script setup>
import { useScoreStore } from '@/stores/score'

const store = useScoreStore()
</script>
