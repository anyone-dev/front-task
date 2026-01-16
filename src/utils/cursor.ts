function countDigits(str: string, limit: number): number {
    return str.slice(0, limit).replace(/\D/g, '').length
}

function findCursorPosition(formattedValue: string, targetDigitCount: number): number {
    let digitsSeen = 0

    // Edge case: if cursor should be at start
    if (targetDigitCount === 0) return 0

    for (let i = 0; i < formattedValue.length; i++) {
        if (/\d/.test(formattedValue[i])) {
            digitsSeen++
        }
        // If we've seen enough digits, we need to decide whether to place cursor here
        // or skip formatting chars (like spaces)
        if (digitsSeen === targetDigitCount) {
            // Look ahead: if next char is not a digit (e.g. space), we might want to skip it
            // But typically we just want to be after the current digit.
            return i + 1
        }
    }

    return formattedValue.length
}

export function updateInputWithCursorPreservation(input: HTMLInputElement, newValue: string) {
    const oldValue = input.value
    // If values match, do nothing to avoid resetting cursor unnecessarily
    if (oldValue === newValue) return

    const cursorPosition = input.selectionStart || 0
    const digitsBeforeCursor = countDigits(oldValue, cursorPosition)

    input.value = newValue

    const newCursorPos = findCursorPosition(newValue, digitsBeforeCursor)
    input.setSelectionRange(newCursorPos, newCursorPos)
}
