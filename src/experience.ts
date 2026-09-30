import { defaultQuestions, type Pillar } from './reedad'

export { levelMilestones } from './reedad'

export const recommendationFor: Record<Pillar, { category: string; message: string }> = {
  Nutrición: { category: 'Alimentación e hidratación', message: 'Conversá con un asesor sobre cómo acompañar una alimentación variada y tu rutina de hidratación.' },
  Movimiento: { category: 'Movimiento y recuperación', message: 'Contale a un asesor cómo te movés y qué querés mejorar. Juntos pueden explorar opciones para acompañar tu rutina.' },
  Descanso: { category: 'Descanso y rutina nocturna', message: 'Conversá con un asesor sobre tu rutina al final del día y las opciones de bienestar disponibles en tienda.' },
  Mente: { category: 'Pausas y bienestar diario', message: 'Contale a un asesor cómo es tu día y buscá acompañamiento para tus momentos de pausa.' },
  Hábitos: { category: 'Bienestar todos los días', message: 'Compartí tu reto con un asesor para explorar opciones que encajen con tu día a día.' },
}

export function pillarPresentation(pillar: Pillar, score: number) {
  const questions = defaultQuestions.filter((question) => question.pillar === pillar)
  const best = questions.reduce((sum, question) => sum + Math.min(...question.options.map((option) => option.score)), 0)
  const worst = questions.reduce((sum, question) => sum + Math.max(...question.options.map((option) => option.score)), 0)
  return {
    fill: Math.max(8, Math.min(100, ((worst - score) / (worst - best)) * 100)),
    tone: score <= 0 ? 'strong' : score <= 2 ? 'growing' : 'attention',
    label: score <= 0 ? 'Tu fortaleza' : score <= 2 ? 'Un pequeño ajuste' : 'Tu oportunidad',
  }
}

export function challengeDates(createdAt: string, now = Date.now()) {
  const start = new Date(createdAt).getTime()
  const next = new Date(start)
  next.setDate(next.getDate() + 30)
  return {
    elapsed: Math.max(0, Math.floor((now - start) / 86400000)),
    next,
    label: next.toLocaleDateString('es-SV', { day: 'numeric', month: 'long' }),
  }
}
