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
import { useAmbientCurves } from '../../composables/useAmbientCurves'
import { RuntimeCurveSpec } from './types'
import { curveSpecs } from './curves'

/**
 * Generates a static SVG path for a curve based on its specification
 * Applies sine/cosine transformations for natural wave patterns
 */
function buildStaticPath(spec: RuntimeCurveSpec): string {
  const y0 = spec.yBase[0] + Math.sin(spec.phase) * spec.waveStrength * 0.56
  const y1 = spec.yBase[1] + Math.cos(spec.phase * 1.22) * (spec.waveStrength * 0.44)
  const y2 = spec.yBase[2] + Math.sin(spec.phase * 0.92) * (spec.waveStrength * 0.36)
  const y3 = spec.yBase[3] + Math.cos(spec.phase * 1.08) * (spec.waveStrength * 0.32)

  const x1 = spec.xControl[1] + spec.pathJitter * 0.5 * spec.directionX
  const x2 = spec.xControl[2] + spec.pathJitter * 0.6 * spec.directionX

  return `M ${spec.xControl[0]} ${y0.toFixed(2)} C ${x1.toFixed(2)} ${y1.toFixed(2)}, ${x2.toFixed(2)} ${y2.toFixed(2)}, ${spec.xControl[3]} ${y3.toFixed(2)}`
}

const { curves } = useAmbientCurves(curveSpecs, buildStaticPath)
</script>

<style scoped src="./AmbientCurves.css"></style>