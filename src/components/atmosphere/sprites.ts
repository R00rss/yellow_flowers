export type PetalTone = 'gold' | 'amber'
export type PetalShape = 'obovate' | 'pointed'

export interface AtmosphereSprites {
  petals: HTMLCanvasElement[][]
  pollen: HTMLCanvasElement
}

export const PETAL_SHAPES: PetalShape[] = ['obovate', 'pointed']
export const PETAL_TONES: PetalTone[] = ['gold', 'amber']
export const PETAL_BLUR_STEPS = [0, 1.5, 3.2]

const PETAL_SPRITE = { width: 96, height: 164 }
const POLLEN_SPRITE = 40

function makeCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.ceil(width))
  canvas.height = Math.max(1, Math.ceil(height))
  return canvas
}

function petalPath(shape: PetalShape, width: number, height: number): Path2D {
  const path = new Path2D()
  const cx = width / 2
  const baseY = height * 0.985
  const tipY = height * 0.015

  path.moveTo(cx, baseY)

  if (shape === 'obovate') {
    path.bezierCurveTo(cx - width * 0.6, height * 0.74, cx - width * 0.54, height * 0.18, cx, tipY)
    path.bezierCurveTo(cx + width * 0.54, height * 0.18, cx + width * 0.6, height * 0.74, cx, baseY)
  } else {
    path.bezierCurveTo(cx - width * 0.5, height * 0.6, cx - width * 0.42, height * 0.16, cx - width * 0.07, tipY)
    path.lineTo(cx, height * 0.2)
    path.lineTo(cx + width * 0.07, tipY)
    path.bezierCurveTo(cx + width * 0.42, height * 0.16, cx + width * 0.5, height * 0.6, cx, baseY)
  }

  path.closePath()
  return path
}

function drawPetal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tone: PetalTone,
  shape: PetalShape,
): void {
  const cx = width / 2
  const base = tone === 'gold' ? '#cf8f1c' : '#ac7414'
  const middle = tone === 'gold' ? '#eeb93a' : '#cf9520'
  const tip = tone === 'gold' ? '#f6e0a0' : '#e8c877'

  const gradient = ctx.createLinearGradient(cx - width * 0.16, height, cx + width * 0.2, 0)
  gradient.addColorStop(0, base)
  gradient.addColorStop(0.44, middle)
  gradient.addColorStop(0.84, tip)
  gradient.addColorStop(1, '#f9eecb')

  const path = petalPath(shape, width, height)

  ctx.save()
  ctx.globalAlpha = 0.97
  ctx.fillStyle = gradient
  ctx.fill(path)

  ctx.globalCompositeOperation = 'source-atop'
  const sheen = ctx.createLinearGradient(cx - width * 0.46, height * 0.22, cx + width * 0.36, height * 0.9)
  sheen.addColorStop(0, 'rgba(255, 250, 232, 0.26)')
  sheen.addColorStop(0.42, 'rgba(255, 244, 214, 0.04)')
  sheen.addColorStop(1, 'rgba(108, 70, 10, 0.3)')
  ctx.fillStyle = sheen
  ctx.fill(path)

  const vein = ctx.createLinearGradient(cx, height * 0.95, cx, height * 0.05)
  vein.addColorStop(0, 'rgba(108, 70, 10, 0.42)')
  vein.addColorStop(1, 'rgba(255, 248, 231, 0.3)')
  ctx.strokeStyle = vein
  ctx.lineWidth = Math.max(1, width * 0.018)
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(cx, height * 0.93)
  ctx.lineTo(cx, height * 0.1)
  ctx.stroke()

  ctx.restore()
}

/* Blur real cuando el navegador lo soporta; si no, desenfoque por reescalado. */
function compositeWithBlur(
  target: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  blur: number,
): void {
  const supportsFilter = typeof target.filter === 'string'
  if (!supportsFilter) {
    const small = makeCanvas(source.width / 5, source.height / 5)
    const smallCtx = small.getContext('2d')
    if (!smallCtx) return
    smallCtx.imageSmoothingEnabled = true
    smallCtx.drawImage(source, 0, 0, small.width, small.height)
    target.imageSmoothingEnabled = true
    target.imageSmoothingQuality = 'high'
    target.drawImage(small, 0, 0, source.width, source.height)
    return
  }

  target.filter = `blur(${blur}px)`
  target.drawImage(source, 0, 0)
  target.filter = 'none'
}

function createPetalSprite(
  tone: PetalTone,
  shape: PetalShape,
  blur: number,
  dpr: number,
): HTMLCanvasElement {
  const padding = Math.ceil(blur * 2 + 2)
  const width = Math.ceil((PETAL_SPRITE.width + padding * 2) * dpr)
  const height = Math.ceil((PETAL_SPRITE.height + padding * 2) * dpr)

  const logical = makeCanvas(width, height)
  const logicalCtx = logical.getContext('2d')
  if (!logicalCtx) return logical

  logicalCtx.scale(dpr, dpr)
  logicalCtx.translate(padding, padding)
  drawPetal(logicalCtx, PETAL_SPRITE.width, PETAL_SPRITE.height, tone, shape)

  if (blur <= 0) return logical

  const blurred = makeCanvas(width, height)
  const blurredCtx = blurred.getContext('2d')
  if (!blurredCtx) return logical
  compositeWithBlur(blurredCtx, logical, blur * dpr)
  return blurred
}

function createPollenSprite(dpr: number): HTMLCanvasElement {
  const size = Math.ceil(POLLEN_SPRITE * dpr)
  const canvas = makeCanvas(size, size)
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const center = size / 2
  const gradient = ctx.createRadialGradient(center, center, 0, center, center, center)
  gradient.addColorStop(0, 'rgba(255, 252, 240, 1)')
  gradient.addColorStop(0.14, 'rgba(252, 231, 160, 0.78)')
  gradient.addColorStop(0.34, 'rgba(233, 183, 60, 0.2)')
  gradient.addColorStop(1, 'rgba(233, 183, 60, 0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)
  return canvas
}

export function petalSpritePad(blur: number): number {
  return Math.ceil(blur * 2 + 2)
}

export const PETAL_SPRITE_SIZE = PETAL_SPRITE

export function createAtmosphereSprites(dpr: number): AtmosphereSprites {
  const petals = PETAL_TONES.map((tone) =>
    PETAL_BLUR_STEPS.map((blur, blurIndex) =>
      createPetalSprite(tone, PETAL_SHAPES[blurIndex % PETAL_SHAPES.length], blur, dpr),
    ),
  )

  return { petals, pollen: createPollenSprite(dpr) }
}
