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
        :style="{ transform: curve.transform }"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, reactive } from 'vue'

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
  transform: string
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
    transform: 'translate3d(0px, 0px, 0)'
  }))
)

let latestScrollY = 0
let smoothedScrollY = 0
let frameId: number | null = null
let firstFrameTs = 0
let reducedMotionMedia: MediaQueryList | null = null
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min)
}

function initializeRuntimeSpecs() {
  runtimeCurveSpecs.length = 0

  for (const spec of curveSpecs) {
    runtimeCurveSpecs.push({
      ...spec,
      directionX: Math.random() > 0.5 ? 1 : -1,
      directionY: Math.random() > 0.5 ? 1 : -1,
      swayAmplitudeX: randomBetween(14, 40),
      swayAmplitudeY: randomBetween(12, 34),
      speedPrimary: randomBetween(0.35, 0.9),
      speedSecondary: randomBetween(0.5, 1.35),
      pathJitter: randomBetween(10, 34)
    })
  }
}

function buildPath(spec: RuntimeCurveSpec, scrollY: number, elapsed: number): string {
  const flowA = scrollY / 170
  const flowB = scrollY / 260

  const harmonicA = Math.sin(elapsed * spec.speedPrimary + spec.phase)
  const harmonicB = Math.cos(elapsed * spec.speedSecondary + spec.phase)
  const harmonicC = Math.sin(elapsed * (spec.speedPrimary + spec.speedSecondary) * 0.5 + spec.phase)

  const y0 = spec.yBase[0] + (Math.sin(flowA + spec.phase) * spec.waveStrength) + (harmonicA * spec.pathJitter)
  const y1 = spec.yBase[1] + (Math.cos(flowA * 1.22 + spec.phase) * (spec.waveStrength * 0.82)) + (harmonicB * spec.pathJitter * 0.88)
  const y2 = spec.yBase[2] + (Math.sin(flowA * 0.92 + flowB + spec.phase) * (spec.waveStrength * 0.74)) + (harmonicC * spec.pathJitter * 0.72)
  const y3 = spec.yBase[3] + (Math.cos(flowA * 1.08 + spec.phase) * (spec.waveStrength * 0.64)) + (harmonicA * spec.pathJitter * 0.56)

  const x1 = spec.xControl[1] + harmonicB * spec.pathJitter * spec.directionX
  const x2 = spec.xControl[2] + harmonicC * spec.pathJitter * 1.2 * spec.directionX

  return `M ${spec.xControl[0]} ${y0.toFixed(2)} C ${x1.toFixed(2)} ${y1.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}, ${spec.xControl[3]} ${y3.toFixed(2)}`
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

  const activeScrollY = isReducedMotion ? 0 : smoothedScrollY

  for (let index = 0; index < runtimeCurveSpecs.length; index += 1) {
    const spec = runtimeCurveSpecs[index]
    const curveState = curves[index]

    const driftX = (
      Math.sin(elapsed * spec.speedPrimary + spec.phase) * spec.swayAmplitudeX * spec.directionX
      + Math.cos(activeScrollY / 190 + spec.phase) * (spec.swayAmplitudeX * 0.42)
    )

    const driftY = (
      Math.cos(elapsed * spec.speedSecondary + spec.phase) * spec.swayAmplitudeY * spec.directionY
      + Math.sin(activeScrollY / 160 + spec.phase) * (spec.swayAmplitudeY * 0.38)
    )

    const parallaxY = activeScrollY * spec.ratio * spec.directionY
    curveState.path = buildPath(spec, activeScrollY, elapsed)
    curveState.transform = `translate3d(${driftX.toFixed(2)}px, ${(parallaxY + driftY).toFixed(2)}px, 0)`
  }

  frameId = requestAnimationFrame(updateCurves)
}

function onScroll() {
  latestScrollY = window.scrollY || window.pageYOffset || 0
}

function onResize() {
  latestScrollY = window.scrollY || window.pageYOffset || 0
}

function onReducedMotionChanged() {
  firstFrameTs = 0
}

onMounted(() => {
  initializeRuntimeSpecs()
  reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY)
  latestScrollY = window.scrollY || window.pageYOffset || 0
  smoothedScrollY = latestScrollY

  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('resize', onResize, { passive: true })
  reducedMotionMedia.addEventListener('change', onReducedMotionChanged)
  frameId = requestAnimationFrame(updateCurves)
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('resize', onResize)

  if (reducedMotionMedia) {
    reducedMotionMedia.removeEventListener('change', onReducedMotionChanged)
  }

  if (frameId !== null) {
    cancelAnimationFrame(frameId)
    frameId = null
  }
})
</script>

<style scoped>
.ambient-curves {
  position: fixed;
  inset: -12vh -12vw;
  z-index: 10;
  pointer-events: none;
  overflow: hidden;
  isolation: isolate;
  --ambient-curve-1-start: #00e5ff;
  --ambient-curve-1-end: #49f0ff;
  --ambient-curve-2-start: #97ff00;
  --ambient-curve-2-end: #c6ff31;
  --ambient-curve-3-start: #9400ff;
  --ambient-curve-3-end: #7ac8ff;
  --ambient-curve-4-start: #31a8ff;
  --ambient-curve-4-end: #00ffd0;
  --ambient-curve-5-start: #2ef8ff;
  --ambient-curve-5-end: #8bff73;
}

:global([data-theme='dark']) .ambient-curves {
  --ambient-curve-1-start: #ff0fb3;
  --ambient-curve-1-end: #ff5ad9;
  --ambient-curve-2-start: #ff4db8;
  --ambient-curve-2-end: #ff8cb1;
  --ambient-curve-3-start: #7d2cff;
  --ambient-curve-3-end: #bf64ff;
  --ambient-curve-4-start: #ff8a2a;
  --ambient-curve-4-end: #ff6f1f;
  --ambient-curve-5-start: #ff2cab;
  --ambient-curve-5-end: #7a2cff;
}

.ambient-curves-svg {
  width: 100%;
  height: 100%;
  overflow: visible;
}

.ambient-curve {
  fill: none;
  stroke-linecap: round;
  stroke-linejoin: round;
  opacity: 0.84;
  will-change: transform, d;
  mix-blend-mode: normal;
}

.ambient-curve-1 {
  stroke: url(#ambient-gradient-1);
  stroke-width: 10px;
  filter: blur(26px) saturate(1.06);
}

.ambient-curve-2 {
  stroke: url(#ambient-gradient-2);
  stroke-width: 12px;
  filter: blur(28px) saturate(1.08);
}

.ambient-curve-3 {
  stroke: url(#ambient-gradient-3);
  stroke-width: 9px;
  filter: blur(22px) saturate(1.08);
}

.ambient-curve-4 {
  stroke: url(#ambient-gradient-4);
  stroke-width: 11px;
  filter: blur(30px) saturate(1.1);
}

.ambient-curve-5 {
  stroke: url(#ambient-gradient-5);
  stroke-width: 8px;
  filter: blur(18px) saturate(1.05);
}

@media (prefers-reduced-motion: reduce) {
  .ambient-curve {
    will-change: auto;
  }
}

@media print {
  .ambient-curves {
    display: none;
  }
}
</style>