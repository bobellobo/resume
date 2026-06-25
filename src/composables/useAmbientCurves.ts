import { onMounted, onUnmounted, reactive } from 'vue'
import { RuntimeCurveSpec, CurveState } from '../components/AmbientCurves/types'

type PerformanceTierType = 'high' | 'medium' | 'low'

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'
const SCROLL_CONTRIBUTION_FACTOR = 1.18
const SCROLL_SMOOTHING_FACTOR = 0.22

/**
 * Manages ambient curve animation lifecycle and state
 * Handles performance optimization, scroll tracking, and animation frames
 */
export function useAmbientCurves(
  curveSpecs: Array<{ id: number; className: string }>,
  buildStaticPath: (spec: RuntimeCurveSpec) => string
) {
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
  )

  const runtimeCurveSpecs: RuntimeCurveSpec[] = []

  // State tracking
  let latestScrollY = 0
  let smoothedScrollY = 0
  let frameId: number | null = null
  let firstFrameTs = 0
  let activeCurveCount = curveSpecs.length
  let maxParallaxOffset = 420
  let reducedMotionMedia: MediaQueryList | null = null
  let tierObserver: MutationObserver | null = null
  let currentTier: PerformanceTierType = 'high'

  function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min)
  }

  function initializeRuntimeSpecs() {
    runtimeCurveSpecs.length = 0

    for (const spec of curveSpecs as RuntimeCurveSpec[]) {
      runtimeCurveSpecs.push({
        ...spec,
        directionX: Math.random() > 0.5 ? 1 : -1,
        directionY: Math.random() > 0.5 ? 1 : -1,
        swayAmplitudeX: randomBetween(14, 40),
        swayAmplitudeY: randomBetween(12, 34),
        speedPrimary: randomBetween(0.35, 0.9),
        speedSecondary: randomBetween(0.5, 1.35),
        pathJitter: randomBetween(10, 34),
        ratio: (spec as RuntimeCurveSpec).ratio || 0.5,
        phase: (spec as RuntimeCurveSpec).phase || 0,
        waveStrength: (spec as RuntimeCurveSpec).waveStrength || 50,
        yBase: (spec as RuntimeCurveSpec).yBase || [0, 0, 0, 0],
        xControl: (spec as RuntimeCurveSpec).xControl || [0, 0, 0, 0]
      })
    }
  }

  function getPerformanceTier(): PerformanceTierType {
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

      const driftX =
        Math.sin(elapsed * spec.speedPrimary + spec.phase) *
          spec.swayAmplitudeX *
          spec.directionX +
        Math.cos(activeScrollY / 190 + spec.phase) * (spec.swayAmplitudeX * 0.42)

      const driftY =
        Math.cos(elapsed * spec.speedSecondary + spec.phase) *
          spec.swayAmplitudeY *
          spec.directionY +
        Math.sin(activeScrollY / 160 + spec.phase) * (spec.swayAmplitudeY * 0.38)

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

  function initialize() {
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
  }

  function cleanup() {
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
  }

  onMounted(() => {
    initialize()
  })

  onUnmounted(() => {
    cleanup()
  })

  return {
    curves
  }
}
