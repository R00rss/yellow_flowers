import { petalPath, type PetalShape } from '../../lib/botanica'

interface FlowerPetalProps {
  shape?: PetalShape
  length: number
  width: number
  /** Ángulo estático dentro de la corola. El timeline lo usa como destino. */
  angle?: number
  fill: string
  rib?: boolean
  ribColor?: string
  ring?: 'outer' | 'inner'
}

export function FlowerPetal({
  shape = 'lanceolate',
  length,
  width,
  angle = 0,
  fill,
  rib = true,
  ribColor = 'var(--petal-edge)',
  ring = 'outer',
}: FlowerPetalProps) {
  return (
    <g
      data-anim
      className="petal"
      data-angle={angle}
      data-ring={ring}
    >
      <path d={petalPath(shape, length, width)} fill={fill} />
      {rib ? (
        <path
          d={`M0 ${-length * 0.1} L0 ${-length * 0.84}`}
          stroke={ribColor}
          strokeOpacity={0.28}
          strokeWidth={length > 80 ? 2.2 : 1.4}
          strokeLinecap="round"
          fill="none"
        />
      ) : null}
    </g>
  )
}
