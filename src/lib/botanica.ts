import { round } from './random'

export type PetalShape = 'lanceolate' | 'cosmos' | 'round' | 'teardrop'

/**
 * Todas las formas crecen hacia arriba: base en (0,0), punta en (0,-length).
 * `width` es el ancho máximo del pétalo.
 */
export function petalPath(shape: PetalShape, length: number, width: number): string {
  const l = round(length)
  const w = round(width)

  switch (shape) {
    case 'lanceolate':
      return [
        'M0 0',
        `C${round(-w * 0.62)} ${round(-l * 0.22)} ${round(-w * 0.54)} ${round(-l * 0.64)} ${round(-w * 0.16)} ${round(-l * 0.88)}`,
        `C${round(-w * 0.08)} ${round(-l * 0.97)} ${round(w * 0.08)} ${round(-l * 0.97)} ${round(w * 0.16)} ${round(-l * 0.88)}`,
        `C${round(w * 0.54)} ${round(-l * 0.64)} ${round(w * 0.62)} ${round(-l * 0.22)} 0 0`,
        'Z',
      ].join(' ')

    case 'cosmos':
      return [
        'M0 0',
        `C${round(-w * 0.7)} ${round(-l * 0.28)} ${round(-w * 0.66)} ${round(-l * 0.74)} ${round(-w * 0.26)} ${round(-l * 0.95)}`,
        `L0 ${round(-l * 0.8)}`,
        `L${round(w * 0.26)} ${round(-l * 0.95)}`,
        `C${round(w * 0.66)} ${round(-l * 0.74)} ${round(w * 0.7)} ${round(-l * 0.28)} 0 0`,
        'Z',
      ].join(' ')

    case 'round':
      return [
        'M0 0',
        `C${round(-w * 0.78)} ${round(-l * 0.16)} ${round(-w * 0.74)} ${round(-l * 0.82)} ${round(-w * 0.2)} ${round(-l * 0.97)}`,
        `C${round(-w * 0.06)} ${round(-l * 1.01)} ${round(w * 0.06)} ${round(-l * 1.01)} ${round(w * 0.2)} ${round(-l * 0.97)}`,
        `C${round(w * 0.74)} ${round(-l * 0.82)} ${round(w * 0.78)} ${round(-l * 0.16)} 0 0`,
        'Z',
      ].join(' ')

    case 'teardrop':
      return [
        'M0 0',
        `C${round(-w * 0.72)} ${round(-l * 0.3)} ${round(-w * 0.5)} ${round(-l * 0.86)} 0 ${round(-l * 1.02)}`,
        `C${round(w * 0.5)} ${round(-l * 0.86)} ${round(w * 0.72)} ${round(-l * 0.3)} 0 0`,
        'Z',
      ].join(' ')
  }
}

/** Hoja apuntando hacia la derecha: base en (0,0), punta en (length,0). */
export function leafPath(length: number, width: number): string {
  const l = round(length)
  const w = round(width)
  return [
    'M0 0',
    `C${round(l * 0.16)} ${round(-w * 0.66)} ${round(l * 0.62)} ${round(-w * 0.78)} ${l} 0`,
    `C${round(l * 0.6)} ${round(w * 0.44)} ${round(l * 0.18)} ${round(w * 0.42)} 0 0`,
    'Z',
  ].join(' ')
}

export function leafVeinPath(length: number, width: number): string {
  const l = round(length)
  const w = round(width)
  return `M${round(l * 0.02)} ${round(-w * 0.02)} Q${round(l * 0.5)} ${round(-w * 0.16)} ${round(l * 0.96)} 0`
}

export function leafSideVeinPaths(length: number, width: number, count = 3): string[] {
  const veins: string[] = []
  for (let i = 1; i <= count; i += 1) {
    const t = i / (count + 1)
    const x = round(length * t * 0.74)
    const spread = round(width * 0.26 * (1 - Math.abs(t - 0.45)))
    veins.push(`M${x} ${round(-width * 0.05)} Q${round(x + length * 0.1)} ${round(-spread)} ${round(x + length * 0.14)} ${round(-spread * 1.05)}`)
    veins.push(`M${x} ${round(width * 0.02)} Q${round(x + length * 0.09)} ${round(spread * 0.6)} ${round(x + length * 0.12)} ${round(spread * 0.66)}`)
  }
  return veins
}

/** Borde de un tallo con curvatura natural, base en (0,0). */
export interface StemGeometry {
  path: string
  /** Punto sobre el tallo para u ∈ [0,1] (0 = base, 1 = punta). */
  pointAt: (u: number) => { x: number; y: number }
  topY: number
  tipAngle: number
}

type Point = { x: number; y: number }

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t
  const a = mt * mt * mt
  const b = 3 * mt * mt * t
  const c = 3 * mt * t * t
  const d = t * t * t
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  }
}

export function createStemGeometry(topY: number, sway: number, waist = 0.55): StemGeometry {
  const p0: Point = { x: 0, y: 0 }
  const p1: Point = { x: -sway * 0.7, y: topY * 0.24 }
  const p2: Point = { x: sway * 0.9, y: topY * 0.6 }
  const p3: Point = { x: -sway * 0.35 * waist, y: topY * 0.82 }
  const q1: Point = { x: -sway * 0.6 * waist, y: topY * 0.93 }
  const q2: Point = { x: sway * 0.25, y: topY * 0.97 }
  const q3: Point = { x: 0, y: topY }

  const path = [
    `M${round(p0.x)} ${round(p0.y)}`,
    `C${round(p1.x)} ${round(p1.y)} ${round(p2.x)} ${round(p2.y)} ${round(p3.x)} ${round(p3.y)}`,
    `C${round(q1.x)} ${round(q1.y)} ${round(q2.x)} ${round(q2.y)} ${round(q3.x)} ${round(q3.y)}`,
  ].join(' ')

  const split = 0.82

  return {
    path,
    topY,
    tipAngle: round((Math.atan2(q3.x - q2.x, -(q3.y - q2.y)) * 180) / Math.PI, 1),
    pointAt: (u: number) => {
      const clamped = Math.max(0, Math.min(1, u))
      if (clamped <= split) {
        return cubicPoint(p0, p1, p2, p3, clamped / split)
      }
      return cubicPoint(p3, q1, q2, q3, (clamped - split) / (1 - split))
    },
  }
}

export function bladePath(height: number, bend: number, width: number): string {
  const h = round(height)
  const b = round(bend)
  const w = round(width)
  return [
    'M0 0',
    `C${round(b * 0.4 - w)} ${round(-h * 0.36)} ${round(b * 0.8 - w * 0.5)} ${round(-h * 0.72)} ${b} ${-h}`,
    `C${round(b * 0.82 + w * 0.46)} ${round(-h * 0.7)} ${round(b * 0.44 + w)} ${round(-h * 0.34)} 0 0`,
    'Z',
  ].join(' ')
}
