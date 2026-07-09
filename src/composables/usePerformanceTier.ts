import { onMounted, onUnmounted, ref } from 'vue'

type PerformanceTier = 'high' | 'medium' | 'low'

/**
 * Estimates a performance tier and manages it on the document root.
 * Uses only standard media-query preference signals (reduced motion,
 * reduced data, coarse pointer) rather than device/hardware introspection.
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

    if (window.matchMedia('(pointer: coarse)').matches) {
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
