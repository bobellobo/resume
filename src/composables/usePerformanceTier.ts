import { onMounted, onUnmounted, ref } from 'vue'

type PerformanceTier = 'high' | 'medium' | 'low'

type ExtendedNavigator = Navigator & {
  deviceMemory?: number
  connection?: {
    saveData?: boolean
  }
}

/**
 * Detects device performance capabilities and manages performance tier
 * Considers hardware threads, device memory, and data saver mode
 */
export function usePerformanceTier() {
  const performanceTier = ref<PerformanceTier>('high')

  function detectPerformanceTier(): PerformanceTier {
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

  function applyPerformanceTier(tier: PerformanceTier) {
    document.documentElement.dataset.performanceTier = tier
    performanceTier.value = tier
  }

  function initialize() {
    const tier = detectPerformanceTier()
    applyPerformanceTier(tier)
  }

  function cleanup() {
    if (document.documentElement.dataset.performanceTier) {
      delete document.documentElement.dataset.performanceTier
    }
  }

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    performanceTier
  }
}
