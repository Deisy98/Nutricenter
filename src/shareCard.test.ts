import { describe, expect, it } from 'vitest'
import { calculate, defaultQuestions } from './reedad'
import { cardContent } from './shareCard'

const answers = Object.fromEntries(defaultQuestions.map((question) => [question.id, question.options[0].score]))
const result = calculate(42, answers, 'Energía')

describe('Privacy of share-card variants', () => {
  it('includes age only when the complete-number card is chosen', () => {
    const card = cardContent('full', result, 42, 37)
    expect(card.value).toBe('32')
    expect(card.text).toContain('Tengo 42')
  })

  it('shows only the difference without exposing either age', () => {
    const card = cardContent('difference', result, 42, 37)
    expect(card.value).toBe('−10')
    expect(card.text).not.toMatch(/42|32/)
  })

  it('shows progress relative to the first visit without exposing either measurement', () => {
    const card = cardContent('progress', result, 42, 37)
    expect(card.value).toBe('5')
    expect(card.text).not.toMatch(/42|37|32/)
  })
})
