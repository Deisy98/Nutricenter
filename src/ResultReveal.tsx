import { useEffect, useRef, useState } from 'react'
import { Icon, WellnessArt } from './WellnessArt'

export function ResultReveal({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(3)
  const title = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    title.current?.focus({ preventScroll: true })
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const skip = window.setTimeout(onComplete, 0)
      return () => window.clearTimeout(skip)
    }
    const started = Date.now()
    const timer = window.setInterval(() => {
      const remaining = 3 - Math.floor((Date.now() - started) / 1000)
      if (remaining <= 0) {
        window.clearInterval(timer)
        onComplete()
      } else setCount(remaining)
    }, 100)
    return () => window.clearInterval(timer)
  }, [onComplete])

  return <section className="game-flow reveal-flow">
    <span className="eyebrow"><Icon name="spark" /> Tus hábitos tienen una historia</span>
    <h1 ref={title} tabIndex={-1}>¿Listo para<br />conocer la tuya?</h1>
    <WellnessArt compact />
    <div className="countdown" aria-hidden="true"><strong key={count}>{count}</strong></div>
    <p>Tu ReEdad está por llegar.</p>
    <button className="text-button" onClick={onComplete}>Ver mi resultado ahora <Icon name="arrow" /></button>
  </section>
}

export function AnimatedAge({ from, to }: { from: number; to: number }) {
  const [value, setValue] = useState(from)
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let start: number | null = null
    const tick = (now: number) => {
      start ??= now
      const progress = reduced ? 1 : Math.min(1, (now - start) / 850)
      setValue(Math.round(from + (to - from) * (1 - (1 - progress) ** 3)))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [from, to])
  return <strong aria-label={String(to)}><span aria-hidden="true">{value}</span></strong>
}
