import { gsap } from '../lib/gsap'

export interface LetterTimelineOptions {
  root: HTMLElement
  panel: HTMLElement
  lines: Element[]
  seal?: Element | null
  open: boolean
}

function flowerParting(root: HTMLElement, open: boolean): gsap.core.Tween[] {
  const tweens: gsap.core.Tween[] = []
  const slots = gsap.utils.toArray<HTMLElement>('[data-flower-id]', root)

  slots.forEach((slot) => {
    const layer = slot.closest('[data-garden-layer]')?.getAttribute('data-garden-layer')
    const factor = layer === 'near' ? 1 : layer === 'mid' ? 0.55 : 0.3
    const isLeft = Number.parseFloat(slot.style.left || '50') < 50
    const distance = (isLeft ? -1 : 1) * 4.2 * factor

    tweens.push(
      gsap.to(slot, {
        x: open ? `${distance}vw` : '0vw',
        duration: open ? 1.8 : 1.4,
        ease: 'power2.inOut',
      }),
    )
  })

  return tweens
}

export function createLetterTimeline({
  root,
  panel,
  lines,
  seal,
  open,
}: LetterTimelineOptions): gsap.core.Timeline {
  const garden = root.querySelector<HTMLElement>('[data-garden]')
  const front = root.querySelector<HTMLElement>('[data-atmosphere="front"]')
  const calm =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const timeline = gsap.timeline()

  if (open) {
    if (garden) {
      timeline.to(garden, { opacity: 0.42, duration: 1.5, ease: 'sine.inOut' }, 0)
    }
    if (front) {
      timeline.to(front, { opacity: 1, duration: 1.5, ease: 'sine.inOut' }, 0)
    }
    timeline.add(flowerParting(root, true), 0)

    timeline.fromTo(
      panel,
      { opacity: 0, yPercent: calm ? 0 : 4.5, scale: calm ? 1 : 0.965 },
      { opacity: 1, yPercent: 0, scale: 1, duration: calm ? 0.8 : 1.2, ease: 'power3.out' },
      0.06,
    )
    timeline.fromTo(
      lines,
      { opacity: 0, y: calm ? 0 : 24 },
      { opacity: 1, y: 0, duration: calm ? 0.7 : 1, stagger: calm ? 0.06 : 0.12, ease: 'power2.out' },
      0.34,
    )
    if (seal) {
      timeline.fromTo(
        seal,
        { opacity: 0, scale: calm ? 1 : 0.35, rotation: calm ? 0 : -22 },
        { opacity: 1, scale: 1, rotation: 0, duration: calm ? 0.7 : 1.1, ease: 'back.out(1.5)' },
        0.7,
      )
    }
  } else {
    timeline.to(lines, { opacity: 0, duration: 0.32, ease: 'power1.in' }, 0)
    timeline.to(
      panel,
      { opacity: 0, yPercent: calm ? 0 : 3, scale: calm ? 1 : 0.972, duration: 0.6, ease: 'power2.in' },
      0.05,
    )
    timeline.add(flowerParting(root, false), 0.15)
    if (garden) {
      timeline.to(garden, { opacity: 1, duration: 1.2, ease: 'sine.inOut' }, 0.15)
    }
  }

  return timeline
}
