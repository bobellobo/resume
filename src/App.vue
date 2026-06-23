<template>
  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { onMounted, onUnmounted } from 'vue'

// Smooth cursor-following spotlight via lerp-animated CSS custom properties
let targetX = 0
let targetY = 0
let currentX = 0
let currentY = 0
let rafId: number | null = null
const SPOTLIGHT_LERP = 0.45
const SPOTLIGHT_SNAP_DISTANCE = 0.4

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
  rafId = requestAnimationFrame(animateSpotlight)
}

function onPointerMove(e: PointerEvent) {
  targetX = e.clientX
  targetY = e.clientY
}

onMounted(() => {
  targetX = window.innerWidth / 2
  targetY = window.innerHeight / 2
  currentX = targetX
  currentY = targetY
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  rafId = requestAnimationFrame(animateSpotlight)
})

onUnmounted(() => {
  window.removeEventListener('pointermove', onPointerMove)
  if (rafId !== null) cancelAnimationFrame(rafId)
})
</script>
