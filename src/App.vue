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

// Smooth cursor-following spotlight via lerp-animated CSS custom properties
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let rafId: number | null = null
let isAnimating = false
const SPOTLIGHT_LERP = 0.45
const SPOTLIGHT_SNAP_DISTANCE = 0.4
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function stopSpotlightAnimation() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  isAnimating = false
}

function startSpotlightAnimation() {
  if (isAnimating) {
    return
  }
  isAnimating = true
  rafId = requestAnimationFrame(animateSpotlight)
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

function animateSpotlight() {
  currentX = lerp(currentX, targetX, SPOTLIGHT_LERP)
  currentY = lerp(currentY, targetY, SPOTLIGHT_LERP)

  // Snap to avoid residual lag and keep the cursor-follow effect crisp.
  if (Math.abs(targetX - currentX) < SPOTLIGHT_SNAP_DISTANCE) currentX = targetX
  if (Math.abs(targetY - currentY) < SPOTLIGHT_SNAP_DISTANCE) currentY = targetY

  document.documentElement.style.setProperty('--mx', `${currentX}px`)
  document.documentElement.style.setProperty('--my', `${currentY}px`)

  if (currentX === targetX && currentY === targetY) {
    stopSpotlightAnimation()
    return
  }

  rafId = requestAnimationFrame(animateSpotlight)
}

function onPointerMove(e: PointerEvent) {
  targetX = e.clientX
  targetY = e.clientY
  startSpotlightAnimation()
}

onMounted(() => {
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) {
    return
  }

  targetX = window.innerWidth / 2
  targetY = window.innerHeight / 2
  currentX = targetX
  currentY = targetY
  document.documentElement.style.setProperty('--mx', `${currentX}px`)
  document.documentElement.style.setProperty('--my', `${currentY}px`)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  startSpotlightAnimation()
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  stopSpotlightAnimation()
})
</script>

<style scoped>
.app-foreground {
  position: relative;
  z-index: 20;
}
</style>
