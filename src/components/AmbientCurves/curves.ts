import { CurveSpec } from "./types";

export const curveSpecs: CurveSpec[] = [
  {
    id: 1,
    className: 'ambient-curve-1',
    ratio: 0.22,
    phase: 0.1,
    waveStrength: 30,
    yBase: [-1320, 180, 760, 2340],
    xControl: [160, 230, 90, 180]
  },
  {
    id: 2,
    className: 'ambient-curve-2',
    ratio: 0.29,
    phase: 1.2,
    waveStrength: 38,
    yBase: [-1360, 240, 840, 2420],
    xControl: [860, 720, 560, 420]
  },
  {
    id: 3,
    className: 'ambient-curve-3',
    ratio: 0.35,
    phase: 2.1,
    waveStrength: 34,
    yBase: [-1280, 260, 820, 2380],
    xControl: [460, 610, 250, 380]
  },
  {
    id: 4,
    className: 'ambient-curve-4',
    ratio: 0.44,
    phase: 3.2,
    waveStrength: 42,
    yBase: [-1400, 140, 760, 2360],
    xControl: [1040, 820, 560, 320]
  },
  {
    id: 5,
    className: 'ambient-curve-5',
    ratio: 0.5,
    phase: 4.4,
    waveStrength: 36,
    yBase: [-1340, 200, 800, 2400],
    xControl: [720, 520, 880, 640]
  }
]