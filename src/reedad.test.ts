import { describe, expect, it } from 'vitest'
import { calculate, defaultQuestions, getProfile, isAccessId } from './reedad'

const scoresAt = (optionIndex: number) => Object.fromEntries(
  defaultQuestions.map((question) => [question.id, question.options[optionIndex].score]),
)

describe('ReEdad calculation', () => {
  it('caps a strong result at 10 years below the real age', () => {
    const result = calculate(32, scoresAt(0), 'Energía')
    expect(result.reedad).toBe(22)
    expect(result.difference).toBe(-10)
    expect(result.profile.name).toBe('Modo Reversa')
  })

  it('caps a high result at 15 years above the real age', () => {
    const result = calculate(32, scoresAt(3), 'Peso')
    expect(result.reedad).toBe(47)
    expect(result.difference).toBe(15)
    expect(result.profile.name).toBe('Listo para el cambio')
  })

  it('uses documented profile boundaries', () => {
    expect(getProfile(-5).name).toBe('Modo Reversa')
    expect(getProfile(-1).name).toBe('Vas adelantado')
    expect(getProfile(3).name).toBe('En punto')
    expect(getProfile(7).name).toBe('Con años por recuperar')
    expect(getProfile(8).name).toBe('Listo para el cambio')
  })

  it('does not promise extra years when every habit already has the best score', () => {
    expect(calculate(32, scoresAt(0), 'Energía').possibleYears).toBe(0)
  })

  it('accounts for the upper cap when showing the improvement available in the quiz', () => {
    // Raw total 23, capped at +15. Improving nutrition by 10 yields +13: 2 visible years.
    expect(calculate(32, scoresAt(3), 'Peso').possibleYears).toBe(2)
  })

  it('accepts the eight-digit DUI plus verifier format', () => {
    expect(isAccessId('12345678-9')).toBe(true)
    expect(isAccessId('123456789')).toBe(false)
    expect(isAccessId('12345678-99')).toBe(false)
    expect(isAccessId('1234567-9')).toBe(false)
  })
})
