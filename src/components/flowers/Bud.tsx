import { useId } from 'react'
import { createStemGeometry, petalPath } from '../../lib/botanica'
import { createRandom, hashString, round } from '../../lib/random'
import { FlowerGradients } from './FlowerGradients'
import { FlowerPetal } from './FlowerPetal'
import { FlowerStem, type LeafSpec } from './FlowerStem'

const BUD_VIEWBOX = { width: 180, height: 500 }

const CX = BUD_VIEWBOX.width / 2
const BASE = BUD_VIEWBOX.height
const HEAD_Y = -318
const OPEN_PETALS = 6

interface BudProps {
  seedKey: string
}

export function Bud({ seedKey }: BudProps) {
  const uid = `bud${useId().replace(/[:]/g, '')}`
  const random = createRandom(hashString(seedKey))

  const geometry = createStemGeometry(HEAD_Y, round(-18 + random() * 36, 1))
  const headTilt = round(-6 + random() * 12, 1)

  const leaves: LeafSpec[] = [
    { u: 0.26, angle: round(16 + random() * 14, 1), length: 86, width: 36 },
    { u: 0.54, angle: round(166 + random() * 12, 1), length: 68, width: 30 },
  ]

  return (
    <svg
      className="flower-svg flower-svg--bud"
      viewBox={`0 0 ${BUD_VIEWBOX.width} ${BUD_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <FlowerGradients uid={uid} stemTop={HEAD_Y} />
      <g transform={`translate(${CX} ${BASE})`}>
        <g data-anim className="plant">
          <FlowerStem uid={uid} geometry={geometry} leaves={leaves} thickness={8} />

          <g transform={`translate(0 ${HEAD_Y}) rotate(${headTilt})`}>
            <circle className="head-glow" r={110} fill={`url(#${uid}-glow)`} />

            <g data-anim className="bud-closed">
              {[-40, 40].map((angle) => (
                <g key={`sepal-${angle}`} transform={`rotate(${angle})`}>
                  <path
                    d={petalPath('teardrop', 78, 32)}
                    fill="var(--leaf-mid)"
                    stroke="var(--leaf-shadow)"
                    strokeOpacity={0.4}
                    strokeWidth={1}
                  />
                </g>
              ))}
              {[-19, 0, 19].map((angle, index) => (
                <g key={`bud-petal-${angle}`} transform={`rotate(${angle})`}>
                  <path
                    d={petalPath('teardrop', index === 1 ? 66 : 60, index === 1 ? 40 : 36)}
                    fill={`url(#${uid}-bud)`}
                    stroke="var(--petal-base)"
                    strokeOpacity={0.45}
                    strokeWidth={1}
                  />
                </g>
              ))}
              <path
                d="M-9 -6 Q0 -30 9 -6"
                stroke="var(--petal-edge)"
                strokeOpacity={0.35}
                strokeWidth={1.4}
                fill="none"
              />
            </g>

            <g data-anim className="bud-open">
              {Array.from({ length: OPEN_PETALS }, (_, index) => (
                <g key={`open-${index}`} transform={`rotate(${(360 / OPEN_PETALS) * index})`}>
                  <FlowerPetal
                    shape="round"
                    length={54}
                    width={42}
                    fill={`url(#${uid}-petal)`}
                    rib={false}
                  />
                </g>
              ))}
              <circle r={10} fill={`url(#${uid}-center)`} />
              <circle
                r={13}
                fill="none"
                stroke="var(--center-light)"
                strokeOpacity={0.6}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeDasharray="1.4 2.8"
              />
              <path
                d="M-8 -8 A 11 11 0 0 1 4 -11"
                stroke="var(--petal-edge)"
                strokeOpacity={0.4}
                strokeWidth={1.6}
                strokeLinecap="round"
                fill="none"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
