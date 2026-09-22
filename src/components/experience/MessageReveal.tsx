import type { ExperienceConfig } from '../../config/experience'

interface MessageRevealProps {
  config: ExperienceConfig
  onOpenLetter: () => void
  ctaRef: React.RefObject<HTMLButtonElement | null>
}

export function MessageReveal({ config, onOpenLetter, ctaRef }: MessageRevealProps) {
  return (
    <div className="message" data-message>
      <div className="message-scrim" data-message="scrim" aria-hidden="true" />

      <div className="message-body">
        <div className="message-content">
          <h1 className="message-headline" data-message="headline" aria-label={config.headline}>
            {config.headline}
          </h1>

          <p className="message-subtitle" data-message="subtitle">
            {config.subtitle}
          </p>

          <p className="message-signature" data-message="signature">
            <span>{config.signature}</span>
            <svg
              className="signature-rule"
              viewBox="0 0 240 10"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                data-message="rule"
                d="M2 6 C 42 1.5, 86 8.5, 126 4 S 206 6.5, 238 2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          </p>
        </div>

        <div className="invitation" data-invitation>
          <p className="invitation-text">{config.invitation}</p>
          <button
            ref={ctaRef}
            type="button"
            className="letter-cta"
            data-invitation="cta"
            onClick={onOpenLetter}
          >
            <span className="letter-cta-label">{config.letterCta}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
