import type { FlowerSpec, GardenLayer, LayoutSpec } from '../../config/gardenLayout'
import { PLANT_ASPECT } from '../../config/gardenLayout'
import { Blossom } from './Blossom'
import { Bud } from './Bud'
import { GrassTuft } from './GrassTuft'
import { Sunflower } from './Sunflower'
import { Wildflower } from './Wildflower'
import './flowers.css'

const PLANTS = {
  sunflower: Sunflower,
  wildflower: Wildflower,
  blossom: Blossom,
  bud: Bud,
  grass: GrassTuft,
} as const

const LAYERS: GardenLayer[] = ['far', 'mid', 'near']

function FlowerSlot({ spec }: { spec: FlowerSpec }) {
  const Plant = PLANTS[spec.variant]
  const width = spec.height * PLANT_ASPECT[spec.variant]

  return (
    <div
      className={`flower flower--${spec.variant} pal-${spec.palette}`}
      data-flower-id={spec.id}
      data-flower-variant={spec.variant}
      data-flower-delay={spec.delay}
      style={{
        left: `${spec.x}%`,
        bottom: `${spec.ground}%`,
        width: `${width}vh`,
        height: `${spec.height}vh`,
        marginLeft: `${-width / 2}vh`,
      }}
    >
      <div
        className="flower-tilt"
        style={{
          transform: `rotate(${spec.rotation}deg)${spec.flip ? ' scaleX(-1)' : ''}`,
        }}
      >
        <Plant seedKey={spec.id} />
      </div>
    </div>
  )
}

interface FlowerGardenProps {
  layout: LayoutSpec
}

export function FlowerGarden({ layout }: FlowerGardenProps) {
  return (
    <div className="garden" data-garden aria-hidden="true">
      {LAYERS.map((layer, index) => {
        const flowers = layout.flowers
          .filter((flower) => flower.layer === layer)
          .sort((a, b) => b.ground - a.ground)

        return (
          <div className="garden-group" key={layer}>
            <div className={`garden-layer garden-layer--${layer}`} data-garden-layer={layer}>
              {flowers.map((spec) => (
                <FlowerSlot key={spec.id} spec={spec} />
              ))}
            </div>
            {index < LAYERS.length - 1 ? (
              <div className={`garden-depth garden-depth--${index}`} />
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
