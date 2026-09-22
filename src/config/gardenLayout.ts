export type FlowerVariant = 'sunflower' | 'wildflower' | 'blossom' | 'bud' | 'grass'
export type GardenLayer = 'far' | 'mid' | 'near'

export interface FlowerSpec {
  id: string
  variant: FlowerVariant
  layer: GardenLayer
  /** Posición horizontal, % del ancho. */
  x: number
  /** Altura de la base del tallo, % desde el borde inferior. */
  ground: number
  /** Altura total de la planta, % de la altura del viewport. */
  height: number
  /** Orden de aparición dentro de la ventana de floración (0 → 1). */
  delay: number
  /** Variación de color (0–3). */
  palette: number
  /** Inclinación en grados. */
  rotation: number
  /** Reflejo horizontal. */
  flip?: boolean
}

export interface AtmosphereSpec {
  petals: number
  pollen: number
  petalScale: number
}

export interface LayoutSpec {
  flowers: FlowerSpec[]
  atmosphere: AtmosphereSpec
}

/** Relación ancho/alto de cada ilustración (coincide con su viewBox). */
export const PLANT_ASPECT: Record<FlowerVariant, number> = {
  sunflower: 340 / 820,
  wildflower: 240 / 660,
  blossom: 320 / 560,
  bud: 180 / 500,
  grass: 420 / 340,
}

const desktopFlowers: FlowerSpec[] = [
  // --- Fondo: pequeño, brumoso, casi un eco del jardín -------------------
  { id: 'f-grass-1', variant: 'grass', layer: 'far', x: 3, ground: 22, height: 15, delay: 0.06, palette: 0, rotation: -2 },
  { id: 'f-sun-1', variant: 'sunflower', layer: 'far', x: 7, ground: 26, height: 27, delay: 0.12, palette: 1, rotation: -5 },
  { id: 'f-wild-1', variant: 'wildflower', layer: 'far', x: 16, ground: 25, height: 21, delay: 0.18, palette: 0, rotation: 4 },
  { id: 'f-blossom-1', variant: 'blossom', layer: 'far', x: 25, ground: 24.5, height: 15, delay: 0.1, palette: 2, rotation: -3 },
  { id: 'f-grass-2', variant: 'grass', layer: 'far', x: 34, ground: 23, height: 12, delay: 0.04, palette: 1, rotation: 2, flip: true },
  { id: 'f-sun-2', variant: 'sunflower', layer: 'far', x: 38, ground: 27.5, height: 23, delay: 0.3, palette: 2, rotation: 6 },
  { id: 'f-wild-2', variant: 'wildflower', layer: 'far', x: 50, ground: 26, height: 19, delay: 0.24, palette: 1, rotation: -6 },
  { id: 'f-blossom-2', variant: 'blossom', layer: 'far', x: 62, ground: 25, height: 16, delay: 0.14, palette: 0, rotation: 3, flip: true },
  { id: 'f-sun-3', variant: 'sunflower', layer: 'far', x: 74, ground: 27, height: 24, delay: 0.34, palette: 0, rotation: -4 },
  { id: 'f-wild-3', variant: 'wildflower', layer: 'far', x: 88, ground: 25.5, height: 22, delay: 0.28, palette: 2, rotation: 5 },
  { id: 'f-blossom-3', variant: 'blossom', layer: 'far', x: 96, ground: 24, height: 14, delay: 0.2, palette: 3, rotation: -2 },
  { id: 'f-grass-3', variant: 'grass', layer: 'far', x: 68, ground: 22.5, height: 13, delay: 0.08, palette: 2, rotation: -2 },

  // --- Plano medio: el corazón del jardín --------------------------------
  { id: 'm-sun-1', variant: 'sunflower', layer: 'mid', x: 9, ground: 10, height: 56, delay: 0.42, palette: 1, rotation: -7 },
  { id: 'm-wild-1', variant: 'wildflower', layer: 'mid', x: 18, ground: 7, height: 44, delay: 0.5, palette: 0, rotation: 5 },
  { id: 'm-grass-1', variant: 'grass', layer: 'mid', x: 23, ground: 6, height: 19, delay: 0.24, palette: 3, rotation: 2 },
  { id: 'm-blossom-1', variant: 'blossom', layer: 'mid', x: 29, ground: 6, height: 27, delay: 0.36, palette: 2, rotation: -4 },
  { id: 'm-bud-1', variant: 'bud', layer: 'mid', x: 34, ground: 6, height: 31, delay: 0.86, palette: 1, rotation: -3, flip: true },
  { id: 'm-sun-2', variant: 'sunflower', layer: 'mid', x: 39, ground: 5, height: 29, delay: 0.58, palette: 2, rotation: 8 },
  { id: 'm-grass-2', variant: 'grass', layer: 'mid', x: 45, ground: 5, height: 16, delay: 0.16, palette: 1, rotation: -2, flip: true },
  { id: 'm-wild-2', variant: 'wildflower', layer: 'mid', x: 51, ground: 4, height: 26, delay: 0.66, palette: 3, rotation: -5 },
  { id: 'm-grass-3', variant: 'grass', layer: 'mid', x: 57, ground: 5.5, height: 17, delay: 0.2, palette: 2, rotation: 3 },
  { id: 'm-sun-3', variant: 'sunflower', layer: 'mid', x: 62, ground: 5, height: 30, delay: 0.62, palette: 0, rotation: -9 },
  { id: 'm-bud-2', variant: 'bud', layer: 'mid', x: 67, ground: 5.5, height: 29, delay: 0.92, palette: 2, rotation: 4 },
  { id: 'm-blossom-2', variant: 'blossom', layer: 'mid', x: 72, ground: 6.5, height: 24, delay: 0.4, palette: 0, rotation: 6, flip: true },
  { id: 'm-wild-3', variant: 'wildflower', layer: 'mid', x: 81, ground: 8, height: 46, delay: 0.54, palette: 1, rotation: -5 },
  { id: 'm-grass-4', variant: 'grass', layer: 'mid', x: 76, ground: 7, height: 20, delay: 0.28, palette: 0, rotation: -3 },
  { id: 'm-sun-4', variant: 'sunflower', layer: 'mid', x: 92, ground: 9, height: 58, delay: 0.46, palette: 1, rotation: 7 },

  // --- Primer plano: siluetas grandes que enmarcan la escena --------------
  { id: 'n-grass-1', variant: 'grass', layer: 'near', x: 6, ground: -2, height: 36, delay: 0.02, palette: 3, rotation: -3 },
  { id: 'n-sun-1', variant: 'sunflower', layer: 'near', x: 1, ground: -4, height: 84, delay: 0.1, palette: 3, rotation: -11 },
  { id: 'n-grass-3', variant: 'grass', layer: 'near', x: 17, ground: -4, height: 26, delay: 0.06, palette: 3, rotation: 3, flip: true },
  { id: 'n-blossom-1', variant: 'blossom', layer: 'near', x: 26, ground: -3, height: 19, delay: 0.09, palette: 3, rotation: -5 },
  { id: 'n-grass-4', variant: 'grass', layer: 'near', x: 37, ground: -4, height: 21, delay: 0.03, palette: 3, rotation: -2 },
  { id: 'n-blossom-2', variant: 'blossom', layer: 'near', x: 47, ground: -3.5, height: 16, delay: 0.12, palette: 3, rotation: 4, flip: true },
  { id: 'n-grass-5', variant: 'grass', layer: 'near', x: 58, ground: -4, height: 23, delay: 0.07, palette: 3, rotation: 3, flip: true },
  { id: 'n-blossom-3', variant: 'blossom', layer: 'near', x: 69, ground: -3, height: 18, delay: 0.05, palette: 3, rotation: -4 },
  { id: 'n-grass-6', variant: 'grass', layer: 'near', x: 79, ground: -4, height: 27, delay: 0.04, palette: 3, rotation: -3 },
  { id: 'n-wild-1', variant: 'wildflower', layer: 'near', x: 97, ground: -3, height: 72, delay: 0.14, palette: 3, rotation: 10, flip: true },
  { id: 'n-grass-2', variant: 'grass', layer: 'near', x: 93, ground: -2, height: 40, delay: 0.05, palette: 3, rotation: 4, flip: true },
]

const mobileFlowers: FlowerSpec[] = [
  // --- Fondo -------------------------------------------------------------
  { id: 'f-grass-1', variant: 'grass', layer: 'far', x: 5, ground: 21, height: 11, delay: 0.06, palette: 0, rotation: -2 },
  { id: 'f-sun-1', variant: 'sunflower', layer: 'far', x: 15, ground: 24, height: 22, delay: 0.14, palette: 1, rotation: -5 },
  { id: 'f-blossom-1', variant: 'blossom', layer: 'far', x: 31, ground: 23, height: 13, delay: 0.1, palette: 2, rotation: -3 },
  { id: 'f-wild-1', variant: 'wildflower', layer: 'far', x: 49, ground: 24.5, height: 17, delay: 0.22, palette: 0, rotation: 4 },
  { id: 'f-blossom-2', variant: 'blossom', layer: 'far', x: 67, ground: 23, height: 12, delay: 0.18, palette: 0, rotation: 3, flip: true },
  { id: 'f-wild-2', variant: 'wildflower', layer: 'far', x: 85, ground: 24, height: 19, delay: 0.3, palette: 2, rotation: -4 },
  { id: 'f-grass-2', variant: 'grass', layer: 'far', x: 94, ground: 21, height: 12, delay: 0.04, palette: 1, rotation: 3, flip: true },

  // --- Plano medio -------------------------------------------------------
  { id: 'm-sun-1', variant: 'sunflower', layer: 'mid', x: 8, ground: 8, height: 40, delay: 0.44, palette: 1, rotation: -8 },
  { id: 'm-wild-1', variant: 'wildflower', layer: 'mid', x: 22, ground: 6, height: 28, delay: 0.52, palette: 0, rotation: 4 },
  { id: 'm-grass-1', variant: 'grass', layer: 'mid', x: 15, ground: 4, height: 15, delay: 0.2, palette: 3, rotation: 2 },
  { id: 'm-blossom-1', variant: 'blossom', layer: 'mid', x: 34, ground: 4, height: 18, delay: 0.36, palette: 2, rotation: -3 },
  { id: 'm-bud-1', variant: 'bud', layer: 'mid', x: 43, ground: 4, height: 23, delay: 0.88, palette: 1, rotation: -4, flip: true },
  { id: 'm-wild-2', variant: 'wildflower', layer: 'mid', x: 55, ground: 3.5, height: 18, delay: 0.6, palette: 3, rotation: 5 },
  { id: 'm-sun-2', variant: 'sunflower', layer: 'mid', x: 70, ground: 4, height: 23, delay: 0.64, palette: 0, rotation: -6 },
  { id: 'm-wild-3', variant: 'wildflower', layer: 'mid', x: 84, ground: 6, height: 31, delay: 0.5, palette: 1, rotation: -4 },
  { id: 'm-grass-2', variant: 'grass', layer: 'mid', x: 63, ground: 4, height: 14, delay: 0.26, palette: 0, rotation: -3 },
  { id: 'm-sun-3', variant: 'sunflower', layer: 'mid', x: 94, ground: 7, height: 45, delay: 0.46, palette: 2, rotation: 9 },

  // --- Primer plano ------------------------------------------------------
  { id: 'n-grass-1', variant: 'grass', layer: 'near', x: 4, ground: -2, height: 26, delay: 0.02, palette: 3, rotation: -3 },
  { id: 'n-sun-1', variant: 'sunflower', layer: 'near', x: -3, ground: -4, height: 58, delay: 0.1, palette: 3, rotation: -11 },
  { id: 'n-grass-3', variant: 'grass', layer: 'near', x: 20, ground: -4, height: 20, delay: 0.06, palette: 3, rotation: 3, flip: true },
  { id: 'n-blossom-1', variant: 'blossom', layer: 'near', x: 33, ground: -3, height: 15, delay: 0.09, palette: 3, rotation: -5 },
  { id: 'n-grass-4', variant: 'grass', layer: 'near', x: 66, ground: -4, height: 18, delay: 0.04, palette: 3, rotation: -3 },
  { id: 'n-blossom-2', variant: 'blossom', layer: 'near', x: 78, ground: -3, height: 14, delay: 0.12, palette: 3, rotation: 4, flip: true },
  { id: 'n-grass-2', variant: 'grass', layer: 'near', x: 96, ground: -2, height: 28, delay: 0.05, palette: 3, rotation: 4, flip: true },
  { id: 'n-wild-1', variant: 'wildflower', layer: 'near', x: 103, ground: -3, height: 50, delay: 0.14, palette: 3, rotation: 9, flip: true },
]

export const gardenLayout: Record<'desktop' | 'mobile', LayoutSpec> = {
  desktop: {
    flowers: desktopFlowers,
    atmosphere: { petals: 26, pollen: 68, petalScale: 1 },
  },
  mobile: {
    flowers: mobileFlowers,
    atmosphere: { petals: 14, pollen: 34, petalScale: 0.82 },
  },
}
