import { useId } from 'react'
import { bladePath } from '../../lib/botanica'
import { createRandom, hashString, round } from '../../lib/random'
import { FlowerGradients } from './FlowerGradients'

const GRASS_VIEWBOX = { width: 420, height: 340 }

const CX = GRASS_VIEWBOX.width / 2
const BASE = GRASS_VIEWBOX.height
const BLADE_COUNT = 9

interface GrassTuftProps {
  seedKey: string
}

export function GrassTuft({ seedKey }: GrassTuftProps) {
  const uid = `grass${useId().replace(/[:]/g, '')}`
  const random = createRandom(hashString(seedKey))

  const blades = Array.from({ length: BLADE_COUNT }, (_, index) => {
    const side = index % 2 === 0 ? -1 : 1
    return {
      x: round(side * (4 + random() * 26), 1),
      height: round(170 + random() * 130, 1),
      bend: round((random() * 2 - 1) * 74, 1),
      angle: round((random() * 2 - 1) * 10, 1),
      width: round(11 + random() * 8, 1),
    }
  }).sort((a, b) => b.height - a.height)

  return (
    <svg
      className="flower-svg flower-svg--grass"
      viewBox={`0 0 ${GRASS_VIEWBOX.width} ${GRASS_VIEWBOX.height}`}
      preserveAspectRatio="xMidYMax meet"
      aria-hidden="true"
      focusable="false"
    >
      <FlowerGradients uid={uid} stemTop={-300} />
      <g transform={`translate(${CX} ${BASE})`}>
        <g data-anim className="plant">
          {blades.map((blade, index) => (
            <g key={`blade-${index}`} transform={`translate(${blade.x} 0) rotate(${blade.angle})`}>
              <g data-anim className="blade">
                <path
                  d={bladePath(blade.height, blade.bend, blade.width)}
                  fill={`url(#${uid}-leaf)`}
                  stroke="var(--leaf-shadow)"
                  strokeOpacity={0.3}
                  strokeWidth={1}
                />
              </g>
            </g>
          ))}
        </g>
      </g>
    </svg>
  )
}
