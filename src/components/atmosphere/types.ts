export type PetalPhase = 'idle' | 'drift' | 'converge' | 'disperse' | 'ambient'

export interface PetalDirector {
  phase: PetalPhase
  setPhase: (phase: PetalPhase) => void
  setDensity: (count: number) => void
}
