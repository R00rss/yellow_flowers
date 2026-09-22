import type { AtmosphereSpec, LayoutSpec } from '../../config/gardenLayout'
import { AtmosphericLighting, AtmosphericVignette } from '../atmosphere/AtmosphericLighting'
import { FloatingPetals } from '../atmosphere/FloatingPetals'
import type { PetalDirector } from '../atmosphere/types'
import { FlowerGarden } from '../flowers/FlowerGarden'

interface GardenSceneProps {
  layout: LayoutSpec
  atmosphere: AtmosphereSpec
  reducedMotion: boolean
  onDirectorReady: (director: PetalDirector) => void
}

export function GardenScene({
  layout,
  atmosphere,
  reducedMotion,
  onDirectorReady,
}: GardenSceneProps) {
  return (
    <>
      <div className="experience-layer experience-layer--backdrop">
        <AtmosphericLighting />
      </div>

      <div className="experience-layer experience-layer--garden">
        <FlowerGarden layout={layout} />
      </div>

      <div className="experience-layer experience-layer--petals">
        <FloatingPetals
          atmosphere={atmosphere}
          reducedMotion={reducedMotion}
          onReady={onDirectorReady}
        />
      </div>

      <div className="experience-layer experience-layer--vignette">
        <AtmosphericVignette />
      </div>
    </>
  )
}
