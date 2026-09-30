export type Pillar = 'Nutrición' | 'Movimiento' | 'Descanso' | 'Mente' | 'Hábitos'

export type Option = { label: string; score: number }
export type Question = {
  id: string
  pillar: Pillar
  prompt: string
  options: Option[]
}

export type Focus = 'Energía' | 'Dormir mejor' | 'Peso' | 'Defensas'

export type ResultProfile = {
  name: string
  message: string
  color: string
}

export const defaultQuestions: Question[] = [
  { id: 'fruits', pillar: 'Nutrición', prompt: '¿Cuántas porciones de frutas y verduras comés al día?', options: [{ label: '5 o más', score: -2 }, { label: '3 o 4', score: -1 }, { label: '1 o 2', score: 1 }, { label: 'Casi ninguna', score: 2 }] },
  { id: 'water', pillar: 'Nutrición', prompt: '¿Cuánta agua tomás al día?', options: [{ label: '8 vasos o más', score: -1 }, { label: '5 a 7', score: 0 }, { label: '2 a 4', score: 1 }, { label: 'Más gaseosa que agua', score: 2 }] },
  { id: 'processed', pillar: 'Nutrición', prompt: '¿Qué tan seguido comés comida rápida o procesada?', options: [{ label: 'Casi nunca', score: -1 }, { label: '1 o 2 veces por semana', score: 0 }, { label: '3 a 5 veces', score: 1 }, { label: 'Todos los días', score: 2 }] },
  { id: 'movement', pillar: 'Movimiento', prompt: '¿Cuántos días a la semana te movés al menos 30 minutos?', options: [{ label: '5 o más', score: -3 }, { label: '3 o 4', score: -1 }, { label: '1 o 2', score: 1 }, { label: 'Ninguno', score: 3 }] },
  { id: 'sleep-hours', pillar: 'Descanso', prompt: '¿Cuántas horas dormís la mayoría de noches?', options: [{ label: '7 a 8', score: -2 }, { label: '6 a 7', score: 0 }, { label: 'Más de 9', score: 1 }, { label: 'Menos de 6', score: 2 }] },
  { id: 'sleep-energy', pillar: 'Descanso', prompt: '¿Cómo te levantás la mayoría de días?', options: [{ label: 'Con energía', score: -1 }, { label: 'Bien, después del café', score: 0 }, { label: 'Cansado o cansada', score: 1 }, { label: 'Como si no hubiera dormido', score: 2 }] },
  { id: 'stress', pillar: 'Mente', prompt: '¿Qué tan seguido el estrés no te deja concentrarte?', options: [{ label: 'Casi nunca', score: -1 }, { label: 'A veces', score: 0 }, { label: 'Seguido', score: 1 }, { label: 'Todo el tiempo', score: 2 }] },
  { id: 'smoking', pillar: 'Hábitos', prompt: '¿Fumás o vapeás?', options: [{ label: 'Nunca', score: -1 }, { label: 'Lo dejé', score: 0 }, { label: 'Socialmente', score: 2 }, { label: 'A diario', score: 3 }] },
  { id: 'alcohol', pillar: 'Hábitos', prompt: '¿Cuántos tragos te tomás a la semana?', options: [{ label: '0 a 2', score: 0 }, { label: '3 a 7', score: 1 }, { label: '8 a 14', score: 2 }, { label: 'Más de 14', score: 3 }] },
  { id: 'checkup', pillar: 'Hábitos', prompt: '¿Cuándo fue tu último chequeo médico?', options: [{ label: 'Este año', score: -1 }, { label: 'Hace 1 o 2 años', score: 0 }, { label: 'Hace más de 2', score: 1 }, { label: 'Ni me acuerdo', score: 2 }] },
]

export const focuses: Focus[] = ['Energía', 'Dormir mejor', 'Peso', 'Defensas']
export const pillars: Pillar[] = ['Nutrición', 'Movimiento', 'Descanso', 'Mente', 'Hábitos']

export type Calculation = {
  reedad: number
  difference: number
  profile: ResultProfile
  pillars: Record<Pillar, number>
  strongest: Pillar
  lever: Pillar
  possibleYears: number
  challenge: string
}

export const getProfile = (difference: number): ResultProfile => {
  if (difference <= -5) return { name: 'Modo Reversa', message: 'Tu cuerpo va en reversa. Lo que estás haciendo funciona.', color: '#3f7f24' }
  if (difference <= -1) return { name: 'Vas adelantado', message: 'Le llevás ventaja al calendario. Vamos por más.', color: '#60b135' }
  if (difference <= 3) return { name: 'En punto', message: 'Tu cuerpo y tu DUI andan parejos. Un par de cambios y te le adelantás.', color: '#d29f30' }
  if (difference <= 7) return { name: 'Con años por recuperar', message: 'Hay años que podés recuperar. Y ya sabés por dónde empezar.', color: '#d97832' }
  return { name: 'Listo para el cambio', message: 'Hoy es tu punto de partida. Desde aquí, todo es ganancia.', color: '#c35345' }
}

const challengeFor = (pillar: Pillar, focus: Focus): string => {
  const challenges: Record<Pillar, string> = {
    Nutrición: 'Sumá una porción de fruta o verdura a tu día durante 30 días.',
    Movimiento: 'Movete al menos 30 minutos, 3 días por semana durante 30 días.',
    Descanso: 'Elegí una hora fija para desconectarte y cuidá tu descanso por 30 días.',
    Mente: 'Tomá 10 minutos al día para respirar, caminar o bajar el ritmo por 30 días.',
    Hábitos: 'Elegí un cambio pequeño y repetilo con intención durante 30 días.',
  }
  return `${challenges[pillar]} Tu prioridad: ${focus.toLowerCase()}.`
}

export const calculate = (age: number, answers: Record<string, number>, focus: Focus, questions = defaultQuestions): Calculation => {
  const scoreByPillar = Object.fromEntries(pillars.map((pillar) => [pillar, 0])) as Record<Pillar, number>
  const roomByPillar = Object.fromEntries(pillars.map((pillar) => [pillar, 0])) as Record<Pillar, number>
  questions.forEach((question) => {
    const score = answers[question.id] ?? 0
    scoreByPillar[question.pillar] += score
    roomByPillar[question.pillar] += score - Math.min(...question.options.map((option) => option.score))
  })
  const total = Object.values(scoreByPillar).reduce((sum, score) => sum + score, 0)
  const reedad = Math.max(age - 10, Math.min(age + 15, age + total))
  const difference = reedad - age
  const strongest = [...pillars].sort((a, b) => scoreByPillar[a] - scoreByPillar[b])[0]
  const lever = [...pillars].sort((a, b) => roomByPillar[b] - roomByPillar[a])[0]
  return {
    reedad,
    difference,
    profile: getProfile(difference),
    pillars: scoreByPillar,
    strongest,
    lever,
    possibleYears: Math.max(0, reedad - Math.max(age - 10, Math.min(age + 15, age + total - roomByPillar[lever]))),
    challenge: challengeFor(lever, focus),
  }
}

export const levelMilestones = [
  { name: 'Arranque', points: 0, reward: 'Tu perfil y tu primer reto' },
  { name: 'En ruta', points: 300, reward: 'Muestra en tu próxima visita' },
  { name: 'Constante', points: 800, reward: '10% en tu categoría de mejora' },
  { name: 'Imparable', points: 1500, reward: 'Consulta con nutricionista' },
  { name: 'Leyenda', points: 3000, reward: 'Eventos y lanzamientos NutriCenter' },
]

export const levelFor = (points: number) => {
  let index = 0
  levelMilestones.forEach((level, position) => { if (points >= level.points) index = position })
  return { ...levelMilestones[index], next: levelMilestones[index + 1]?.points ?? null }
}

export const isAccessId = (dui: string) => /^\d{8}-\d$/.test(dui.trim())
