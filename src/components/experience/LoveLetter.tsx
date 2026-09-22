import { useEffect, useRef, type MouseEvent as ReactMouseEvent, type RefObject } from 'react'
import { createLetterTimeline } from '../../animations/letterTimeline'
import type { ExperienceConfig } from '../../config/experience'
import { gsap } from '../../lib/gsap'

interface LoveLetterProps {
  open: boolean
  config: ExperienceConfig
  rootRef: RefObject<HTMLElement | null>
  returnFocusRef: RefObject<HTMLButtonElement | null>
  onClose: () => void
}

export function LoveLetter({ open, config, rootRef, returnFocusRef, onClose }: LoveLetterProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    const panel = panelRef.current
    const root = rootRef.current
    if (!dialog || !panel) return

    const lines = gsap.utils.toArray<Element>('[data-letter="line"]', dialog)
    const seal = dialog.querySelector('[data-letter="seal"]')
    let timeline: gsap.core.Timeline | null = null

    if (open) {
      if (!dialog.open) dialog.showModal()
      timeline = createLetterTimeline({ root: root ?? document.body, panel, lines, seal, open: true })
      const closeButton = dialog.querySelector<HTMLElement>('[data-letter="close"]')
      closeButton?.focus({ preventScroll: true })
    } else if (dialog.open) {
      timeline = createLetterTimeline({
        root: root ?? document.body,
        panel,
        lines,
        seal,
        open: false,
      })
      timeline.eventCallback('onComplete', () => {
        dialog.close()
        returnFocusRef.current?.focus({ preventScroll: true })
      })
    }

    return () => {
      timeline?.kill()
    }
  }, [open, rootRef, returnFocusRef])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleCancel = (event: Event) => {
      event.preventDefault()
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => dialog.removeEventListener('cancel', handleCancel)
  }, [onClose])

  const handleBackdropClick = (event: ReactMouseEvent<HTMLDialogElement>) => {
    if (event.target === dialogRef.current) onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      className="letter-dialog"
      aria-labelledby="letter-title"
      onClick={handleBackdropClick}
    >
      <div className="letter-panel" ref={panelRef}>
        <div className="letter-paper" aria-hidden="true" />

        <button
          type="button"
          className="letter-close"
          data-letter="close"
          onClick={onClose}
          aria-label="Cerrar la carta"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path
              d="M6 6 L18 18 M18 6 L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div
          className="letter-scroll paper-scroll"
          tabIndex={0}
          role="region"
          aria-label="Contenido de la carta"
        >
          <header className="letter-head" data-letter="line">
            <svg className="letter-sprig" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
              <g transform="translate(32 30)">
                {Array.from({ length: 12 }, (_, index) => (
                  <g key={index} transform={`rotate(${index * 30})`}>
                    <path
                      d="M0 -7 C -4.4 -12 -5 -20 0 -26 C 5 -20 4.4 -12 0 -7 Z"
                      fill="var(--gold)"
                      opacity="0.9"
                    />
                  </g>
                ))}
                <circle r="9.5" fill="#7A4E14" />
                <circle r="6.5" fill="none" stroke="#E5A92F" strokeWidth="1.2" strokeDasharray="1.6 2.4" />
                <circle r="3.4" fill="#5A3710" />
              </g>
              <path
                d="M32 42 C 30 50 34 56 31 62"
                fill="none"
                stroke="#6E8A52"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M32 48 C 26 46 23 42 22 38 C 28 38 31 42 32 48 Z"
                fill="#6E8A52"
                opacity="0.85"
              />
            </svg>
            <p className="letter-date">{config.letterDate}</p>
            <h2 className="letter-title" id="letter-title">
              {config.letterTitle}
            </h2>
          </header>

          <div className="letter-body">
            {config.letter.map((paragraph, index) => (
              <p className="letter-paragraph" data-letter="line" key={index}>
                {paragraph}
              </p>
            ))}
          </div>

          <footer className="letter-footer" data-letter="line">
            <p className="letter-closing">{config.letterClosing}</p>
            <p className="letter-signature">{config.letterSignature}</p>
          </footer>

          <div className="letter-seal" data-letter="seal" aria-hidden="true">
            <svg viewBox="0 0 100 100" focusable="false">
              <defs>
                <radialGradient id="letter-seal-fill" cx="34%" cy="28%" r="78%">
                  <stop offset="0%" stopColor="#F0D488" />
                  <stop offset="48%" stopColor="#C08A1F" />
                  <stop offset="100%" stopColor="#7A4E14" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="45" fill="url(#letter-seal-fill)" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="rgba(255,248,231,0.4)"
                strokeWidth="1.1"
                strokeDasharray="2.4 3.2"
              />
              <text x="31" y="59" textAnchor="middle" className="letter-seal-letter">
                R
              </text>
              <text x="69" y="59" textAnchor="middle" className="letter-seal-letter">
                K
              </text>
              <path
                d="M50 61 C 44.4 53.8 39.6 51.4 39.6 56.2 C 39.6 60.6 45 64 50 68.4 C 55 64 60.4 60.6 60.4 56.2 C 60.4 51.4 55.6 53.8 50 61 Z"
                fill="#FFF3D2"
                opacity="0.92"
              />
            </svg>
          </div>
        </div>

        <button type="button" className="letter-back" onClick={onClose}>
          {config.letterCloseLabel}
        </button>
      </div>
    </dialog>
  )
}
