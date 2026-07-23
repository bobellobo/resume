<template>
  <AmbientGlow />
  <div class="app-foreground">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import AmbientGlow from './components/AmbientGlow/AmbientGlow.vue';
</script>


<style scoped>
.app-foreground {
  position: relative;
  z-index: 20;
}
</style>
