import type { PetalDirector } from '../components/atmosphere/types'
import { gsap, SplitText } from '../lib/gsap'
import { buildGardenBloom, prepareGarden } from './gardenTimeline'
import { TIMES } from './timings'

export interface IntroTimelineOptions {
  root: HTMLElement
  director: PetalDirector
  reducedMotion: boolean
  onComplete?: () => void
}

export interface IntroExperience {
  timeline: gsap.core.Timeline
  splits: SplitText[]
}

export function createIntroTimeline(options: IntroTimelineOptions): IntroExperience {
  const { root, director, reducedMotion, onComplete } = options
  const pick = <T extends Element>(selector: string): T | null => root.querySelector<T>(selector)

  const base = pick<HTMLElement>('[data-light="base"]')
  const bloom = pick<HTMLElement>('[data-light="bloom"]')
  const shafts = pick<HTMLElement>('[data-light="shafts"]')
  const haze = pick<HTMLElement>('[data-light="haze"]')
  const horizon = pick<HTMLElement>('[data-light="horizon"]')
  const garden = pick<HTMLElement>('[data-garden]')
  const message = pick<HTMLElement>('[data-message]')
  const scrim = pick<HTMLElement>('[data-message="scrim"]')
  const headline = pick<HTMLElement>('[data-message="headline"]')
  const subtitle = pick<HTMLElement>('[data-message="subtitle"]')
  const signature = pick<HTMLElement>('[data-message="signature"]')
  const rule = pick<SVGPathElement>('[data-message="rule"] path')
  const invitation = pick<HTMLElement>('[data-invitation]')
  const cta = pick<HTMLElement>('[data-invitation="cta"]')
  const music = pick<HTMLElement>('[data-music]')

  const splits: SplitText[] = []
  let headlineWords: Element[] = []
  let subtitleLines: Element[] = []

  if (!reducedMotion) {
    if (headline) {
      const split = SplitText.create(headline, {
        type: 'lines,words',
        mask: 'words',
        wordsClass: 'word',
        linesClass: 'line',
      })
      splits.push(split)
      headlineWords = split.words
    }
    if (subtitle) {
      const split = SplitText.create(subtitle, {
        type: 'lines,words',
        mask: 'words',
        wordsClass: 'word',
        linesClass: 'line',
      })
      splits.push(split)
      subtitleLines = split.words
    }
  }

  const timeline = gsap.timeline({
    paused: true,
    defaults: { ease: 'power2.out' },
    onComplete,
  })

  if (garden) prepareGarden(garden, reducedMotion)

  gsap.set([message, invitation].filter(Boolean), { autoAlpha: 0 })
  if (scrim) gsap.set(scrim, { opacity: 0 })
  if (base) gsap.set(base, { opacity: 0, scale: reducedMotion ? 1 : 0.6 })
  if (bloom) gsap.set(bloom, { opacity: 0, scale: reducedMotion ? 1 : 0.68 })
  gsap.set([shafts, haze, horizon].filter(Boolean), { opacity: 0 })
  if (cta) gsap.set(cta, { y: 16, opacity: 0 })
  if (rule) gsap.set(rule, { drawSVG: '0%' })
  if (music) gsap.set(music, { autoAlpha: 0 })

  // ---- Escena 1 · El despertar -------------------------------------------
  if (base) {
    timeline.to(
      base,
      {
        opacity: reducedMotion ? 0.6 : 0.92,
        scale: 1,
        duration: TIMES.glowInDuration,
        ease: 'sine.out',
      },
      TIMES.glowIn,
    )
  }
  if (horizon) {
    timeline.to(horizon, { opacity: 1, duration: 4.2, ease: 'sine.inOut' }, TIMES.horizonIn)
  }
  if (haze) {
    timeline.to(haze, { opacity: 1, duration: 5.5, ease: 'sine.inOut' }, TIMES.hazeIn)
  }
  if (shafts) {
    timeline.to(
      shafts,
      { opacity: reducedMotion ? 0.28 : 0.82, duration: 5.4, ease: 'sine.inOut' },
      TIMES.shaftsIn,
    )
  }

  timeline.call(() => director.setPhase('drift'), undefined, TIMES.firstPetals - 0.5)
  timeline.call(
    () => director.setDensity(reducedMotion ? 5 : 7),
    undefined,
    TIMES.firstPetals,
  )

  // ---- Escena 2 · La danza de los pétalos --------------------------------
  timeline.call(
    () => director.setDensity(reducedMotion ? 8 : 26),
    undefined,
    TIMES.danceStart,
  )
  timeline.call(() => director.setPhase('converge'), undefined, TIMES.convergeStart)

  if (base) {
    timeline.to(
      base,
      {
        opacity: reducedMotion ? 0.7 : 1,
        scale: reducedMotion ? 1 : 1.06,
        duration: TIMES.convergeDuration,
        ease: 'sine.inOut',
      },
      TIMES.convergeStart,
    )
  }
  if (bloom) {
    timeline.to(
      bloom,
      {
        opacity: reducedMotion ? 0.1 : 0.55,
        scale: 1,
        duration: 1.2,
        ease: 'power2.out',
      },
      TIMES.bloomPeak,
    )
    timeline.to(bloom, { opacity: 0.14, duration: 3, ease: 'sine.inOut' }, TIMES.bloomPeak + 1.2)
  }

  timeline.call(() => director.setPhase('disperse'), undefined, TIMES.disperse)
  timeline.call(() => director.setDensity(reducedMotion ? 4 : 15), undefined, TIMES.settle)

  if (music) {
    timeline.to(music, { autoAlpha: 1, duration: 1.6, ease: 'power2.out' }, TIMES.messageIn + 1.8)
  }

  // ---- Escena 3 · La revelación ------------------------------------------
  if (message) {
    timeline.set(message, { autoAlpha: 1 }, TIMES.messageIn)
  }
  if (scrim) {
    timeline.to(scrim, { opacity: 1, duration: 2.8, ease: 'sine.out' }, TIMES.messageIn)
  }
  if (base) {
    timeline.to(base, { opacity: 0.74, duration: 3.4, ease: 'sine.inOut' }, TIMES.messageIn + 0.6)
  }

  if (reducedMotion) {
    if (headline) {
      timeline.fromTo(
        headline,
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.6 },
        TIMES.headlineIn,
      )
    }
    if (subtitle) {
      timeline.fromTo(
        subtitle,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.6 },
        TIMES.subtitleIn,
      )
    }
    if (signature) {
      timeline.fromTo(
        signature,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 1.6 },
        TIMES.signatureIn,
      )
    }
    if (rule) {
      timeline.to(rule, { drawSVG: '100%', duration: 1.6 }, TIMES.signatureRule)
    }
  } else {
    if (headlineWords.length) {
      timeline.fromTo(
        headlineWords,
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.25,
          stagger: 0.08,
          ease: 'power3.out',
        },
        TIMES.headlineIn,
      )
    }
    if (subtitleLines.length) {
      timeline.fromTo(
        subtitleLines,
        { yPercent: 115, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.12,
          ease: 'power3.out',
        },
        TIMES.subtitleIn,
      )
    }
    if (signature) {
      timeline.fromTo(
        signature,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power2.out' },
        TIMES.signatureIn,
      )
    }
    if (rule) {
      timeline.fromTo(
        rule,
        { drawSVG: '0%' },
        { drawSVG: '100%', duration: 1.6, ease: 'power2.inOut' },
        TIMES.signatureRule,
      )
    }
  }

  // ---- Escena 4 · El jardín florece --------------------------------------
  if (garden) {
    buildGardenBloom(timeline, {
      garden,
      reducedMotion,
      startAt: TIMES.gardenStart,
      duration: TIMES.gardenDuration,
    })
  }
  if (message) {
    timeline.to(
      message,
      { y: reducedMotion ? '-1vh' : '-2.6vh', duration: 7, ease: 'sine.inOut' },
      TIMES.gardenStart + 0.8,
    )
  }

  // ---- Escena 5 · La invitación ------------------------------------------
  if (invitation) {
    timeline.to(invitation, { autoAlpha: 1, duration: 2, ease: 'power2.out' }, TIMES.invitationIn)
  }
  if (cta) {
    timeline.fromTo(
      cta,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.2, ease: 'power2.out' },
      TIMES.ctaIn,
    )
  }

  timeline.call(
    () => {
      director.setPhase('ambient')
      director.setDensity(reducedMotion ? 3 : 12)
    },
    undefined,
    TIMES.end - 0.6,
  )

  timeline.to({}, { duration: 0.6 }, TIMES.end)

  /* Con movimiento reducido la historia se cuenta más rápido, sin recorridos largos. */
  if (reducedMotion) timeline.timeScale(2.5)

  return { timeline, splits }
}
