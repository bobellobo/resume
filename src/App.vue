<template>
  <AmbientCurves />
  <div class="app-foreground">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'
import AmbientCurves from './components/AmbientCurves/AmbientCurves.vue'

type PerformanceTier = 'high' | 'medium' | 'low'

type ExtendedNavigator = Navigator & {
  deviceMemory?: number
  connection?: {
    saveData?: boolean
  }
}

function getPerformanceTier(): PerformanceTier {
  const nav = navigator as ExtendedNavigator
  const hardwareThreads = navigator.hardwareConcurrency || 8
  const deviceMemory = nav.deviceMemory ?? 8
  const saveDataEnabled = nav.connection?.saveData === true

  if (saveDataEnabled || hardwareThreads <= 4 || deviceMemory <= 4) {
    return 'low'
  }

  if (hardwareThreads <= 6 || deviceMemory <= 6) {
    return 'medium'
  }

  return 'high'
}

onMounted(() => {
  document.documentElement.dataset.performanceTier = getPerformanceTier()
})

onUnmounted(() => {
  if (document.documentElement.dataset.performanceTier) {
    delete document.documentElement.dataset.performanceTier
  }
})
</script>


<style scoped>
.app-foreground {
  position: relative;
  z-index: 20;
}
</style>
