import { useId } from 'react'
import { createStemGeometry } from '../../lib/botanica'
import { createRandom, hashString, round } from '../../lib/random'
import { FlowerGradients } from './FlowerGradients'
import { FlowerPetal } from './FlowerPetal'
import { FlowerStem, type LeafSpec } from './FlowerStem'

const SUNFLOWER_VIEWBOX = { width: 340, height: 820 }

const CX = SUNFLOWER_VIEWBOX.width / 2
const BASE = SUNFLOWER_VIEWBOX.height
const HEAD_Y = -580
const OUTER_COUNT = 18
const INNER_COUNT = 13
const FLORET_RINGS = [58, 50, 42, 34, 26, 18, 10]

interface SunflowerProps {
  seedKey: string
}

export function Sunflower({ seedKey }: SunflowerProps) {
  const uid = `sun${useId().replace(/[:]/g, '')}`
  const random = createRandom(hashString(seedKey))

  const sway = round(-16 + random() * 32, 1)
  const geometry = createStemGeometry(HEAD_Y, sway)
  const headTilt = round(-4 + random() * 8, 1)

  const outerSteps = 360 / OUTER_COUNT
  const outer = Array.from({ length: OUTER_COUNT }, (_, index) => ({
    angle: round(outerSteps * index + (random() - 0.5) * 7, 1),
    length: round(150 * (0.93 + random() * 0.14), 1),
    width: round(48 * (0.94 + random() * 0.12), 1),
  }))

  const innerSteps = 360 / INNER_COUNT
  const inner = Array.from({ length: INNER_COUNT }, (_, index) => ({
    angle: round(innerSteps * index + innerSteps / 2 + (random() - 0.5) * 8, 1),
    length: round(116 * (0.9 + random() * 0.14), 1),
    width: round(43 * (0.93 + random() * 0.12), 1),
  }))

  const bracts = Array.from({ length: 7 }, (_, index) => ({
    angle: round(-90 + (360 / 7) * index + (random() - 0.5) * 10, 1),
    length: round(96 * (0.9 + random() * 0.2), 1),
  }))

  const leaves: LeafSpec[] = [
    { u: 0.24, angle: round(10 + random() * 10, 1), length: 152, width: 76 },
    { u: 0.42, angle: round(166 + random() * 12, 1), length: 138, width: 68 },
    { u: 0.6, angle: round(16 + random() * 12, 1), length: 116, width: 58 },
    { u: 0.75, angle: round(170 + random() * 14, 1), length: 92, width: 48 },
  ]

  return (
    <svg
      className="flower-svg flower-svg--sunflower"
      viewBox={`0 0 ${SUNFLOWER_VIEWBOX.width} ${SUNFLOWER_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <FlowerGradients uid={uid} stemTop={HEAD_Y} />
      <g transform={`translate(${CX} ${BASE})`}>
        <g data-anim className="plant">
          <FlowerStem uid={uid} geometry={geometry} leaves={leaves} thickness={15} />

          <g transform={`translate(0 ${HEAD_Y}) rotate(${headTilt})`}>
            <circle className="head-glow" r={210} fill={`url(#${uid}-glow)`} />
            <g data-anim className="head">
              <g data-anim className="head-core">
                {bracts.map((bract, index) => (
                  <g key={`bract-${index}`} transform={`rotate(${bract.angle})`}>
                    <path
                      className="bract"
                      d={`M0 0 C -12 -${round(bract.length * 0.3)} -10 -${round(bract.length * 0.72)} 0 -${bract.length} C 10 -${round(bract.length * 0.72)} 12 -${round(bract.length * 0.3)} 0 0 Z`}
                      fill="var(--leaf-mid)"
                      opacity={0.9}
                    />
                  </g>
                ))}
              </g>

              {outer.map((petal, index) => (
                <g key={`outer-${index}`} transform={`rotate(${petal.angle})`}>
                  <FlowerPetal
                    length={petal.length}
                    width={petal.width}
                    fill={`url(#${uid}-petal)`}
                    ribColor="var(--petal-edge)"
                  />
                </g>
              ))}

              {inner.map((petal, index) => (
                <g key={`inner-${index}`} transform={`rotate(${petal.angle})`}>
                  <FlowerPetal
                    length={petal.length}
                    width={petal.width}
                    fill={`url(#${uid}-petal-back)`}
                    ribColor="var(--petal-back-tip)"
                    ring="inner"
                  />
                </g>
              ))}

              <g data-anim className="head-core">
                <circle r={64} fill="var(--center-line)" opacity={0.55} />
                <circle r={62} fill={`url(#${uid}-center)`} />
                {FLORET_RINGS.map((radius, index) => (
                  <circle
                    key={`ring-${radius}`}
                    r={radius}
                    fill="none"
                    stroke={index % 2 === 0 ? 'var(--center-mid)' : 'var(--center-light)'}
                    strokeOpacity={0.3 + index * 0.045}
                    strokeWidth={1.6}
                    strokeLinecap="round"
                    strokeDasharray={`${round(2.1 + index * 0.22)} ${round(3.2 + index * 0.24)}`}
                  />
                ))}
                <path
                  d="M-44 -44 A 62 62 0 0 1 20 -58"
                  stroke="var(--petal-edge)"
                  strokeOpacity={0.34}
                  strokeWidth={3.4}
                  strokeLinecap="round"
                  fill="none"
                />
                <circle r={62} fill={`url(#${uid}-shade)`} />
                <circle r={64} fill="none" stroke="var(--center-line)" strokeOpacity={0.7} strokeWidth={2.5} />
              </g>

              <ellipse
                rx={196}
                ry={182}
                fill={`url(#${uid}-wash)`}
                style={{ mixBlendMode: 'screen' }}
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
