<template>
  <div class="ambient-curves" aria-hidden="true">
    <svg class="ambient-curves-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ambient-gradient-1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--ambient-curve-1-start)" />
          <stop offset="100%" stop-color="var(--ambient-curve-1-end)" />
        </linearGradient>
        <linearGradient id="ambient-gradient-2" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stop-color="var(--ambient-curve-2-start)" />
          <stop offset="100%" stop-color="var(--ambient-curve-2-end)" />
        </linearGradient>
        <linearGradient id="ambient-gradient-3" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="var(--ambient-curve-3-start)" />
          <stop offset="100%" stop-color="var(--ambient-curve-3-end)" />
        </linearGradient>
        <linearGradient id="ambient-gradient-4" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stop-color="var(--ambient-curve-4-start)" />
          <stop offset="100%" stop-color="var(--ambient-curve-4-end)" />
        </linearGradient>
        <linearGradient id="ambient-gradient-5" x1="15%" y1="100%" x2="85%" y2="0%">
          <stop offset="0%" stop-color="var(--ambient-curve-5-start)" />
          <stop offset="100%" stop-color="var(--ambient-curve-5-end)" />
        </linearGradient>
      </defs>

      <path
        v-for="curve in curves"
        :key="curve.id"
        class="ambient-curve"
        :class="curve.className"
        :d="curve.path"
        :style="curve.cssVars"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">

import { onMounted, onUnmounted, reactive } from 'vue'
import { RuntimeCurveSpec, CurveState, PerformanceTier } from './types'
import { getPerformanceTier, initializeRuntimeSpecs } from './utils'
import { curveSpecs } from './curves'



const runtimeCurveSpecs: RuntimeCurveSpec[] = []

const curves = reactive<CurveState[]>(
  curveSpecs.map(({ id, className }) => ({
    id,
    className,
    path: '',
    cssVars: {
      '--drift-x': '0px',
      '--offset-y': '0px'
    }
  }))
);

let latestScrollY = 0;
let smoothedScrollY = 0;
let frameId: number | null = null;
let firstFrameTs = 0;
let activeCurveCount = curveSpecs.length;
let maxParallaxOffset = 420;
let reducedMotionMedia: MediaQueryList | null = null;
let tierObserver: MutationObserver | null = null;
let currentTier: PerformanceTier = 'high';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const SCROLL_CONTRIBUTION_FACTOR = 1.18;
const SCROLL_SMOOTHING_FACTOR = 0.22;





function buildStaticPath(spec: RuntimeCurveSpec): string {
  const y0 = spec.yBase[0] + (Math.sin(spec.phase) * spec.waveStrength * 0.56)
  const y1 = spec.yBase[1] + (Math.cos(spec.phase * 1.22) * (spec.waveStrength * 0.44))
  const y2 = spec.yBase[2] + (Math.sin(spec.phase * 0.92) * (spec.waveStrength * 0.36))
  const y3 = spec.yBase[3] + (Math.cos(spec.phase * 1.08) * (spec.waveStrength * 0.32))

  const x1 = spec.xControl[1] + (spec.pathJitter * 0.5 * spec.directionX)
  const x2 = spec.xControl[2] + (spec.pathJitter * 0.6 * spec.directionX)

  return `M ${spec.xControl[0]} ${y0.toFixed(2)} C ${x1.toFixed(2)} ${y1.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}, ${spec.xControl[3]} ${y3.toFixed(2)}`
}

function onScroll() {
  latestScrollY = window.scrollY || window.pageYOffset || 0
}

function onResize() {
  latestScrollY = window.scrollY || window.pageYOffset || 0
  maxParallaxOffset = Math.max(320, window.innerHeight * 0.55)
}

function onReducedMotionChanged() {
  firstFrameTs = 0
}

function refreshQualityProfile() {
  const tier = currentTier

  if (tier === 'low') {
    activeCurveCount = 3
    return
  }

  if (tier === 'medium') {
    activeCurveCount = 4
    return
  }

  activeCurveCount = curveSpecs.length
}

function handlePerformanceTierChange() {
  const nextTier = getPerformanceTier()

  if (nextTier === currentTier) {
    return
  }

  currentTier = nextTier
  refreshQualityProfile()
}

function updateCurves(frameTs: number) {
  if (firstFrameTs === 0) {
    firstFrameTs = frameTs
  }

  const isReducedMotion = reducedMotionMedia?.matches ?? false
  const elapsed = (frameTs - firstFrameTs) / 1000

  if (isReducedMotion) {
    smoothedScrollY = 0
  } else {
    smoothedScrollY += (latestScrollY - smoothedScrollY) * SCROLL_SMOOTHING_FACTOR
  }

  const activeScrollY = isReducedMotion ? 0 : smoothedScrollY * SCROLL_CONTRIBUTION_FACTOR

  for (let index = 0; index < runtimeCurveSpecs.length; index += 1) {
    const spec = runtimeCurveSpecs[index]
    const curveState = curves[index]

    if (index >= activeCurveCount) {
      curveState.path = ''
      curveState.cssVars['--drift-x'] = '0px'
      curveState.cssVars['--offset-y'] = '0px'
      continue
    }

    const driftX = (
      Math.sin(elapsed * spec.speedPrimary + spec.phase) * spec.swayAmplitudeX * spec.directionX
      + Math.cos(activeScrollY / 190 + spec.phase) * (spec.swayAmplitudeX * 0.42)
    )

    const driftY = (
      Math.cos(elapsed * spec.speedSecondary + spec.phase) * spec.swayAmplitudeY * spec.directionY
      + Math.sin(activeScrollY / 160 + spec.phase) * (spec.swayAmplitudeY * 0.38)
    )

    const rawParallaxY = activeScrollY * spec.ratio * spec.directionY
    const parallaxY = Math.max(-maxParallaxOffset, Math.min(maxParallaxOffset, rawParallaxY))
    if (curveState.path.length === 0) {
      curveState.path = buildStaticPath(spec)
    }

    curveState.cssVars['--drift-x'] = `${driftX.toFixed(2)}px`
    curveState.cssVars['--offset-y'] = `${(parallaxY + driftY).toFixed(2)}px`
  }

  frameId = requestAnimationFrame(updateCurves)
}



function onVisibilityChanged() {
  if (document.hidden) {
    if (frameId !== null) {
      cancelAnimationFrame(frameId)
      frameId = null
    }

    return
  }

  firstFrameTs = 0

  if (frameId === null) {
    frameId = requestAnimationFrame(updateCurves)
  }
}

onMounted(() => {
  initializeRuntimeSpecs(curveSpecs, runtimeCurveSpecs)
  currentTier = getPerformanceTier()
  refreshQualityProfile()
  tierObserver = new MutationObserver(handlePerformanceTierChange)
  tierObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-performance-tier']
  })
  reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY)
  latestScrollY = window.scrollY || window.pageYOffset || 0
  smoothedScrollY = latestScrollY
  maxParallaxOffset = Math.max(320, window.innerHeight * 0.55)

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  document.addEventListener('visibilitychange', onVisibilityChanged)
  reducedMotionMedia.addEventListener('change', onReducedMotionChanged)
  frameId = requestAnimationFrame(updateCurves)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibilityChanged)

  if (reducedMotionMedia) {
    reducedMotionMedia.removeEventListener('change', onReducedMotionChanged)
  }

  if (tierObserver) {
    tierObserver.disconnect()
    tierObserver = null
  }

  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
})
</script>

<style scoped src="./AmbientCurves.css"></style>