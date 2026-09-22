interface FlowerGradientsProps {
  uid: string
  /** Coordenada Y (espacio local) de la punta del tallo. */
  stemTop: number
}

/**
 * Gradientes por instancia. Usan variables CSS para que cada flor pueda
 * cambiar de paleta sin duplicar definiciones.
 */
export function FlowerGradients({ uid, stemTop }: FlowerGradientsProps) {
  return (
    <defs>
      <linearGradient id={`${uid}-petal`} x1="0.1" y1="1" x2="0.35" y2="0">
        <stop offset="0%" style={{ stopColor: 'var(--petal-base)' }} />
        <stop offset="52%" style={{ stopColor: 'var(--petal-mid)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--petal-tip)' }} />
      </linearGradient>

      <linearGradient id={`${uid}-petal-back`} x1="0.15" y1="1" x2="0.4" y2="0">
        <stop offset="0%" style={{ stopColor: 'var(--petal-back-base)' }} />
        <stop offset="60%" style={{ stopColor: 'var(--petal-back-mid)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--petal-back-tip)' }} />
      </linearGradient>

      <linearGradient
        id={`${uid}-stem`}
        gradientUnits="userSpaceOnUse"
        x1="0"
        y1={stemTop * 0.25}
        x2="0"
        y2={stemTop}
      >
        <stop offset="0%" style={{ stopColor: 'var(--leaf-deep)' }} />
        <stop offset="55%" style={{ stopColor: 'var(--leaf-mid)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--leaf-light)' }} />
      </linearGradient>

      <linearGradient id={`${uid}-leaf`} x1="0" y1="0.1" x2="0.9" y2="0.6">
        <stop offset="0%" style={{ stopColor: 'var(--leaf-deep)' }} />
        <stop offset="62%" style={{ stopColor: 'var(--leaf-mid)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--leaf-light)' }} />
      </linearGradient>

      <radialGradient id={`${uid}-center`} cx="42%" cy="36%" r="68%">
        <stop offset="0%" style={{ stopColor: 'var(--center-light)' }} />
        <stop offset="46%" style={{ stopColor: 'var(--center-deep)' }} />
        <stop offset="76%" style={{ stopColor: 'var(--center-mid)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--center-line)' }} />
      </radialGradient>

      <radialGradient id={`${uid}-glow`} cx="50%" cy="50%" r="50%">
        <stop offset="0%" style={{ stopColor: 'var(--head-glow)' }} />
        <stop offset="55%" style={{ stopColor: 'var(--head-glow-soft)' }} />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>

      <radialGradient id={`${uid}-wash`} cx="30%" cy="26%" r="62%">
        <stop offset="0%" stopColor="rgba(255,248,231,0.22)" />
        <stop offset="55%" stopColor="rgba(244,197,66,0.08)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>

      <radialGradient id={`${uid}-shade`} cx="72%" cy="76%" r="60%">
        <stop offset="0%" stopColor="rgba(8,18,12,0.34)" />
        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
      </radialGradient>

      <radialGradient id={`${uid}-bud`} cx="38%" cy="30%" r="72%">
        <stop offset="0%" style={{ stopColor: 'var(--petal-tip)' }} />
        <stop offset="62%" style={{ stopColor: 'var(--petal-mid)' }} />
        <stop offset="100%" style={{ stopColor: 'var(--petal-base)' }} />
      </radialGradient>
    </defs>
  )
}
