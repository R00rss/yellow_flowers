import { useId } from 'react'
import { createStemGeometry, petalPath } from '../../lib/botanica'
import { createRandom, hashString, round } from '../../lib/random'
import { FlowerGradients } from './FlowerGradients'
import { FlowerPetal } from './FlowerPetal'
import { FlowerStem, type LeafSpec } from './FlowerStem'

const BLOSSOM_VIEWBOX = { width: 320, height: 560 }

const CX = BLOSSOM_VIEWBOX.width / 2
const BASE = BLOSSOM_VIEWBOX.height
const BRANCH_TOP = -430
const MINI_PETALS = 5

interface BlossomProps {
  seedKey: string
}

export function Blossom({ seedKey }: BlossomProps) {
  const uid = `blos${useId().replace(/[:]/g, '')}`
  const random = createRandom(hashString(seedKey))

  const geometry = createStemGeometry(BRANCH_TOP, round(-34 + random() * 68, 1), 0.62)

  const clusters = [0.2, 0.33, 0.47, 0.62, 0.76, 0.9].map((base, index) => {
    const u = Math.max(0.08, Math.min(0.98, base + (random() - 0.5) * 0.07))
    const point = geometry.pointAt(u)
    const direction = index % 2 === 0 ? 1 : -1
    const spread = round(48 + random() * 32, 1)
    const pedicel = round(30 + random() * 22, 1)
    const headAngle = spread * direction
    const radians = ((headAngle - 90) * Math.PI) / 180
    return {
      u,
      size: round(0.72 + random() * 0.62, 2),
      x: round(point.x + Math.cos(radians) * pedicel, 1),
      y: round(point.y + Math.sin(radians) * pedicel, 1),
      baseX: round(point.x, 1),
      baseY: round(point.y, 1),
      headAngle: round(headAngle * 0.6, 1),
      pedicel,
    }
  })

  const leaves: LeafSpec[] = [
    { u: 0.1, angle: round(26 + random() * 14, 1), length: 108, width: 54 },
    { u: 0.28, angle: round(154 + random() * 16, 1), length: 92, width: 44 },
    { u: 0.5, angle: round(22 + random() * 14, 1), length: 74, width: 36 },
    { u: 0.74, angle: round(160 + random() * 14, 1), length: 58, width: 28 },
  ]

  return (
    <svg
      className="flower-svg flower-svg--blossom"
      viewBox={`0 0 ${BLOSSOM_VIEWBOX.width} ${BLOSSOM_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <FlowerGradients uid={uid} stemTop={BRANCH_TOP} />
      <g transform={`translate(${CX} ${BASE})`}>
        <g data-anim className="plant">
          {clusters.map((cluster, index) => {
            const radians = ((cluster.headAngle - 90) * Math.PI) / 180
            const tipX = cluster.baseX + Math.cos(radians) * cluster.pedicel
            const tipY = cluster.baseY + Math.sin(radians) * cluster.pedicel
            return (
              <g
                key={`cluster-${index}`}
                transform={`translate(${cluster.baseX} ${cluster.baseY})`}
              >
                <path
                  className="pedicel"
                  d={`M0 0 Q${round((tipX - cluster.baseX) * 0.4)} ${round((tipY - cluster.baseY) * 0.7)} ${round(tipX - cluster.baseX)} ${round(tipY - cluster.baseY)}`}
                  fill="none"
                  stroke="var(--leaf-mid)"
                  strokeWidth={3.4}
                  strokeLinecap="round"
                />
                <g transform={`translate(${round(tipX - cluster.baseX)} ${round(tipY - cluster.baseY)}) rotate(${cluster.headAngle})`}>
                  <g data-anim className="mini" data-size={cluster.size}>
                    <circle r={52 * cluster.size} fill={`url(#${uid}-glow)`} opacity={0.7} />
                    {Array.from({ length: MINI_PETALS }, (_, petalIndex) => (
                      <g key={`mini-petal-${petalIndex}`} transform={`rotate(${(360 / MINI_PETALS) * petalIndex + cluster.x * 0.3})`}>
                        <FlowerPetal
                          shape="round"
                          length={48 * cluster.size}
                          width={41 * cluster.size}
                          fill={`url(#${uid}-petal)`}
                          rib={false}
                        />
                      </g>
                    ))}
                    <circle
                      r={7.4 * cluster.size}
                      fill={`url(#${uid}-center)`}
                      stroke="var(--petal-base)"
                      strokeOpacity={0.5}
                      strokeWidth={1.2}
                    />
                  </g>
                </g>
              </g>
            )
          })}

          <g transform={`translate(${round(geometry.pointAt(1).x)} ${BRANCH_TOP})`}>
            <path
              className="tip-bud"
              d={petalPath('teardrop', 34, 20)}
              fill={`url(#${uid}-bud)`}
              transform="rotate(-14) translate(0 34)"
            />
          </g>

          <FlowerStem uid={uid} geometry={geometry} leaves={leaves} thickness={8} />
        </g>
      </g>
    </svg>
  )
}
