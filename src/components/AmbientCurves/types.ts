export type PerformanceTier = 'high' | 'medium' | 'low'

export type CurveSpec = {
  id: number
  className: string
  ratio: number
  phase: number
  waveStrength: number
  yBase: [number, number, number, number]
  xControl: [number, number, number, number]
}

export type RuntimeCurveSpec = CurveSpec & {
  directionX: number
  directionY: number
  swayAmplitudeX: number
  swayAmplitudeY: number
  speedPrimary: number
  speedSecondary: number
  pathJitter: number
}

export type CurveState = {
  id: number
  className: string
  path: string
  cssVars: {
    '--drift-x': string
    '--offset-y': string
  }
}