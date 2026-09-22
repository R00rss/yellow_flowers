import { gsap } from '../lib/gsap'
import { hashString, rangeFromKey } from '../lib/random'

interface GardenBloomOptions {
  garden: HTMLElement
  reducedMotion: boolean
  startAt: number
  duration: number
}

function angleOf(element: Element): number {
  return Number(element.getAttribute('data-angle') ?? 0)
}

function sizeOf(element: Element): number {
  return Number(element.getAttribute('data-size') ?? 1)
}

function all(root: Element, selector: string): Element[] {
  return gsap.utils.toArray<Element>(selector, root)
}

/** Prepara el estado inicial: nada del jardín se ve antes de florecer. */
export function prepareGarden(garden: HTMLElement, reducedMotion: boolean): void {
  gsap.set(garden, { autoAlpha: 0 })
  if (reducedMotion) return

  all(garden, '.stem').forEach((stem) => gsap.set(stem, { drawSVG: '0%' }))
  gsap.set(all(garden, '.leaf'), { scale: 0.08, rotation: -26, opacity: 0 })
  gsap.set(all(garden, '.blade'), { scaleY: 0.12, opacity: 0 })
  gsap.set(all(garden, '.petal'), { scale: 0.1, rotation: -22, opacity: 0 })
  gsap.set(all(garden, '.mini'), { scale: 0.1, opacity: 0 })
  gsap.set(all(garden, '.head-core'), { scale: 0.3, opacity: 0 })
  gsap.set(all(garden, '.bud-open'), { opacity: 0 })
  gsap.set(all(garden, '.bud-open .petal'), { scale: 0.15, opacity: 0 })
  gsap.set(all(garden, '.head'), { scale: 0.92, y: 8 })
  gsap.set(all(garden, '.head-glow'), { opacity: 0 })
}

export function buildGardenBloom(timeline: gsap.core.Timeline, options: GardenBloomOptions): void {
  const { garden, reducedMotion, startAt, duration } = options
  const slots = gsap.utils.toArray<HTMLElement>('[data-flower-id]', garden)

  timeline.to(garden, { autoAlpha: 1, duration: reducedMotion ? 1.6 : 1.2 }, startAt)

  if (reducedMotion) {
    slots.forEach((slot, index) => {
      timeline.fromTo(
        slot,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: 'power1.out' },
        startAt + 0.3 + (index / Math.max(1, slots.length)) * 2.4,
      )
    })
    return
  }

  const window = duration * 0.78

  slots
    .slice()
    .sort(
      (a, b) =>
        Number(a.getAttribute('data-flower-delay') ?? 0) -
        Number(b.getAttribute('data-flower-delay') ?? 0),
    )
    .forEach((slot) => {
      const seed = slot.getAttribute('data-flower-id') ?? 'flower'
      const variant = slot.getAttribute('data-flower-variant') ?? 'sunflower'
      const at = startAt + Number(slot.getAttribute('data-flower-delay') ?? 0) * window
      const seedValue = hashString(seed)
      const fromEnd = seedValue % 2 === 0

      const stems = all(slot, '.stem')
      const leaves = all(slot, '.leaf')
      const blades = all(slot, '.blade')
      const petals = all(slot, '.petal')
      const minis = all(slot, '.mini')
      const head = all(slot, '.head')
      const glow = all(slot, '.head-glow')

      if (stems.length) {
        timeline.fromTo(
          stems,
          { drawSVG: '0%' },
          {
            drawSVG: '100%',
            duration: variant === 'grass' ? 1.6 : 2.7,
            ease: 'power2.inOut',
          },
          at,
        )
      }

      if (blades.length) {
        timeline.to(
          blades,
          {
            scaleY: 1,
            opacity: 1,
            duration: 1.9,
            stagger: { each: 0.07, from: fromEnd ? 'end' : 'start' },
            ease: 'power2.out',
          },
          at + 0.15,
        )
      }

      if (leaves.length) {
        timeline.to(
          leaves,
          {
            scale: 1,
            rotation: 0,
            opacity: 1,
            duration: 1.5,
            stagger: { each: 0.18, from: fromEnd ? 'end' : 'start' },
            ease: 'back.out(1.5)',
          },
          at + 0.55,
        )
      }

      if (head.length) {
        timeline.to(
          head,
          { scale: 1, y: 0, duration: 1.7, ease: 'power2.out' },
          at + 0.85,
        )
      }

      if (glow.length) {
        timeline.to(glow, { opacity: 0.9, duration: 2.4, ease: 'sine.out' }, at + 0.9)
      }

      const cores = all(slot, '.head-core')
      if (cores.length) {
        timeline.to(
          cores,
          { scale: 1, opacity: 1, duration: 1.1, ease: 'back.out(1.4)' },
          at + 0.85,
        )
      }

      if (minis.length) {
        timeline.to(
          minis,
          {
            scale: (_index, target) => sizeOf(target),
            opacity: 1,
            duration: 1.2,
            stagger: { each: 0.2, from: fromEnd ? 'end' : 'start' },
            ease: 'back.out(1.6)',
          },
          at + 0.75,
        )
      }

      if (petals.length) {
        timeline.to(
          petals,
          {
            scale: 1,
            rotation: (_index, target) => angleOf(target),
            opacity: 1,
            duration: 1.35,
            stagger: { each: variant === 'blossom' ? 0.03 : 0.05, from: fromEnd ? 'end' : 'start' },
            ease: 'back.out(1.4)',
          },
          at + 1.05,
        )
      }

      const closed = all(slot, '.bud-closed')
      const open = all(slot, '.bud-open')
      if (closed.length && open.length) {
        timeline.to(
          closed,
          { opacity: 0, scale: 0.55, y: -10, duration: 0.9, ease: 'power2.in' },
          at + 2.1,
        )
        timeline.to(open, { opacity: 1, duration: 0.5 }, at + 2.5)
        timeline.to(
          all(slot, '.bud-open .petal'),
          {
            scale: 1,
            opacity: 1,
            duration: 1.2,
            stagger: { each: 0.07, from: fromEnd ? 'end' : 'start' },
            ease: 'back.out(1.5)',
          },
          at + 2.4,
        )
      }
    })
}

/** Movimiento perpetuo, suave y desfasado entre plantas. */
export function startGardenIdle(garden: HTMLElement, reducedMotion: boolean): gsap.core.Tween[] {
  if (reducedMotion) return []

  const tweens: gsap.core.Tween[] = []

  gsap.utils.toArray<HTMLElement>('[data-flower-id]', garden).forEach((slot) => {
    const seed = slot.getAttribute('data-flower-id') ?? 'flower'
    const variant = slot.getAttribute('data-flower-variant') ?? 'sunflower'
    const layer = slot.closest('[data-garden-layer]')?.getAttribute('data-garden-layer') ?? 'mid'
    const plant = slot.querySelector('.plant')

    if (plant) {
      const amplitude = variant === 'grass' ? 2.4 : layer === 'near' ? 1.35 : 0.95
      tweens.push(
        gsap.to(plant, {
          rotation: (hashString(seed) % 2 === 0 ? 1 : -1) * amplitude,
          duration: rangeFromKey(seed, 'sway', 5.6, 9.4),
          delay: rangeFromKey(seed, 'sway-delay', 0, 2.4),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }),
      )
    }

    if (layer !== 'far') {
      const head = slot.querySelector('.head')
      if (head) {
        tweens.push(
          gsap.to(head, {
            rotation: (hashString(seed) % 3 === 0 ? -1 : 1) * 0.85,
            duration: rangeFromKey(seed, 'head', 4.6, 7.8),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      }
    }

    gsap.utils.toArray<Element>('.blade', slot).forEach((blade, index) => {
      tweens.push(
        gsap.to(blade, {
          rotation: (index % 2 === 0 ? 1 : -1) * rangeFromKey(seed, `blade-${index}`, 1.4, 3),
          duration: rangeFromKey(seed, `blade-dur-${index}`, 3.4, 6.4),
          delay: rangeFromKey(seed, `blade-delay-${index}`, 0, 2),
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        }),
      )
    })

    if (layer !== 'far') {
      gsap.utils.toArray<Element>('.leaf', slot).forEach((leaf, index) => {
        tweens.push(
          gsap.to(leaf, {
            rotation: (index % 2 === 0 ? 1 : -1) * rangeFromKey(seed, `leaf-${index}`, 1, 2.2),
            duration: rangeFromKey(seed, `leaf-dur-${index}`, 4.2, 8.2),
            delay: rangeFromKey(seed, `leaf-delay-${index}`, 0, 2.6),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          }),
        )
      })
    }
  })

  return tweens
}
