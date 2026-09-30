import type { Calculation } from './reedad'

export type CardMode = 'full' | 'difference' | 'progress'
export type CardContent = { label: string; value: string; text: string }

export function cardContent(mode: CardMode, result: Calculation, age: number, firstReedad: number): CardContent {
  if (mode === 'difference') return {
    label: 'FRENTE A MI EDAD',
    value: `${result.difference > 0 ? '+' : result.difference < 0 ? '−' : ''}${Math.abs(result.difference)}`,
    text: result.difference === 0 ? 'Mi ReEdad está en sintonía con mi edad.' : `La edad de mis hábitos es ${Math.abs(result.difference)} ${Math.abs(result.difference) === 1 ? 'año' : 'años'} ${result.difference < 0 ? 'menor' : 'mayor'} que mi edad.`,
  }
  if (mode === 'progress') {
    const recovered = Math.max(0, firstReedad - result.reedad)
    return { label: 'AÑOS QUE HE RECUPERADO', value: String(recovered), text: recovered ? `Bajé ${recovered} ${recovered === 1 ? 'año' : 'años'} mi ReEdad desde mi primera visita.` : 'Cada pequeño paso cuenta. Sigo cuidando mis hábitos.' }
  }
  return { label: 'LA EDAD DE MIS HÁBITOS', value: String(result.reedad), text: `Tengo ${age}. La edad de mis hábitos es ${result.reedad}.` }
}

export async function downloadStory(content: CardContent, strongest: string, profileColor: string) {
  await document.fonts.ready
  const logo = new Image()
  logo.src = '/images/logo_nutricenter.jpg'
  await logo.decode()
  const canvas = document.createElement('canvas')
  canvas.width = 1080
  canvas.height = 1920
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas is unavailable')
  const tint = (amount: number) => {
    const channels = profileColor.slice(1).match(/.{2}/g)!.map((hex) => Math.round(parseInt(hex, 16) * (1 - amount) + 255 * amount))
    return `rgb(${channels.join(',')})`
  }
  ctx.fillStyle = tint(.88)
  ctx.fillRect(0, 0, 1080, 1920)
  ctx.strokeStyle = tint(.65)
  ctx.lineWidth = 3
  for (const offset of [0, 42]) {
    ctx.beginPath()
    ctx.ellipse(1030 + offset, 890 + offset, 510, 420, .6, 0, Math.PI * 2)
    ctx.stroke()
  }
  ctx.fillStyle = '#3d5931'
  ctx.font = '750 87px Montserrat'
  ctx.fillText('ReEdad', 85, 170)
  ctx.fillStyle = profileColor
  ctx.fillText('.', 440, 170)
  ctx.font = '500 30px Roboto'
  ctx.fillStyle = '#3d5931'
  ctx.fillText(content.label, 85, 370)
  ctx.font = '750 350px Montserrat'
  ctx.fillText(content.value, 65, 740)
  ctx.font = '400 60px Roboto'
  ctx.fillText('años', 85, 825)
  ctx.font = '600 57px Montserrat'
  let line = ''
  let y = 990
  for (const word of content.text.split(' ')) {
    const candidate = `${line}${line ? ' ' : ''}${word}`
    if (ctx.measureText(candidate).width > 880 && line) {
      ctx.fillText(line, 85, y)
      y += 80
      line = word
    } else line = candidate
  }
  if (line) ctx.fillText(line, 85, y)
  ctx.fillStyle = '#ffffff90'
  ctx.beginPath()
  ctx.roundRect(85, 1405, 680, 175, 30)
  ctx.fill()
  ctx.fillStyle = '#6f8355'
  ctx.font = '400 32px Roboto'
  ctx.fillText('Mi superpoder', 130, 1470)
  ctx.fillStyle = '#3d5931'
  ctx.font = '600 49px Montserrat'
  ctx.fillText(strongest, 130, 1540)
  ctx.font = '400 32px Roboto'
  ctx.fillText('¿Y el tuyo? Descubrilo', 85, 1776)
  ctx.fillText('en NutriCenter.', 85, 1820)
  ctx.save()
  ctx.globalCompositeOperation = 'multiply'
  ctx.drawImage(logo, 700, 1746, 290, 290 * logo.height / logo.width)
  ctx.restore()
  const link = document.createElement('a')
  link.download = 'mi-reedad.png'
  link.href = canvas.toDataURL('image/png')
  link.click()
}
