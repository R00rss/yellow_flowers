import { useCallback, useEffect, useRef, useState } from 'react'
import { experienceConfig } from '../config/experience'
import { gsap } from '../lib/gsap'

export type AudioStatus = 'loading' | 'paused' | 'playing' | 'unavailable' | 'disabled'

export interface AudioController {
  status: AudioStatus
  volume: number
  muted: boolean
  title: string
  toggle: () => void
  toggleMute: () => void
  setVolume: (value: number) => void
}

export function useAudioController(): AudioController {
  const { music } = experienceConfig
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<gsap.core.Tween | null>(null)
  const volumeRef = useRef<number>(music.volume)
  const mutedRef = useRef(false)
  const statusRef = useRef<AudioStatus>(music.enabled ? 'loading' : 'disabled')

  const [status, setStatus] = useState<AudioStatus>(music.enabled ? 'loading' : 'disabled')
  const [volume, setVolumeState] = useState<number>(music.volume)
  const [muted, setMuted] = useState(false)

  const updateStatus = useCallback((next: AudioStatus) => {
    statusRef.current = next
    setStatus(next)
  }, [])

  const fadeTo = useCallback((target: number, duration: number, onComplete?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    fadeRef.current?.kill()
    fadeRef.current = gsap.to(audio, {
      volume: target,
      duration,
      ease: 'sine.inOut',
      onComplete,
    })
  }, [])

  const play = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    void (async () => {
      try {
        audio.volume = 0
        await audio.play()
        updateStatus('playing')
        fadeTo(mutedRef.current ? 0 : volumeRef.current, music.fadeIn)
      } catch {
        if (statusRef.current !== 'unavailable') updateStatus('paused')
      }
    })()
  }, [fadeTo, music.fadeIn, updateStatus])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    updateStatus('paused')
    fadeTo(0, music.fadeOut, () => {
      audio.pause()
    })
  }, [fadeTo, music.fadeOut, updateStatus])

  useEffect(() => {
    if (!music.enabled) return
    const audio = new Audio()
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audio.muted = mutedRef.current
    audio.src = `${import.meta.env.BASE_URL}${music.src}`
    audioRef.current = audio

    let disposed = false

    const handleError = () => {
      if (disposed) return
      fadeRef.current?.kill()
      updateStatus('unavailable')
    }
    const handleReady = () => {
      if (disposed) return
      if (statusRef.current === 'loading') updateStatus('paused')
    }

    audio.addEventListener('error', handleError)
    audio.addEventListener('canplaythrough', handleReady)
    audio.addEventListener('loadeddata', handleReady)
    audio.load()

    play()

    return () => {
      disposed = true
      audio.removeEventListener('error', handleError)
      audio.removeEventListener('canplaythrough', handleReady)
      audio.removeEventListener('loadeddata', handleReady)
      fadeRef.current?.kill()
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
      audioRef.current = null
    }
  }, [music.enabled, music.src, play, updateStatus])

  useEffect(() => {
    if (!music.enabled) return
    if (status !== 'paused' && status !== 'loading') return

    const handleGesture = () => {
      if (statusRef.current === 'unavailable') return
      play()
    }

    window.addEventListener('pointerdown', handleGesture)
    window.addEventListener('keydown', handleGesture)
    window.addEventListener('touchstart', handleGesture, { passive: true })

    return () => {
      window.removeEventListener('pointerdown', handleGesture)
      window.removeEventListener('keydown', handleGesture)
      window.removeEventListener('touchstart', handleGesture)
    }
  }, [music.enabled, play, status])

  const toggle = useCallback(() => {
    if (statusRef.current === 'unavailable' || statusRef.current === 'disabled') return
    if (statusRef.current === 'playing') {
      pause()
    } else {
      play()
    }
  }, [pause, play])

  const toggleMute = useCallback(() => {
    const audio = audioRef.current
    const next = !mutedRef.current
    mutedRef.current = next
    setMuted(next)
    if (!audio) return
    audio.muted = next
    if (!next && statusRef.current === 'playing') {
      fadeTo(volumeRef.current, 0.4)
    }
  }, [fadeTo])

  const setVolume = useCallback(
    (value: number) => {
      const clamped = Math.max(0, Math.min(1, value))
      volumeRef.current = clamped
      setVolumeState(clamped)
      const audio = audioRef.current
      if (!audio) return
      if (mutedRef.current && clamped > 0) {
        mutedRef.current = false
        setMuted(false)
        audio.muted = false
      }
      if (statusRef.current === 'playing') {
        fadeTo(clamped, 0.25)
      }
    },
    [fadeTo],
  )

  return { status, volume, muted, title: music.title, toggle, toggleMute, setVolume }
}
