import { onMounted, onUnmounted, ref } from 'vue'

type PerformanceTier = 'high' | 'low'

/**
 * Estimates a performance tier and manages it on the document root.
 * Uses only explicit user accessibility preferences (reduced motion,
 * reduced data) rather than device/hardware or input-type introspection.
 */
export function usePerformanceTier() {
  const performanceTier = ref<PerformanceTier>('high')

  function detectPerformanceTier(): PerformanceTier {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return 'low'
    }

    if (window.matchMedia('(prefers-reduced-data: reduce)').matches) {
      return 'low'
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
