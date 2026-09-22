import { useCallback, useEffect, useRef, useState } from 'react'
import { startGardenIdle } from '../../animations/gardenTimeline'
import { createIntroTimeline, type IntroExperience } from '../../animations/introTimeline'
import { TIMES } from '../../animations/timings'
import { experienceConfig } from '../../config/experience'
import { gardenLayout } from '../../config/gardenLayout'
import { useAudioController } from '../../hooks/useAudioController'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import { useViewportLayout } from '../../hooks/useViewportLayout'
import { gsap } from '../../lib/gsap'
import type { PetalDirector } from '../atmosphere/types'
import { MusicControl } from '../ui/MusicControl'
import { GardenScene } from './GardenScene'
import { LoveLetter } from './LoveLetter'
import { MessageReveal } from './MessageReveal'
import { SkipIntro } from './SkipIntro'
import './experience.css'

const FALLBACK_DIRECTOR: PetalDirector = {
  phase: 'idle',
  setPhase: () => undefined,
  setDensity: () => undefined,
}

const PARALLAX_STRENGTH: Record<string, number> = { far: 0.45, mid: 0.9, near: 1.7 }

async function waitForFonts(timeout = 2600): Promise<void> {
  if (typeof document === 'undefined' || !('fonts' in document)) return

  const families = [
    '500 1em "Cormorant Garamond"',
    '600 1em "Cormorant Garamond"',
    'italic 500 1em "Cormorant Garamond"',
    '500 1em "Manrope Variable"',
  ]

  const loads = families.map((family) => document.fonts.load(family))
  await Promise.race([
    Promise.all([...loads, document.fonts.ready]),
    new Promise((resolve) => setTimeout(resolve, timeout)),
  ]).catch(() => undefined)
}

export function CinematicExperience() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const ctaRef = useRef<HTMLButtonElement | null>(null)
  const directorRef = useRef<PetalDirector | null>(null)
  const experienceRef = useRef<IntroExperience | null>(null)
  const idleRef = useRef<gsap.core.Tween[]>([])
  const progressRef = useRef(0)
  const completedRef = useRef(false)

  const reducedMotion = usePrefersReducedMotion()
  const layoutName = useViewportLayout()
  const layoutSpec = gardenLayout[layoutName]
  const audio = useAudioController()

  const [letterOpen, setLetterOpen] = useState(false)
  const [showSkip, setShowSkip] = useState(false)

  const handleDirectorReady = useCallback((director: PetalDirector) => {
    directorRef.current = director
  }, [])

  const handleIntroComplete = useCallback(() => {
    completedRef.current = true
    setShowSkip(false)

    const garden = rootRef.current?.querySelector<HTMLElement>('[data-garden]')
    if (!garden) return
    idleRef.current.forEach((tween) => tween.kill())
    idleRef.current = startGardenIdle(garden, reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let disposed = false
    let context: gsap.Context | null = null

    const boot = async () => {
      await waitForFonts()
      if (disposed) return

      if (!directorRef.current) {
        for (let attempt = 0; attempt < 10 && !directorRef.current; attempt += 1) {
          await new Promise((resolve) => requestAnimationFrame(resolve))
        }
      }
      if (disposed) return

      const director = directorRef.current ?? FALLBACK_DIRECTOR

      context = gsap.context(() => {
        const experience = createIntroTimeline({
          root,
          director,
          reducedMotion,
          onComplete: handleIntroComplete,
        })
        experienceRef.current = experience
        experience.timeline.call(() => setShowSkip(true), undefined, TIMES.danceStart)

        const target = completedRef.current ? 1 : progressRef.current
        experience.timeline.progress(target, false)
        experience.timeline.play()
      }, root)
    }

    void boot()

    return () => {
      disposed = true
      idleRef.current.forEach((tween) => tween.kill())
      idleRef.current = []

      const experience = experienceRef.current
      if (experience) {
        progressRef.current = experience.timeline.progress()
        experience.timeline.kill()
        experience.splits.forEach((split) => split.revert())
      }
      experienceRef.current = null
      context?.revert()
    }
  }, [handleIntroComplete, layoutName, reducedMotion])

  useEffect(() => {
    const root = rootRef.current
    if (!root || reducedMotion || layoutName !== 'desktop') return

    const layers = gsap.utils.toArray<HTMLElement>('[data-garden-layer]', root)
    if (!layers.length) return

    const setters = layers.map((layer) => {
      const name = layer.getAttribute('data-garden-layer') ?? 'mid'
      return {
        amount: PARALLAX_STRENGTH[name] ?? 0.6,
        x: gsap.quickTo(layer, 'x', { duration: 1.5, ease: 'power3.out' }),
        y: gsap.quickTo(layer, 'y', { duration: 1.5, ease: 'power3.out' }),
      }
    })

    const handleMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5
      const ny = event.clientY / window.innerHeight - 0.5
      const width = window.innerWidth
      const height = window.innerHeight

      setters.forEach((setter) => {
        setter.x(-nx * setter.amount * width * 0.022)
        setter.y(-ny * setter.amount * height * 0.014)
      })
    }

    window.addEventListener('pointermove', handleMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', handleMove)
      setters.forEach((setter) => {
        setter.x(0)
        setter.y(0)
      })
    }
  }, [layoutName, reducedMotion])

  const handleSkip = useCallback(() => {
    setShowSkip(false)
    const timeline = experienceRef.current?.timeline
    if (!timeline) return
    timeline.timeScale(2.8)
    if (timeline.paused()) timeline.play()
  }, [])

  const openLetter = useCallback(() => setLetterOpen(true), [])
  const closeLetter = useCallback(() => setLetterOpen(false), [])

  return (
    <div className="experience" ref={rootRef}>
      <GardenScene
        layout={layoutSpec}
        atmosphere={layoutSpec.atmosphere}
        reducedMotion={reducedMotion}
        onDirectorReady={handleDirectorReady}
      />

      <MessageReveal config={experienceConfig} onOpenLetter={openLetter} ctaRef={ctaRef} />

      <div className="experience-layer experience-layer--ui">
        <SkipIntro visible={showSkip} onSkip={handleSkip} />
        <MusicControl controller={audio} />
      </div>

      <LoveLetter
        open={letterOpen}
        config={experienceConfig}
        rootRef={rootRef}
        returnFocusRef={ctaRef}
        onClose={closeLetter}
      />
    </div>
  )
}
