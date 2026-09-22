import type { AudioController } from '../../hooks/useAudioController'

interface MusicControlProps {
  controller: AudioController
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M8 5.5 L18.5 12 L8 18.5 Z" fill="currentColor" />
    </svg>
  )
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="7.5" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" />
      <rect x="13.1" y="5.5" width="3.4" height="13" rx="1.2" fill="currentColor" />
    </svg>
  )
}

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M4 9.5 h3.2 L12 5.6 v12.8 L7.2 14.5 H4 Z"
        fill="currentColor"
        opacity="0.92"
      />
      {muted ? (
        <path
          d="M15.4 9.6 L20 14.4 M20 9.6 L15.4 14.4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M15 9.4 C 16.4 10.8 16.4 13.2 15 14.6"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M17.6 7.2 C 20.1 9.7 20.1 14.3 17.6 16.8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.7"
          />
        </>
      )}
    </svg>
  )
}

export function MusicControl({ controller }: MusicControlProps) {
  const { status, volume, muted, title, toggle, toggleMute, setVolume } = controller

  if (status === 'unavailable' || status === 'disabled') return null

  const playing = status === 'playing'

  return (
    <div className="music" data-music>
      <button
        type="button"
        className="music-button music-button--toggle"
        onClick={toggle}
        aria-label={playing ? 'Pausar la música' : 'Reproducir la música'}
        aria-pressed={playing}
      >
        {playing ? <PauseIcon /> : <PlayIcon />}
      </button>

      <div className={`music-equalizer${playing ? ' is-playing' : ''}`} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <span className="music-title" title={title}>
        {title}
      </span>

      <button
        type="button"
        className="music-button"
        onClick={toggleMute}
        aria-label={muted ? 'Activar el sonido' : 'Silenciar la música'}
        aria-pressed={muted}
      >
        <SoundIcon muted={muted} />
      </button>

      <input
        className="music-volume"
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={muted ? 0 : volume}
        onChange={(event) => setVolume(Number(event.target.value))}
        aria-label="Volumen de la música"
      />
    </div>
  )
}
