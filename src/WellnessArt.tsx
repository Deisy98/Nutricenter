import type { CSSProperties } from 'react'
import { pillars, type Pillar } from './reedad'
import { pillarIcons, type IconName } from './wellnessIcons'

export function Icon({ name, className = '' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    leaf: <><path d="M20 4C8 2 3 8 5 14s13 7 15-10Z" /><path d="M4 21 15 10" /></>,
    move: <><circle cx="15" cy="4" r="2" /><path d="m4 10 5-3 5 3 5 1M10 8l-2 7-4 5m6-8 5 3 1 6" /></>,
    moon: <path d="M20 14A9 9 0 0 1 10 3a9 9 0 1 0 10 11Z" />,
    mind: <><path d="M12 20C4 20 2 16 3 11c5-1 9 3 9 9Zm0 0c8 0 10-4 9-9-5-1-9 3-9 9Z" /><path d="M8 12c0-5 4-9 4-9s4 4 4 9" /></>,
    heart: <path d="M20.5 5.5a5 5 0 0 0-7 0L12 7l-1.5-1.5a5 5 0 0 0-7 7L12 21l8.5-8.5a5 5 0 0 0 0-7Z" />,
    arrow: <path d="M5 12h14m-6-6 6 6-6 6" />,
    back: <path d="M19 12H5m6-6-6 6 6 6" />,
    close: <path d="m6 6 12 12M6 18 18 6" />,
    check: <path d="m5 12 4 4L19 6" />,
    spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z" /><path d="M20 2v4m-2-2h4" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    lock: <><rect x="5" y="10" width="14" height="11" rx="3" /><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3" /></>,
    chart: <><path d="M4 4v16h17M8 15v-4m5 4V7m5 8v-6" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m9 10 6-4m-6 8 6 4" /></>,
    download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5" /></>,
    trophy: <><path d="M7 3h10v6a5 5 0 0 1-10 0V3Zm5 11v7m-4 0h8M7 5H3v3a4 4 0 0 0 4 4m10-7h4v3a4 4 0 0 1-4 4" /></>,
  }
  return <svg className={`ui-icon ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

/** Decorative companion, separate from the official NutriCenter logo. */
export function WellnessArt({ compact = false }: { compact?: boolean }) {
  return <div className={`wellness-art${compact ? ' compact-art' : ''}`} aria-hidden="true">
    <svg className="sprout-art" viewBox="0 0 360 252" fill="none">
      <path d="M76 194C35 148 65 58 142 33c77-25 158 14 157 87-1 81-147 144-223 74Z" fill="#eef4d9" />
      <ellipse cx="183" cy="224" rx="74" ry="9" fill="#dbe5c3" />
      <g className="sprout-float">
        <path d="M150 202v20l-16 3m67-22v19l17 3" stroke="#375735" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M124 143c-24-2-29-15-28-26m137 29c22-6 28-20 24-29" stroke="#375735" strokeWidth="7" strokeLinecap="round" />
        <path d="M180 84c-40-11-68 24-66 66 2 41 32 64 67 62 46-2 70-39 60-78-7-28-32-44-61-50Z" fill="#8bc65a" />
        <path d="M204 91c25 20 28 54 11 84-15 27-53 39-78 22 26 25 75 18 96-13 24-35 9-78-29-93Z" fill="#76b84b" />
        <path d="M178 86c0-25 6-35 12-47" stroke="#375735" strokeWidth="5" strokeLinecap="round" />
        <path d="M180 70c-34 0-48-22-43-43 31 0 51 18 43 43Z" fill="#3f7f24" />
        <path d="M184 63c0-31 25-44 47-35-4 29-23 40-47 35Z" fill="#60b135" />
        <ellipse cx="154" cy="143" rx="4" ry="6" fill="#2d4d2b" /><ellipse cx="202" cy="143" rx="4" ry="6" fill="#2d4d2b" />
        <path d="M168 156c5 7 14 7 20 0" stroke="#2d4d2b" strokeWidth="4" strokeLinecap="round" />
        <ellipse cx="144" cy="155" rx="9" ry="5" fill="#b5da81" /><ellipse cx="213" cy="155" rx="9" ry="5" fill="#b5da81" />
      </g>
      <path d="m74 65 3-10 3 10 10 3-10 3-3 10-3-10-10-3 10-3Z" fill="#d99b5c" />
      <path d="m283 186 2-7 2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" fill="#9b86b3" />
      <circle cx="269" cy="57" r="4" fill="#b7c983" /><circle cx="84" cy="191" r="3" fill="#b7c983" />
    </svg>
    {!compact && <><span className="floating-chip chip-rest"><Icon name="moon" /> Buen descanso</span><span className="floating-chip chip-move"><Icon name="move" /> Más movimiento</span><span className="floating-chip chip-energy"><Icon name="spark" /> Tu mejor versión</span><span className="floating-age"><small>¿Tu ReEdad?</small><span className="age-window"><span className="age-roll"><b>24</b><b>38</b><b>29</b><b>42</b><b>24</b></span></span><small>años</small></span></>}
  </div>
}

export function PillarTrail({ current, complete = false }: { current?: Pillar; complete?: boolean }) {
  const active = current ? pillars.indexOf(current) : -1
  return <div className="pillar-trail" aria-label="Los cinco pilares de tu bienestar">{pillars.map((pillar, index) => <div key={pillar} className={`pillar-stop pillar-${index}${active === index ? ' is-current' : ''}${complete || active > index ? ' is-done' : ''}`} aria-current={active === index ? 'step' : undefined} style={{ '--pillar-order': index } as CSSProperties}><span><Icon name={complete || active > index ? 'check' : pillarIcons[pillar]} /></span><small>{pillar}</small></div>)}</div>
}
