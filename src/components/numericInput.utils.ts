export function formatWithSpaces(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '')
}

export function normalizeDigitString(value: string): string {
  const digits = stripNonDigits(value)
  const withoutLeadingZeros = digits.replace(/^0+(?=\d)/, '')
  return withoutLeadingZeros || '0'
}

export function normalizeNumericValue(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, Math.trunc(value))
}

export function countDigitsBefore(formatted: string, position: number): number {
  let count = 0

  for (let i = 0; i < position && i < formatted.length; i++) {
    const char = formatted[i]
    if (char !== undefined && char >= '0' && char <= '9') count++
  }

  return count
}

export function posFromDigitCount(formatted: string, digitCount: number): number {
  if (digitCount <= 0) return 0

  let count = 0

  for (let i = 0; i < formatted.length; i++) {
    const char = formatted[i]
    if (char !== undefined && char >= '0' && char <= '9') {
      count++
      if (count === digitCount) return i + 1
    }
  }

  return formatted.length
}
