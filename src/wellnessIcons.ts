import type { Pillar } from './reedad'

export type IconName = 'leaf' | 'move' | 'moon' | 'mind' | 'heart' | 'arrow' | 'back' | 'close' | 'check' | 'spark' | 'clock' | 'lock' | 'chart' | 'share' | 'download' | 'trophy'

export const pillarIcons: Record<Pillar, IconName> = {
  Nutrición: 'leaf', Movimiento: 'move', Descanso: 'moon', Mente: 'mind', Hábitos: 'heart',
}
