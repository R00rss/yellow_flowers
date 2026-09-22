import './atmosphere.css'

/** Capas de luz que viven detrás del jardín. */
export function AtmosphericLighting() {
  return (
    <div className="atmosphere atmosphere--back" data-atmosphere="back" aria-hidden="true">
      <div className="light-base" data-light="base" />
      <div className="light-horizon" data-light="horizon" />
      <div className="light-haze" data-light="haze">
        <span className="haze-blob haze-blob--0" />
        <span className="haze-blob haze-blob--1" />
        <span className="haze-blob haze-blob--2" />
      </div>
      <div className="light-shafts" data-light="shafts">
        <span className="light-shaft light-shaft--0" />
        <span className="light-shaft light-shaft--1" />
        <span className="light-shaft light-shaft--2" />
        <span className="light-shaft light-shaft--3" />
        <span className="light-shaft light-shaft--4" />
      </div>
      <div className="light-bloom" data-light="bloom" />
    </div>
  )
}

/** Viñeta y grano por delante del jardín, para dar profundidad final. */
export function AtmosphericVignette() {
  return (
    <div className="atmosphere atmosphere--front" data-atmosphere="front" aria-hidden="true">
      <div className="vignette" />
      <div className="grain" />
    </div>
  )
}
