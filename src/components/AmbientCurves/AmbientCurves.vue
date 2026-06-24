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

type PerformanceTier = 'high' | 'medium' | 'low'

type CurveSpec = {
  id: number
  className: string
  ratio: number
  phase: number
  waveStrength: number
  yBase: [number, number, number, number]
  xControl: [number, number, number, number]
}

type RuntimeCurveSpec = CurveSpec & {
  directionX: number
  directionY: number
  swayAmplitudeX: number
  swayAmplitudeY: number
  speedPrimary: number
  speedSecondary: number
  pathJitter: number
}

type CurveState = {
  id: number
  className: string
  path: string
  cssVars: {
    '--drift-x': string
    '--offset-y': string
  }
}

const curveSpecs: CurveSpec[] = [
  {
    id: 1,
    className: 'ambient-curve-1',
    ratio: 0.22,
    phase: 0.1,
    waveStrength: 30,
    yBase: [-220, 180, 760, 1240],
    xControl: [160, 230, 90, 180]
  },
  {
    id: 2,
    className: 'ambient-curve-2',
    ratio: 0.29,
    phase: 1.2,
    waveStrength: 38,
    yBase: [-260, 240, 840, 1320],
    xControl: [860, 720, 560, 420]
  },
  {
    id: 3,
    className: 'ambient-curve-3',
    ratio: 0.35,
    phase: 2.1,
    waveStrength: 34,
    yBase: [-180, 260, 820, 1280],
    xControl: [460, 610, 250, 380]
  },
  {
    id: 4,
    className: 'ambient-curve-4',
    ratio: 0.44,
    phase: 3.2,
    waveStrength: 42,
    yBase: [-300, 140, 760, 1260],
    xControl: [1040, 820, 560, 320]
  },
  {
    id: 5,
    className: 'ambient-curve-5',
    ratio: 0.5,
    phase: 4.4,
    waveStrength: 36,
    yBase: [-240, 200, 800, 1300],
    xControl: [720, 520, 880, 640]
  }
]

const runtimeCurveSpecs: RuntimeCurveSpec[] = []

const curves = reactive<CurveState[]>(
  curveSpecs.map((curveSpec) => ({
    id: curveSpec.id,
    className: curveSpec.className,
    path: '',
    cssVars: {
      '--drift-x': '0px',
      '--offset-y': '0px'
    }
  }))
)

let latestScrollY = 0
let smoothedScrollY = 0
let frameId: number | null = null
let firstFrameTs = 0
let activeCurveCount = curveSpecs.length
let maxParallaxOffset = 420
let reducedMotionMedia: MediaQueryList | null = null
let tierObserver: MutationObserver | null = null
let currentTier: PerformanceTier = 'high'
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const SCROLL_CONTRIBUTION_FACTOR = 1.18

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function initializeRuntimeSpecs() {
  runtimeCurveSpecs.length = 0

  for (let index = 0; index < curveSpecs.length; index += 1) {
    const spec = curveSpecs[index]
    const runtimeSpec: RuntimeCurveSpec = {
      ...spec,
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
      swayAmplitudeX: randomBetween(14, 40),
      swayAmplitudeY: randomBetween(12, 34),
      speedPrimary: randomBetween(0.35, 0.9),
      speedSecondary: randomBetween(0.5, 1.35),
      pathJitter: randomBetween(10, 34)
    }

    runtimeCurveSpecs.push(runtimeSpec)
    curves[index].path = buildStaticPath(runtimeSpec)
  }
}

function buildStaticPath(spec: RuntimeCurveSpec): string {
  const y0 = spec.yBase[0] + (Math.sin(spec.phase) * spec.waveStrength * 0.56)
  const y1 = spec.yBase[1] + (Math.cos(spec.phase * 1.22) * (spec.waveStrength * 0.44))
  const y2 = spec.yBase[2] + (Math.sin(spec.phase * 0.92) * (spec.waveStrength * 0.36))
  const y3 = spec.yBase[3] + (Math.cos(spec.phase * 1.08) * (spec.waveStrength * 0.32))

  const x1 = spec.xControl[1] + (spec.pathJitter * 0.5 * spec.directionX)
  const x2 = spec.xControl[2] + (spec.pathJitter * 0.6 * spec.directionX)

  // Start each curve far above the viewport so the top endpoint never enters view.
  const leadStartX = spec.xControl[0] - (spec.pathJitter * 0.9 * spec.directionX)
  const leadStartY = y0 - (980 + spec.waveStrength * 2.2)
  const leadCtrl1X = spec.xControl[0] - (spec.pathJitter * 1.15 * spec.directionX)
  const leadCtrl1Y = y0 - (560 + spec.waveStrength * 1.8)
  const leadCtrl2X = spec.xControl[0] - (spec.pathJitter * 0.65 * spec.directionX)
  const leadCtrl2Y = y0 - (240 + spec.waveStrength * 1.25)

  // Extend each curve well below the viewport so bottom endpoints stay hidden during scroll/parallax.
  const extensionCtrl1X = spec.xControl[3] + (spec.pathJitter * 0.7 * spec.directionX)
  const extensionCtrl1Y = y3 + (220 + spec.waveStrength * 1.2)
  const extensionCtrl2X = spec.xControl[3] + (spec.pathJitter * 1.25 * spec.directionX)
  const extensionCtrl2Y = y3 + (560 + spec.waveStrength * 1.8)
  const extensionEndX = spec.xControl[3] + (spec.pathJitter * 0.85 * spec.directionX)
  const extensionEndY = y3 + (1050 + spec.waveStrength * 2.6)

  return `M ${leadStartX.toFixed(2)} ${leadStartY.toFixed(2)} C ${leadCtrl1X.toFixed(2)} ${leadCtrl1Y.toFixed(2)}, ${leadCtrl2X.toFixed(2)} ${leadCtrl2Y.toFixed(2)}, ${spec.xControl[0]} ${y0.toFixed(2)} C ${x1.toFixed(2)} ${y1.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}, ${spec.xControl[3]} ${y3.toFixed(2)} C ${extensionCtrl1X.toFixed(2)} ${extensionCtrl1Y.toFixed(2)}, ${extensionCtrl2X.toFixed(2)} ${extensionCtrl2Y.toFixed(2)}, ${extensionEndX.toFixed(2)} ${extensionEndY.toFixed(2)}`
}

function getPerformanceTier(): PerformanceTier {
  const tier = document.documentElement.dataset.performanceTier

  if (tier === 'low' || tier === 'medium' || tier === 'high') {
    return tier
  }

  return 'high'
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
    smoothedScrollY += (latestScrollY - smoothedScrollY) * 0.12
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
  initializeRuntimeSpecs()
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