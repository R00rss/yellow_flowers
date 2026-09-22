import { useEffect, useRef } from 'react'
import type { AtmosphereSpec } from '../../config/gardenLayout'
import { gsap } from '../../lib/gsap'
import { createRandom } from '../../lib/random'
import {
  createAtmosphereSprites,
  PETAL_BLUR_STEPS,
  PETAL_SPRITE_SIZE,
  petalSpritePad,
  type AtmosphereSprites,
} from './sprites'
import type { PetalDirector, PetalPhase } from './types'
import './atmosphere.css'

const MAX_PETALS = 40
const MAX_POLLEN = 90
const CENTER = { x: 0.5, y: 0.46 }

interface PetalParticle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  size: number
  rot: number
  rotSpeed: number
  swayPhase: number
  swayFreqA: number
  swayFreqB: number
  swayAmp: number
  alpha: number
  targetAlpha: number
  tone: number
  blur: number
  captured: number
}

interface PollenParticle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  radius: number
  phase: number
  speed: number
  alpha: number
}

function createPetal(random: () => number, width: number, height: number, scale: number): PetalParticle {
  const z = random()
  const size = (13 + z * 74) * scale
  return {
    x: random() * width,
    y: random() * height,
    z,
    vx: 0,
    vy: 6 + random() * 16,
    size,
    rot: random() * 360,
    rotSpeed: (random() - 0.5) * (14 + z * 40),
    swayPhase: random() * Math.PI * 2,
    swayFreqA: 0.16 + random() * 0.34,
    swayFreqB: 0.5 + random() * 0.9,
    swayAmp: 8 + random() * 26,
    alpha: 0,
    targetAlpha: 0,
    tone: random() > 0.42 ? 0 : 1,
    blur: z < 0.46 ? 0 : z < 0.78 ? 1 : 2,
    captured: 0,
  }
}

function createPollen(random: () => number, width: number, height: number): PollenParticle {
  const z = random()
  return {
    x: random() * width,
    y: random() * height,
    z,
    vx: 0,
    vy: -(2 + random() * 9),
    radius: 0.8 + z * 2,
    phase: random() * Math.PI * 2,
    speed: 0.4 + random() * 1.1,
    alpha: 0,
  }
}

interface FloatingPetalsProps {
  atmosphere: AtmosphereSpec
  reducedMotion: boolean
  onReady?: (director: PetalDirector) => void
}

export function FloatingPetals({ atmosphere, reducedMotion, onReady }: FloatingPetalsProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const atmosphereRef = useRef(atmosphere)
  const reducedRef = useRef(reducedMotion)
  const readyRef = useRef(onReady)

  useEffect(() => {
    atmosphereRef.current = atmosphere
    reducedRef.current = reducedMotion
    readyRef.current = onReady
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return

    const container = canvas.parentElement ?? canvas
    const random = createRandom(20260921)

    let width = container.clientWidth || window.innerWidth
    let height = container.clientHeight || window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 820 ? 1.6 : 2)
    let sprites: AtmosphereSprites = createAtmosphereSprites(dpr)

    const petals: PetalParticle[] = Array.from({ length: MAX_PETALS }, () =>
      createPetal(random, width, height, atmosphereRef.current.petalScale),
    )
    const pollen: PollenParticle[] = Array.from({ length: MAX_POLLEN }, () =>
      createPollen(random, width, height),
    )

    const weights = { drift: 1, converge: 0, disperse: 0, density: 0 }

    const director: PetalDirector = {
      phase: 'idle',
      setPhase(phase: PetalPhase) {
        director.phase = phase
        switch (phase) {
          case 'drift':
            gsap.to(weights, { drift: 1, converge: 0, disperse: 0, duration: 2.4, ease: 'sine.inOut' })
            break
          case 'converge':
            gsap.to(weights, { drift: 0.3, converge: 1, disperse: 0, duration: 2.8, ease: 'sine.inOut' })
            break
          case 'disperse':
            gsap.to(weights, { drift: 0.55, converge: 0, disperse: 1, duration: 1.2, ease: 'power2.out' })
            gsap.to(weights, { disperse: 0, duration: 3.6, delay: 1.2, ease: 'sine.inOut' })
            break
          case 'ambient':
            gsap.to(weights, { drift: 1, converge: 0, disperse: 0, duration: 4, ease: 'sine.inOut' })
            break
          case 'idle':
            gsap.to(weights, { drift: 1, converge: 0, disperse: 0, density: 0, duration: 2 })
            break
        }
      },
      setDensity(count: number) {
        gsap.to(weights, {
          density: Math.min(count, MAX_PETALS),
          duration: 3.2,
          ease: 'sine.inOut',
        })
      },
    }

    readyRef.current?.(director)

    const resize = () => {
      width = container.clientWidth || window.innerWidth
      height = container.clientHeight || window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, window.innerWidth < 820 ? 1.6 : 2)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      sprites = createAtmosphereSprites(dpr)
    }
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    let frame = 0
    let lastTime = 0
    let elapsed = 0

    const draw = (time: number) => {
      const dt = lastTime === 0 ? 1 / 60 : Math.min(0.05, (time - lastTime) / 1000)
      lastTime = time
      elapsed += dt

      const cx = width * CENTER.x
      const cy = height * CENTER.y
      const targetActive = Math.round(weights.density)

      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.clearRect(0, 0, width, height)

      context.globalCompositeOperation = 'lighter'
      const pollenAlpha = Math.min(1, weights.density / 8)
      for (const particle of pollen) {
        const target =
          (0.1 + 0.34 * Math.abs(Math.sin(elapsed * particle.speed + particle.phase))) * pollenAlpha
        particle.alpha += (target - particle.alpha) * Math.min(1, dt * 1.8)
        if (particle.alpha > 0.01) {
          const sway = Math.sin(elapsed * 0.24 + particle.phase) * 14 * (0.4 + particle.z)
          const x = particle.x + sway
          const y = particle.y + Math.sin(elapsed * 0.16 + particle.phase * 2) * 8
          const radius = particle.radius
          context.globalAlpha = particle.alpha
          context.drawImage(sprites.pollen, x - radius * 3, y - radius * 3, radius * 6, radius * 6)
        }
        particle.y += particle.vy * dt
        particle.x += particle.vx * dt
        if (particle.y < -30) {
          particle.y = height + 20
          particle.x = Math.random() * width
        }
      }

      context.globalCompositeOperation = 'source-over'

      const ordered = petals
        .slice(0, Math.max(targetActive, 1))
        .sort((a, b) => a.z - b.z)

      for (let index = 0; index < petals.length; index += 1) {
        const particle = petals[index]
        const active = index < targetActive
        particle.targetAlpha = active ? (particle.z > 0.72 ? 0.82 : 0.92) : 0
        particle.alpha += (particle.targetAlpha - particle.alpha) * Math.min(1, dt * (active ? 1.6 : 1.1))

        if (particle.alpha <= 0.012) continue

        const dx = cx - particle.x
        const dy = cy - particle.y
        const distance = Math.hypot(dx, dy) + 30
        const nx = dx / distance
        const ny = dy / distance

        const swirl = 0.62
        const radialFactor =
          Math.max(-0.55, Math.min(1, (distance - 70) / 60)) * (1 + weights.converge * 0.55)
        const pull = 300 * (0.55 + particle.z)

        const convAx = nx * pull * radialFactor - ny * pull * swirl
        const convAy = ny * pull * radialFactor + nx * pull * swirl

        const outX = particle.x - cx
        const outY = particle.y - cy
        const outDistance = Math.hypot(outX, outY) + 40
        const dispAx = (outX / outDistance) * 460 * (0.4 + particle.z)
        const dispAy = (outY / outDistance) * 340 * (0.4 + particle.z) - 70

        const waveA = Math.sin(elapsed * particle.swayFreqA + particle.swayPhase)
        const waveB = Math.sin(elapsed * particle.swayFreqB + particle.swayPhase * 1.7)
        const targetVx = (waveA * 0.72 + waveB * 0.28) * particle.swayAmp * (0.3 + particle.z * 0.9)
        const targetVy = (12 + 30 * particle.z) * (weights.converge > 0.4 ? 0.4 : 1)

        const ax =
          (targetVx - particle.vx) * 1.15 * weights.drift +
          convAx * weights.converge +
          dispAx * weights.disperse
        const ay =
          (targetVy - particle.vy) * 1.15 * weights.drift +
          convAy * weights.converge +
          dispAy * weights.disperse

        particle.vx += ax * dt
        particle.vy += ay * dt

        const maxSpeed = 900
        const speed = Math.hypot(particle.vx, particle.vy)
        if (speed > maxSpeed) {
          particle.vx = (particle.vx / speed) * maxSpeed
          particle.vy = (particle.vy / speed) * maxSpeed
        }

        particle.x += particle.vx * dt
        particle.y += particle.vy * dt
        particle.rot += particle.rotSpeed * dt * (0.5 + particle.z)

        particle.captured += ((weights.converge > 0.5 && distance < 140 ? 1 : 0) - particle.captured) * Math.min(1, dt * 2)

        if (particle.y > height + 140) {
          particle.y = -60 - Math.random() * 220
          particle.x = Math.random() * width
          particle.vy = 6 + Math.random() * 14
          particle.vx = 0
        }
        if (particle.x < -220) particle.x = width + 180
        if (particle.x > width + 220) particle.x = -180
      }

      context.globalCompositeOperation = 'source-over'
      for (const particle of ordered) {
        const blur = particle.blur
        const pad = petalSpritePad(PETAL_BLUR_STEPS[blur])
        const sizeScale = (particle.size * (1 - 0.22 * weights.converge)) / PETAL_SPRITE_SIZE.height
        const drawWidth = (PETAL_SPRITE_SIZE.width + pad * 2) * sizeScale
        const drawHeight = (PETAL_SPRITE_SIZE.height + pad * 2) * sizeScale
        const sprite = sprites.petals[particle.tone][blur]

        const centerDistance = Math.hypot(particle.x - cx, particle.y - cy)
        const melt = Math.max(0, Math.min(1, centerDistance / 150))

        context.globalAlpha = particle.alpha * (0.35 + 0.65 * melt)
        context.setTransform(dpr, 0, 0, dpr, particle.x * dpr, particle.y * dpr)
        context.rotate((particle.rot * Math.PI) / 180)
        context.drawImage(sprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight)
      }
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.globalAlpha = 1

      frame = requestAnimationFrame(draw)
    }

    if (reducedRef.current) {
      director.setDensity(Math.min(6, atmosphereRef.current.petals))
      gsap.set(weights, { density: Math.min(6, atmosphereRef.current.petals), drift: 1 })
      for (let i = 0; i < petals.length; i += 1) {
        petals[i].alpha = i < 6 ? 0.8 : 0
      }
      for (let i = 0; i < pollen.length; i += 1) {
        pollen[i].alpha = i < 18 ? 0.5 : 0
      }
      draw(0)
      cancelAnimationFrame(frame)
    } else {
      frame = requestAnimationFrame(draw)
    }

    const handleVisibility = () => {
      if (reducedRef.current) return
      if (document.hidden) {
        cancelAnimationFrame(frame)
      } else {
        lastTime = 0
        frame = requestAnimationFrame(draw)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('visibilitychange', handleVisibility)
      resizeObserver.disconnect()
      gsap.killTweensOf(weights)
    }
  }, [])

  return <canvas ref={canvasRef} className="atmosphere-canvas" aria-hidden="true" />
}
