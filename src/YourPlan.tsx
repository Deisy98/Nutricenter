import type { RefObject } from 'react'
import { challengeDates, recommendationFor } from './experience'
import type { StoredMeasurement } from './firebase'
import type { Pillar } from './reedad'
import { Icon } from './WellnessArt'

export function YourPlan({ measurement, headingRef, onProfile, onCard }: {
  measurement: StoredMeasurement
  headingRef: RefObject<HTMLHeadingElement | null>
  onProfile: () => void
  onCard: () => void
}) {
  const dates = challengeDates(measurement.createdAt)
  const recommendation = recommendationFor[measurement.lever as Pillar]
  return <section className="game-flow plan-flow">
    <div className="flow-heading"><span className="eyebrow"><Icon name="leaf" /> Tu siguiente capítulo</span><h1 ref={headingRef} tabIndex={-1}>Un reto pequeño.<br />Un cambio muy tuyo.</h1><p>Elegido por tu oportunidad de mejora en <strong>{measurement.lever.toLowerCase()}</strong> y tu prioridad: <strong>{measurement.focus.toLowerCase()}</strong>.</p></div>
    <article className="mission-card plan-mission"><div className="mission-top"><span><Icon name="leaf" /> Tu reto</span><b>30 días</b></div><h2>Empezá con un solo hábito.</h2><p>{measurement.challenge}</p><div className="challenge-timeline" aria-label="Un reto de cuatro semanas">{['Empezá', 'Repetí', 'Seguí', 'Celebrá'].map((label, index) => <span key={label}><b>{index + 1}</b><small>{label}</small></span>)}</div><button className="primary-button" onClick={onProfile}>Seguir mi reto <Icon name="arrow" /></button></article>
    <article className="advisor-card"><span className="advisor-icon"><Icon name="heart" /></span><div><span className="eyebrow">En NutriCenter te acompañamos</span><h2>{recommendation.category}</h2><p>{recommendation.message}</p><small>Podés mostrarle esta pantalla a un asesor.</small></div></article>
    <article className="return-card"><Icon name="clock" /><div><span>Tu próxima cita con vos</span><strong>{dates.label}</strong><p>Volvé a medir tu ReEdad y mirá qué cambió.</p></div></article>
    <button className="secondary-button" onClick={onCard}><Icon name="share" /> Llevarme mi tarjeta</button>
  </section>
}
