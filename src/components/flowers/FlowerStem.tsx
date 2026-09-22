import { leafPath, leafSideVeinPaths, leafVeinPath, type StemGeometry } from '../../lib/botanica'
import { round } from '../../lib/random'

export interface LeafSpec {
  /** Posición a lo largo del tallo, 0 (base) → 1 (punta). */
  u: number
  angle: number
  length: number
  width: number
}

interface FlowerStemProps {
  uid: string
  geometry: StemGeometry
  leaves: LeafSpec[]
  thickness?: number
  veins?: boolean
}

export function FlowerStem({ uid, geometry, leaves, thickness = 14, veins = true }: FlowerStemProps) {
  return (
    <>
      <g className="leaves">
        {leaves.map((leaf, index) => {
          const point = geometry.pointAt(leaf.u)
          return (
            <g
              key={`${index}-${leaf.u}`}
              transform={`translate(${round(point.x)} ${round(point.y)}) rotate(${leaf.angle})`}
            >
              <g data-anim className="leaf">
                <path
                  d={leafPath(leaf.length, leaf.width)}
                  fill={`url(#${uid}-leaf)`}
                  stroke="var(--leaf-shadow)"
                  strokeOpacity={0.35}
                  strokeWidth={1}
                />
                {veins ? (
                  <>
                    <path
                      d={leafVeinPath(leaf.length, leaf.width)}
                      className="leaf-vein"
                      stroke="var(--leaf-light)"
                      strokeOpacity={0.3}
                      strokeWidth={1.4}
                      fill="none"
                    />
                    {leafSideVeinPaths(leaf.length, leaf.width, 2).map((d, veinIndex) => (
                      <path
                        key={veinIndex}
                        d={d}
                        stroke="var(--leaf-light)"
                        strokeOpacity={0.16}
                        strokeWidth={1}
                        fill="none"
                      />
                    ))}
                  </>
                ) : null}
              </g>
            </g>
          )
        })}
      </g>

      <path
        className="stem"
        d={geometry.path}
        fill="none"
        stroke="var(--leaf-shadow)"
        strokeOpacity={0.5}
        strokeWidth={thickness + 3}
        strokeLinecap="round"
      />
      <path
        className="stem"
        d={geometry.path}
        fill="none"
        stroke={`url(#${uid}-stem)`}
        strokeWidth={thickness}
        strokeLinecap="round"
      />
      <path
        d={geometry.path}
        fill="none"
        stroke="var(--leaf-light)"
        strokeOpacity={0.28}
        strokeWidth={thickness * 0.22}
        strokeLinecap="round"
        transform={`translate(${-thickness * 0.26} 0)`}
      />
    </>
  )
}
