export interface NumericInputHintMessages {
  noDigits: string
  extractedDigits: (digits: string) => string
}

export const defaultNumericInputHintMessages: NumericInputHintMessages = {
  noDigits: 'Pasted text contains no digits — nothing inserted',
  extractedDigits: (digits: string) => `Extracted digits from pasted text: ${digits}`,
}
