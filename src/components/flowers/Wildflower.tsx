import { useId } from 'react'
import { createStemGeometry } from '../../lib/botanica'
import { createRandom, hashString, round } from '../../lib/random'
import { FlowerGradients } from './FlowerGradients'
import { FlowerPetal } from './FlowerPetal'
import { FlowerStem, type LeafSpec } from './FlowerStem'

const WILDFLOWER_VIEWBOX = { width: 240, height: 660 }

const CX = WILDFLOWER_VIEWBOX.width / 2
const BASE = WILDFLOWER_VIEWBOX.height
const HEAD_Y = -452
const PETAL_COUNT = 8

interface WildflowerProps {
  seedKey: string
}

export function Wildflower({ seedKey }: WildflowerProps) {
  const uid = `wild${useId().replace(/[:]/g, '')}`
  const random = createRandom(hashString(seedKey))

  const sway = round(-20 + random() * 40, 1)
  const geometry = createStemGeometry(HEAD_Y, sway)
  const headTilt = round(-9 + random() * 18, 1)

  const steps = 360 / PETAL_COUNT
  const petals = Array.from({ length: PETAL_COUNT }, (_, index) => ({
    angle: round(steps * index + (random() - 0.5) * 11, 1),
    length: round(106 * (0.9 + random() * 0.18), 1),
    width: round(35 * (0.92 + random() * 0.16), 1),
  }))

  const leaves: LeafSpec[] = [
    { u: 0.22, angle: round(14 + random() * 12, 1), length: 124, width: 48 },
    { u: 0.4, angle: round(168 + random() * 12, 1), length: 108, width: 42 },
    { u: 0.58, angle: round(12 + random() * 14, 1), length: 88, width: 36 },
    { u: 0.74, angle: round(172 + random() * 10, 1), length: 66, width: 28 },
  ]

  return (
    <svg
      className="flower-svg flower-svg--wildflower"
      viewBox={`0 0 ${WILDFLOWER_VIEWBOX.width} ${WILDFLOWER_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <FlowerGradients uid={uid} stemTop={HEAD_Y} />
      <g transform={`translate(${CX} ${BASE})`}>
        <g data-anim className="plant">
          <FlowerStem uid={uid} geometry={geometry} leaves={leaves} thickness={9} />

          <g transform={`translate(0 ${HEAD_Y}) rotate(${headTilt})`}>
            <circle className="head-glow" r={140} fill={`url(#${uid}-glow)`} />
            <g data-anim className="head">
              {petals.map((petal, index) => (
                <g key={`petal-${index}`} transform={`rotate(${petal.angle})`}>
                  <FlowerPetal
                    shape="cosmos"
                    length={petal.length}
                    width={petal.width}
                    fill={`url(#${uid}-petal)`}
                  />
                </g>
              ))}
              <g data-anim className="head-core">
                <circle r={27} fill="none" stroke="var(--petal-tip)" strokeOpacity={0.22} strokeWidth={1.4} />
                <circle r={22} fill={`url(#${uid}-center)`} />
                <circle
                  r={18}
                  fill="none"
                  stroke="var(--center-light)"
                  strokeOpacity={0.55}
                  strokeWidth={2.4}
                  strokeLinecap="round"
                  strokeDasharray="1.8 3.4"
                />
                <circle
                  r={11}
                  fill="none"
                  stroke="var(--petal-tip)"
                  strokeOpacity={0.4}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeDasharray="1.4 3.6"
                />
                <path
                  d="M-15 -15 A 21 21 0 0 1 8 -20"
                  stroke="var(--petal-edge)"
                  strokeOpacity={0.4}
                  strokeWidth={2.2}
                  strokeLinecap="round"
                  fill="none"
                />
                <circle r={22} fill={`url(#${uid}-shade)`} />
              </g>
              <ellipse rx={126} ry={118} fill={`url(#${uid}-wash)`} style={{ mixBlendMode: 'screen' }} />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
