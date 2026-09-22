import { experienceConfig } from '../../config/experience'

interface SkipIntroProps {
  visible: boolean
  onSkip: () => void
}

export function SkipIntro({ visible, onSkip }: SkipIntroProps) {
  return (
    <button
      type="button"
      className={`skip-intro${visible ? ' is-visible' : ''}`}
      onClick={onSkip}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      data-skip
    >
      <span>{experienceConfig.skipLabel}</span>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path
          d="M5 12 h13 M13 6.5 L18.5 12 L13 17.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
