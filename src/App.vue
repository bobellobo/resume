<template>
  <!--<AmbientCurves />-->
  <div class="app-foreground">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
//import AmbientCurves from './components/AmbientCurves/AmbientCurves.vue'
import { usePerformanceTier } from './composables/usePerformanceTier'

usePerformanceTier()
</script>


<style scoped>
.app-foreground {
  position: relative;
  z-index: 20;
}
</style>
