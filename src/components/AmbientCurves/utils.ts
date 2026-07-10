import { PerformanceTier, CurveSpec, RuntimeCurveSpec } from "./types"

export const randomBetween = (min: number, max: number): number => 
    min + Math.random() * (max - min) 

export function getPerformanceTier(): PerformanceTier {
  const tier = document.documentElement.dataset.performanceTier

  if (tier === 'low' || tier === 'high') {
    return tier
  }

  return 'high'
}

export function initializeRuntimeSpecs(
  curveSpecs: CurveSpec[],
  runtimeCurveSpecs: RuntimeCurveSpec[]
): void {
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
