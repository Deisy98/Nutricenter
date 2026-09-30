import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import type { CSSProperties } from 'react'
import { ResultReveal, AnimatedAge } from './ResultReveal'
import { YourPlan } from './YourPlan'
import { challengeDates, levelMilestones, pillarPresentation } from './experience'
import { cardContent, downloadStory, type CardMode } from './shareCard'
import { Icon, PillarTrail, WellnessArt } from './WellnessArt'
import { pillarIcons } from './wellnessIcons'
import { completeChallenge, getProfile, saveProfile, type StoredMeasurement, type StoredProfile } from './firebase'
import { calculate, defaultQuestions, focuses, isAccessId, levelFor, pillars, type Focus } from './reedad'

type Screen = 'home' | 'checkin' | 'quiz' | 'reveal' | 'result' | 'plan' | 'profile' | 'card'

const formatDui = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 9)
  return digits.length > 8 ? `${digits.slice(0, 8)}-${digits.slice(8)}` : digits
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [displayName, setDisplayName] = useState('')
  const [dui, setDui] = useState('')
  const [checkinStep, setCheckinStep] = useState<'dui' | 'details'>('dui')
  const [whatsapp, setWhatsapp] = useState('')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')
  const [consent, setConsent] = useState(false)
  const [profile, setProfile] = useState<StoredProfile | null>(null)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [focus, setFocus] = useState<Focus | null>(null)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [lastMeasurement, setLastMeasurement] = useState<StoredMeasurement | null>(null)
  const [cardMode, setCardMode] = useState<CardMode>('full')
  const [notice, setNotice] = useState('')
  const [busy, setBusy] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sessionVersion = useRef(0)

  const resetSession = useCallback(() => {
    sessionVersion.current += 1
    setScreen('home')
    setDui('')
    setCheckinStep('dui')
    setWhatsapp('')
    setDisplayName('')
    setAge('')
    setSex('')
    setConsent(false)
    setProfile(null)
    setAnswers({})
    setFocus(null)
    setQuestionIndex(0)
    setLastMeasurement(null)
    setCardMode('full')
    setNotice('')
    setBusy(false)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    if (screen !== 'home') headingRef.current?.focus({ preventScroll: true })
  }, [screen, questionIndex, checkinStep])

  const result = useMemo(() => lastMeasurement
    ? calculate(lastMeasurement.age, lastMeasurement.answers, lastMeasurement.focus as Focus)
    : null, [lastMeasurement])

  useEffect(() => {
    if (screen === 'home') return
    let timeout = window.setTimeout(resetSession, 120000)
    const resetTimeout = () => {
      window.clearTimeout(timeout)
      timeout = window.setTimeout(resetSession, 120000)
    }
    window.addEventListener('pointerdown', resetTimeout)
    window.addEventListener('keydown', resetTimeout)
    return () => {
      window.clearTimeout(timeout)
      window.removeEventListener('pointerdown', resetTimeout)
      window.removeEventListener('keydown', resetTimeout)
    }
  }, [screen, resetSession])

  const showResult = useCallback(() => setScreen('result'), [])

  const begin = () => { setNotice(''); setCheckinStep('dui'); setScreen('checkin') }

  const lookupDui = async (event: React.FormEvent) => {
    event.preventDefault()
    if (busy) return
    if (!isAccessId(dui)) return setNotice('Ingresá tu DUI completo.')
    setNotice('')
    setBusy(true)
    const version = sessionVersion.current
    try {
      const saved = await getProfile(dui)
      if (version !== sessionVersion.current) return
      setProfile(null)
      setLastMeasurement(null)
      setDisplayName('')
      setWhatsapp('')
      setAge('')
      setSex('')
      setConsent(false)
      if (saved) {
        setProfile(saved)
        setDisplayName(saved.displayName)
        setWhatsapp(saved.whatsapp)
        const latest = saved.measurements.at(-1)
        if (latest) {
          setAge(String(latest.age))
          setLastMeasurement(latest)
          setScreen('profile')
        } else setCheckinStep('details')
      } else setCheckinStep('details')
    } catch (error) {
      console.error('No se pudo consultar el perfil en Firestore:', error)
      if (version === sessionVersion.current) setNotice('No pudimos consultar tu perfil. Intentá de nuevo.')
    } finally {
      if (version === sessionVersion.current) setBusy(false)
    }
  }

  const submitCheckin = async (event: React.FormEvent) => {
    event.preventDefault()
    if (busy) return
    const normalized = dui.trim()
    if (!isAccessId(normalized)) return setNotice('Ingresá los 8 dígitos y el número verificador de tu DUI.')
    if (!displayName.trim() || !/^(?:503)?[267]\d{7}$/.test(whatsapp.replace(/\D/g, '')) || !age || Number(age) < 18 || Number(age) > 99 || !sex || !consent) return setNotice('Completá tus datos y un número de WhatsApp válido para continuar.')
    setNotice('')
    setDui(normalized)
    setAnswers({})
    setFocus(null)
    setQuestionIndex(0)
    setScreen('quiz')
  }

  const submitQuiz = async () => {
    if (!focus || busy) return
    setBusy(true)
    const version = sessionVersion.current
    const calculation = calculate(Number(age), answers, focus)
    const now = new Date().toISOString()
    const previous = profile?.measurements.at(-1)
    const daysSincePrevious = previous ? (Date.now() - new Date(previous.createdAt).getTime()) / 86400000 : Infinity
    const basePoints = previous ? (daysSincePrevious >= 30 ? 50 : 0) : 100
    const progressPoints = previous ? Math.max(0, previous.reedad - calculation.reedad) * 200 : 0
    const measurement: StoredMeasurement = {
      id: crypto.randomUUID(), createdAt: now, age: Number(age), answers, focus,
      reedad: calculation.reedad, difference: calculation.difference, pillars: calculation.pillars,
      profile: calculation.profile.name, strongest: calculation.strongest, lever: calculation.lever,
      challenge: calculation.challenge, pointsAwarded: basePoints + progressPoints, configVersion: 'reedad-v1',
    }
    const oldMeasurements = profile?.measurements ?? []
    const updated: StoredProfile = {
      dui, displayName: displayName.trim(), whatsapp: whatsapp.replace(/\D/g, ''), consent: true,
      points: (profile?.points ?? 0) + measurement.pointsAwarded,
      badges: [...new Set([...(profile?.badges ?? []), 'Primera ReEdad', ...(oldMeasurements.length ? ['Sigo en juego'] : [])])],
      challengeComplete: false, weeklyCheckins: profile?.weeklyCheckins ?? {}, createdAt: profile?.createdAt ?? now, updatedAt: now,
      measurements: [...oldMeasurements, measurement],
    }
    try {
      await saveProfile(updated)
      if (version !== sessionVersion.current) return
      setProfile(updated)
      setLastMeasurement(measurement)
      setScreen('reveal')
    } catch (error) {
      console.error('No se pudo guardar el resultado en Firestore:', error)
      if (version === sessionVersion.current) setNotice('No pudimos guardar tu resultado. Intentá de nuevo.')
    } finally {
      if (version === sessionVersion.current) setBusy(false)
    }
  }

  const openProfile = () => { setLastMeasurement(profile?.measurements.at(-1) ?? null); setScreen('profile') }
  const finishChallenge = async () => {
    if (!profile || busy) return
    const latest = profile.measurements.at(-1)
    if (!latest || challengeDates(latest.createdAt).elapsed < 30) return
    setBusy(true)
    const version = sessionVersion.current
    try {
      const updated = await completeChallenge(profile)
      if (version === sessionVersion.current) setProfile(updated)
    } catch {
      setNotice('No pudimos guardar tu reto. Intentá de nuevo.')
    } finally {
      if (version === sessionVersion.current) setBusy(false)
    }
  }
  const checkInWeek = async (week: number) => {
    const latest = profile?.measurements.at(-1)
    if (!profile || !latest || busy) return
    const weeks = profile.weeklyCheckins?.[latest.id] ?? []
    if (weeks.includes(week) || challengeDates(latest.createdAt).elapsed < week * 7) return
    setBusy(true)
    const version = sessionVersion.current
    const updated = { ...profile, weeklyCheckins: { ...profile.weeklyCheckins, [latest.id]: [...weeks, week] }, updatedAt: new Date().toISOString() }
    try {
      await saveProfile(updated)
      if (version === sessionVersion.current) setProfile(updated)
    } catch {
      setNotice('No pudimos guardar tu seguimiento. Intentá de nuevo.')
    } finally {
      if (version === sessionVersion.current) setBusy(false)
    }
  }
  const storyContent = result && lastMeasurement
    ? cardContent(cardMode, result, lastMeasurement.age, profile?.measurements[0]?.reedad ?? result.reedad)
    : null
  const shareCard = async () => {
    if (!storyContent) return
    const text = storyContent.text
    try {
      if (navigator.share) await navigator.share({ title: 'Mi ReEdad', text })
      else { await navigator.clipboard.writeText(text); setNotice('Texto copiado. ¡Listo para compartir!') }
    } catch (error) {
      if (!(error instanceof Error && error.name === 'AbortError')) setNotice('No pudimos compartir el texto. Podés guardar tu tarjeta.')
    }
  }
  const downloadCard = async () => {
    if (!result || !storyContent || busy) return
    setBusy(true)
    try {
      await downloadStory(storyContent, result.strongest, result.profile.color)
    } catch {
      setNotice('No pudimos crear tu imagen. Volvé a intentarlo.')
    } finally {
      setBusy(false)
    }
  }

  const quizQuestion = questionIndex < defaultQuestions.length ? defaultQuestions[questionIndex] : null
  const progress = ((questionIndex + 1) / (defaultQuestions.length + 1)) * 100

  const activePillar = quizQuestion?.pillar
  const selectedAnswer = quizQuestion ? answers[quizQuestion.id] : undefined
  const currentLevel = levelFor(profile?.points ?? 0)
  const latestMeasurement = profile?.measurements.at(-1)
  const currentChallengeDates = latestMeasurement ? challengeDates(latestMeasurement.createdAt) : null
  const checkedWeeks = latestMeasurement ? profile?.weeklyCheckins?.[latestMeasurement.id] ?? [] : []


  return <main className="game-background">
    <section className={'game-frame screen-' + screen} aria-label="ReEdad">
      <div className="app-content">
        <header className="game-topbar">
          <button className="brand" onClick={resetSession} aria-label="Ir al inicio de ReEdad">
            <img src="/images/logo_nutricenter.jpg" alt="NutriCenter" />
          </button>
          {screen === 'home'
            ? <span className="header-note"><span /> Un ratito para vos</span>
            : <button className="icon-button" onClick={resetSession} aria-label="Salir de esta experiencia"><Icon name="close" /></button>}
        </header>

        {notice && <div className="notice" role="status"><span>{notice}</span><button onClick={() => setNotice('')} aria-label="Cerrar mensaje"><Icon name="close" /></button></div>}

        {screen === 'home' && <section className="game-home">
          <div className="home-heading">
            <span className="eyebrow"><Icon name="spark" /> Pequeños hábitos. Grandes cambios.</span>
            <h1 ref={headingRef} tabIndex={-1}>Conocé tu <span className="wordmark">ReEdad<span className="wordmark-dot">.</span></span></h1>
            <p>Tu edad cuenta años.<br /><strong>Tus hábitos cuentan otra historia.</strong></p>
          </div>
          <WellnessArt />
          <div className="home-invitation">
            <h2>¿Cuántos años tiene tu cuerpo?</h2>
          </div>
          <PillarTrail />
          <div className="home-community">
            {/* Sample daily total for the presentation; not a live Firebase metric. */}
            <div className="daily-counter"><Icon name="spark" /><p>Hoy, <strong>47 personas</strong><br />se quitaron años</p></div>
          </div>
          <div className="home-footer">
            <div className="quick-facts"><span><Icon name="clock" /> 3 minutos</span><i /><span>10 preguntas + 1 para vos</span></div>
            <button className="primary-button" onClick={begin}>¡Vamos a descubrirla! <Icon name="arrow" /></button>
            <p className="wellness-note">Una experiencia de bienestar, no un diagnóstico médico.</p>
          </div>
        </section>}

        {screen === 'checkin' && <section className="game-flow checkin-flow">
          <div className="journey-steps" aria-label="Paso 1 de 3"><span className="active">01 <b>Sobre vos</b></span><i /><span>02 <b>Tus hábitos</b></span><i /><span>03 <b>Tu ReEdad</b></span></div>
          <div className="checkin-welcome"><WellnessArt compact /><div><span className="eyebrow">¡Qué bueno verte por acá!</span><h1 ref={headingRef} tabIndex={-1}>Empecemos<br />por vos.</h1></div></div>
          <p className="page-intro">{checkinStep === 'dui' ? 'Ingresá tu DUI para empezar.' : 'Unos datos más y empezamos.'}</p>
          {checkinStep === 'dui' && <form className="game-card dui-entry" onSubmit={lookupDui} aria-busy={busy}>
            <label htmlFor="dui">DUI</label>
            <div className="input-wrap"><input id="dui" value={dui} onChange={(event) => setDui(formatDui(event.target.value))} inputMode="numeric" maxLength={10} placeholder="00000000-0" autoComplete="off" required /><Icon name="lock" /></div>
            <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Un momento…' : 'Continuar'} <Icon name="arrow" /></button>
          </form>}
          {checkinStep === 'details' && <form className="game-card" onSubmit={submitCheckin} aria-busy={busy}>
            <label className="name-field" htmlFor="name">¿Cómo te llamás?<input id="name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} placeholder="Tu nombre" autoComplete="given-name" maxLength={50} required /></label>
            <label className="name-field" htmlFor="whatsapp">WhatsApp<input id="whatsapp" type="tel" inputMode="tel" autoComplete="tel" value={whatsapp} onChange={(event) => setWhatsapp(event.target.value.replace(/[^\d+ -]/g, '').slice(0, 16))} placeholder="Ej. 7000 0000" required /></label>
            <div className="field-row">
              <label htmlFor="age">Tu edad<div className="input-wrap"><input id="age" type="number" inputMode="numeric" min="18" max="99" value={age} onChange={(event) => setAge(event.target.value)} placeholder="Ej. 32" required /><span className="input-suffix">años</span></div></label>
              <label htmlFor="sex">Sexo<select id="sex" value={sex} onChange={(event) => setSex(event.target.value)} required><option value="">Seleccioná</option><option>Femenino</option><option>Masculino</option><option>Prefiero no decirlo</option></select></label>
            </div>
            <label className="consent"><input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} required /><span>Acepto guardar mis datos y respuestas para seguir mi progreso y recibir mi reto.</span></label>
            <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Preparando tu recorrido…' : '¡Listo, sigamos!'} <Icon name="arrow" /></button>
            <button className="back-button checkin-back" type="button" onClick={() => { setNotice(''); setCheckinStep('dui') }}>Cambiar DUI</button>
          </form>}
          <div className="gentle-note"><Icon name="heart" /><p>Acá no hay hábitos perfectos.<br /><strong>Solo un buen lugar para empezar.</strong></p></div>
        </section>}

        {screen === 'quiz' && <section className="game-flow quiz-flow">
          <div className="quiz-nav"><button className="back-button" onClick={() => questionIndex ? setQuestionIndex(questionIndex - 1) : setScreen('checkin')}><Icon name="back" /> Atrás</button><span>{quizQuestion ? 'Conociendo tus hábitos' : 'Una última para vos'} <b>{questionIndex + 1}<em> / 11</em></b></span></div>
          <div className="progress-track" role="progressbar" aria-label="Progreso del cuestionario" aria-valuemin={0} aria-valuemax={11} aria-valuenow={questionIndex + 1}><span style={{ width: progress + '%' }} /></div>
          <PillarTrail current={activePillar} complete={!quizQuestion} />
          <div key={questionIndex} className="question-content">
            <div className={'question-symbol tone-' + (activePillar ? pillars.indexOf(activePillar) : 2)}><Icon name={activePillar ? pillarIcons[activePillar] : 'spark'} /></div>
            <span className="eyebrow">{activePillar ?? 'Tu bienestar, a tu manera'}</span>
            <h1 ref={headingRef} tabIndex={-1}>{quizQuestion?.prompt ?? '¿Qué querés mejorar primero?'}</h1>
            <p className="question-hint">{quizQuestion ? 'Elegí lo que más se parece a tu día a día.' : 'Tu respuesta nos ayuda a elegir tu reto.'}</p>
            <div className={'answer-list' + (!quizQuestion ? ' focus-list' : '')} role="group" aria-label={quizQuestion?.prompt ?? 'Tu prioridad'}>
              {quizQuestion
                ? quizQuestion.options.map((option, index) => <button key={option.label} aria-pressed={selectedAnswer === option.score} className={'answer' + (selectedAnswer === option.score ? ' selected' : '')} onClick={() => setAnswers({ ...answers, [quizQuestion.id]: option.score })}><span className="answer-letter">{String.fromCharCode(65 + index)}</span><span className="answer-label">{option.label}</span><span className="answer-check">{selectedAnswer === option.score && <Icon name="check" />}</span></button>)
                : focuses.map((item, index) => <button key={item} aria-pressed={focus === item} className={'answer focus-answer tone-' + index + (focus === item ? ' selected' : '')} onClick={() => setFocus(item)}><Icon name={(['spark', 'moon', 'move', 'heart'] as const)[index]} /><span className="answer-label">{item}</span><span className="answer-check">{focus === item && <Icon name="check" />}</span></button>)}
            </div>
          </div>
          <div className="quiz-footer"><p><Icon name="heart" /> {questionIndex < 4 ? 'Sin respuestas perfectas. Solo las tuyas.' : questionIndex < 9 ? 'Cada respuesta te ayuda a conocerte mejor.' : '¡Ya casi! Tu ReEdad está por llegar.'}</p><button className="primary-button" disabled={busy || (quizQuestion ? selectedAnswer === undefined : !focus)} onClick={() => quizQuestion ? setQuestionIndex(questionIndex + 1) : void submitQuiz()}>{busy ? 'Preparando tu ReEdad…' : quizQuestion ? 'Sigamos' : 'Descubrir mi ReEdad'} <Icon name={quizQuestion ? 'arrow' : 'spark'} /></button></div>
        </section>}

        {screen === 'reveal' && <ResultReveal onComplete={showResult} />}

        {screen === 'result' && result && lastMeasurement && <section className="game-flow result-flow" style={{ '--profile-color': result.profile.color } as CSSProperties}>
          <div className="result-heading"><span className="eyebrow"><Icon name="spark" /> Un poquito más cerca de conocerte</span><h1 ref={headingRef} tabIndex={-1}>¡Esta es tu ReEdad!</h1></div>
          <div className="age-reveal"><span className="reveal-spark reveal-spark-one"><Icon name="spark" /></span><span className="reveal-spark reveal-spark-two"><Icon name="spark" /></span><div className="age-ring"><span>EDAD DE TUS HÁBITOS</span><AnimatedAge key={lastMeasurement.id} from={lastMeasurement.age} to={result.reedad} /><small>años</small></div><span className="real-age">Tu edad: {lastMeasurement.age} años</span></div>
          <div className="result-copy"><span className={'difference' + (result.difference <= 0 ? ' good' : '')}>{result.difference === 0 ? 'En sintonía con tu edad' : (result.difference > 0 ? '+' : '−') + Math.abs(result.difference) + (Math.abs(result.difference) === 1 ? ' año frente a tu edad' : ' años frente a tu edad')}</span><h2>{result.profile.name}</h2><p>{result.profile.message}</p></div>
          <section className="pillar-map"><h2>Así van tus cinco pilares</h2><p>Una mirada a tus respuestas de hoy.</p><div>{pillars.map((pillar) => {
            const presentation = pillarPresentation(pillar, result.pillars[pillar])
            return <div className={'pillar-bar-row ' + presentation.tone} key={pillar}><div><span><Icon name={pillarIcons[pillar]} />{pillar}</span><small>{presentation.label}</small></div><div className="pillar-bar" aria-label={pillar + ': ' + presentation.label}><i style={{ width: presentation.fill + '%' }} /></div></div>
          })}</div></section>
          <div className="mini-insights expanded-insights"><article><span className="insight-icon"><Icon name="spark" /></span><div><span>Tu superpoder</span><strong>{result.strongest}</strong><p>{result.pillars[result.strongest] < 0 ? 'Este pilar resta ' + Math.abs(result.pillars[result.strongest]) + (Math.abs(result.pillars[result.strongest]) === 1 ? ' año en tu quiz.' : ' años en tu quiz.') : 'Es tu mejor punto de partida. Seguí cuidándolo.'}</p></div></article><article><span className="insight-icon"><Icon name="leaf" /></span><div><span>Tu palanca de mejora</span><strong>{result.lever}</strong><p>{result.possibleYears > 0 ? 'Mejorar este pilar puede restar hasta ' + result.possibleYears + (result.possibleYears === 1 ? ' año en tu quiz.' : ' años en tu quiz.') : 'Tu siguiente paso: mantener y fortalecer este hábito.'}</p></div></article></div>
          {lastMeasurement.pointsAwarded > 0 && <div className="points-earned"><Icon name="trophy" /><span>Un paso por vos. <strong>+{lastMeasurement.pointsAwarded} puntos</strong></span></div>}
          <div className="result-actions"><button className="primary-button" onClick={() => setScreen('plan')}>Descubrir mi reto de 30 días <Icon name="arrow" /></button><button className="secondary-button" onClick={() => setScreen('card')}><Icon name="share" /> Crear mi tarjeta</button></div>
          <p className="wellness-note">Experiencia de bienestar, no diagnóstico médico.<br />Pesos del cuestionario pendientes de validación clínica.</p>
        </section>}

        {screen === 'plan' && lastMeasurement && <YourPlan measurement={lastMeasurement} headingRef={headingRef} onProfile={openProfile} onCard={() => setScreen('card')} />}

        {screen === 'profile' && profile && <section className="game-flow profile-flow">
          <div className="profile-heading"><div><span className="eyebrow">Cada pequeño paso cuenta</span><h1 ref={headingRef} tabIndex={-1}>Vas por vos{profile.displayName && profile.displayName !== 'Mi perfil' ? ', ' + profile.displayName.split(' ')[0] : ''}.</h1><p>Este es tu recorrido hasta hoy.</p></div><span className="profile-avatar"><Icon name="leaf" /></span></div>
          <div className="two-scores"><article><span>Tu ReEdad</span><strong>{latestMeasurement?.reedad}<small> años</small></strong><p>Lo que buscás bajar</p></article><article><span>Tus puntos</span><strong>{profile.points}</strong><p>Lo que hacés crecer</p></article></div>
          <div className="score-strip"><article><Icon name="spark" /><strong>{profile.badges.length}</strong><span>Insignias</span></article><article><Icon name="trophy" /><strong>{currentLevel.name}</strong><span>Tu nivel</span></article><article><Icon name="chart" /><strong>{profile.measurements.length}</strong><span>Visitas</span></article></div>
          {currentLevel.next && <div className="level-progress"><div><span>Tu próximo nivel está más cerca</span><b>{profile.points} / {currentLevel.next}</b></div><progress max={currentLevel.next} value={profile.points} aria-label="Puntos para el próximo nivel" /></div>}
          <section className="mission-card current-mission">
            <div className="mission-top"><span><Icon name="leaf" /> Tu reto de 30 días</span><b>{profile.challengeComplete ? '¡Lo lograste!' : 'Día ' + Math.min(30, (currentChallengeDates?.elapsed ?? 0) + 1) + ' de 30'}</b></div>
            <h2>Un hábito a la vez.</h2><p>{latestMeasurement?.challenge ?? 'Completá tu primera ReEdad.'}</p>
            <div className="weekly-checkins" role="group" aria-label="Tu seguimiento semanal">{[1, 2, 3, 4].map((week) => <button key={week} disabled={busy || checkedWeeks.includes(week) || (currentChallengeDates?.elapsed ?? 0) < week * 7} aria-label={'Semana ' + week + (checkedWeeks.includes(week) ? ', completada' : ', disponible desde el día ' + week * 7)} className={checkedWeeks.includes(week) ? 'checked' : ''} onClick={() => checkInWeek(week)}><span>{checkedWeeks.includes(week) ? <Icon name="check" /> : week}</span><small>Semana {week}</small></button>)}</div>
            <p className="field-hint">Volvé cada semana para marcar cómo vas.</p>
            <button className={profile.challengeComplete ? 'completed-button' : 'primary-button'} onClick={finishChallenge} disabled={profile.challengeComplete || busy || (currentChallengeDates?.elapsed ?? 0) < 30}><Icon name="check" />{profile.challengeComplete ? 'Reto completado · +150 puntos' : busy ? 'Guardando…' : (currentChallengeDates?.elapsed ?? 0) < 30 ? 'Tu meta: completar los 30 días' : 'Completé mi reto'}</button>
          </section>
          {currentChallengeDates && <article className="return-card"><Icon name="clock" /><div><span>Tu próxima ReEdad</span><strong>{currentChallengeDates.label}</strong><p>Volvé a medirte y descubrí tu progreso.</p></div></article>}
          <details className="rewards-roadmap"><summary><Icon name="trophy" /><span>Tu camino a Leyenda<small>Conocé los niveles y sus recompensas</small></span><Icon name="arrow" /></summary><ol>{levelMilestones.map((level) => <li key={level.name} className={profile.points >= level.points ? 'unlocked' : ''}><Icon name={profile.points >= level.points ? 'check' : 'lock'} /><div><strong>{level.name}<span>{level.points.toLocaleString('es-SV')} pts</span></strong><p>{level.reward}</p></div></li>)}</ol><p className="field-hint">Beneficios sujetos a disponibilidad y confirmación en tienda.</p></details>
          <section className="profile-card"><h2>Pequeñas grandes victorias</h2><div className="badge-list">{profile.badges.map((badge) => <span key={badge}><Icon name="trophy" /> {badge}</span>)}</div></section>
          <section className="history-card"><div className="history-title"><h2>Tu historia</h2><button className="text-button" onClick={begin}>Volver a medirme <Icon name="arrow" /></button></div>{[...profile.measurements].reverse().map((measurement) => <button className="history-row" key={measurement.id} onClick={() => { setLastMeasurement(measurement); setScreen('result') }}><span className="history-number">{measurement.reedad}<small>años</small></span><span><strong>{measurement.profile}</strong><small>{new Date(measurement.createdAt).toLocaleDateString('es-SV', { day: 'numeric', month: 'short', year: 'numeric' })}</small></span><Icon name="arrow" /></button>)}</section>
        </section>}

        {screen === 'card' && result && lastMeasurement && <section className="game-flow card-flow">
          <div className="flow-heading"><span className="eyebrow">Lo bueno también se comparte</span><h1 ref={headingRef} tabIndex={-1}>Tu historia, a tu manera.</h1><p>Elegí lo que querés contar.</p></div>
          <div className="card-mode-list" role="group" aria-label="Contenido de la tarjeta"><button className={'mode' + (cardMode === 'full' ? ' active' : '')} aria-pressed={cardMode === 'full'} onClick={() => setCardMode('full')}>Mi ReEdad</button><button className={'mode' + (cardMode === 'difference' ? ' active' : '')} aria-pressed={cardMode === 'difference'} onClick={() => setCardMode('difference')}>Mi diferencia</button><button className={'mode' + (cardMode === 'progress' ? ' active' : '')} aria-pressed={cardMode === 'progress'} disabled={profile ? profile.measurements.length < 2 : true} onClick={() => setCardMode('progress')}>Mi progreso</button></div>
          <article className="story-card" style={{ '--profile-color': result.profile.color } as CSSProperties}><header><span>ReEdad<span>.</span></span><Icon name="spark" /></header><div className="story-number"><small>{storyContent?.label}</small><strong>{storyContent?.value}</strong><b>años</b></div><p>{storyContent?.text}</p><div className="story-superpower"><Icon name={pillarIcons[result.strongest]} /><span>Mi superpoder<strong>{result.strongest}</strong></span></div><footer><span>¿Y el tuyo? Descubrilo<br />en NutriCenter.</span><img src="/images/logo_nutricenter.jpg" alt="NutriCenter" /></footer></article>
          {(!profile || profile.measurements.length < 2) && <p className="field-hint">Tu tarjeta de progreso se activa en la próxima visita.</p>}
          <div className="result-actions"><button className="primary-button" onClick={downloadCard} disabled={busy}><Icon name="download" /> {busy ? 'Creando tu tarjeta…' : 'Guardar tarjeta'}</button><button className="secondary-button" onClick={shareCard}><Icon name="share" /> Compartir texto</button></div>
        </section>}

        {(['result', 'plan', 'profile', 'card'] as Screen[]).includes(screen) && <nav className="bottom-nav" aria-label="Tu espacio ReEdad"><button aria-current={screen === 'result' ? 'page' : undefined} onClick={() => setScreen('result')}><Icon name="spark" /><span>Mi ReEdad</span></button><button aria-current={screen === 'plan' ? 'page' : undefined} onClick={() => setScreen('plan')}><Icon name="leaf" /><span>Mi reto</span></button><button aria-current={screen === 'profile' ? 'page' : undefined} onClick={openProfile}><Icon name="chart" /><span>Mi progreso</span></button><button aria-current={screen === 'card' ? 'page' : undefined} onClick={() => setScreen('card')}><Icon name="share" /><span>Mi tarjeta</span></button></nav>}
      </div>
    </section>
  </main>
}

export default App
