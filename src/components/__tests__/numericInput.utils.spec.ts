import { describe, expect, it } from 'vitest'
import {
  countDigitsBefore,
  formatWithSpaces,
  normalizeDigitString,
  normalizeNumericValue,
  posFromDigitCount,
} from '@/components/numericInput.utils'

describe('numericInput utils', () => {
  it('formats digit groups with spaces', () => {
    expect(formatWithSpaces('1')).toBe('1')
    expect(formatWithSpaces('1442')).toBe('1 442')
    expect(formatWithSpaces('1000000')).toBe('1 000 000')
  })

  it('normalizes digit strings to zero-or-positive integers', () => {
    expect(normalizeDigitString('')).toBe('0')
    expect(normalizeDigitString('000')).toBe('0')
    expect(normalizeDigitString('00123')).toBe('123')
    expect(normalizeDigitString('a1b2c3')).toBe('123')
  })

  it('clamps invalid numeric values', () => {
    expect(normalizeNumericValue(-5)).toBe(0)
    expect(normalizeNumericValue(0)).toBe(0)
    expect(normalizeNumericValue(42.9)).toBe(42)
    expect(normalizeNumericValue(Number.NaN)).toBe(0)
  })

  it('keeps caret calculations stable across formatted values', () => {
    expect(countDigitsBefore('1 234 567', 5)).toBe(4)
    expect(posFromDigitCount('1 234 567', 0)).toBe(0)
    expect(posFromDigitCount('1 234 567', 4)).toBe(5)
  })
})
