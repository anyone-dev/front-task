import { ref, watch, nextTick } from 'vue'

const MAX_DIGITS = 15

export function useNumericInput(
  modelValue: () => number | null,
  emit: (value: number | null) => void,
  min: number = 0
) {
  const displayValue = ref<string>('')
  const isFocused = ref(false)
  const inputElement = ref<HTMLInputElement | null>(null)

  function formatNumber(value: number | null | string | undefined): string {
    if (value === null || value === undefined) {
      return '0'
    }

    let num: number
    if (typeof value === 'string') {
      num = parseFloat(value)
      if (isNaN(num) || !isFinite(num)) {
        return '0'
      }
    } else {
      num = value
      if (isNaN(num) || !isFinite(num)) {
        return '0'
      }
    }

    const clamped = Math.max(min, Math.floor(num))
    return clamped.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  function countDigitsBeforePosition(text: string, position: number): number {
    let count = 0
    const maxPos = Math.min(position, text.length)
    for (let i = 0; i < maxPos; i++) {
      const char = text.charAt(i)
      if (/\d/.test(char)) {
        count++
      }
    }
    return count
  }

  function findPositionAfterDigits(text: string, digitCount: number): number {
    if (digitCount === 0) {
      return 0
    }
    let count = 0
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i)
      if (/\d/.test(char)) {
        count++
        if (count === digitCount) {
          return i + 1
        }
      }
    }
    return text.length
  }

  function processNumericValue(value: string, target?: HTMLInputElement): void {
    const cleaned = value.replace(/\D/g, '')

    if (cleaned === '') {
      displayValue.value = '0'
      emit(min)
      if (target) {
        nextTick(() => {
          target.setSelectionRange(1, 1)
        })
      }
      return
    }

    const trimmed = cleaned.length > MAX_DIGITS ? cleaned.slice(0, MAX_DIGITS) : cleaned

    const num = parseInt(trimmed, 10)
    if (!isNaN(num) && num <= Number.MAX_SAFE_INTEGER) {
      const clamped = Math.max(min, num)
      const formatted = formatNumber(clamped)

      let newCursorPosition = formatted.length

      if (target && target.selectionStart !== null) {
        const cursorPosition = target.selectionStart
        const currentInputValue = target.value

        const digitsBeforeCursorInInput = countDigitsBeforePosition(currentInputValue, cursorPosition)
        newCursorPosition = findPositionAfterDigits(formatted, digitsBeforeCursorInInput)
      }

      displayValue.value = formatted
      emit(clamped)

      if (target) {
        nextTick(() => {
          const finalPosition = Math.min(Math.max(0, newCursorPosition), formatted.length)
          target.setSelectionRange(finalPosition, finalPosition)
        })
      }
    }
  }

  function handleInput(event: Event) {
    const target = event.target as HTMLInputElement
    processNumericValue(target.value, target)
  }

  function handleFocus(event: FocusEvent) {
    isFocused.value = true
    inputElement.value = event.target as HTMLInputElement
  }

  function handleBlur() {
    if (!isFocused.value) {
      return
    }

    isFocused.value = false

    const inputValue = inputElement.value?.value || displayValue.value
    const currentDisplayValue = inputValue.trim().replace(/\s/g, '')

    if (currentDisplayValue === '') {
      const currentValue = modelValue()
      if (
        currentValue !== null &&
        currentValue !== undefined &&
        typeof currentValue === 'number' &&
        !Number.isNaN(currentValue) &&
        isFinite(currentValue) &&
        currentValue <= Number.MAX_SAFE_INTEGER
      ) {
        displayValue.value = formatNumber(currentValue)
        return
      }
      displayValue.value = formatNumber(min)
      nextTick(() => {
        emit(min)
      })
      return
    }

    if (currentDisplayValue === '0') {
      if (min === 0) {
        displayValue.value = formatNumber(0)
        nextTick(() => {
          emit(0)
        })
      } else {
        displayValue.value = formatNumber(min)
        nextTick(() => {
          emit(min)
        })
      }
      return
    }

    if (currentDisplayValue.length > MAX_DIGITS) {
      const trimmed = currentDisplayValue.slice(0, MAX_DIGITS)
      const parsed = parseInt(trimmed, 10)
      if (!isNaN(parsed) && isFinite(parsed)) {
        const clamped = Math.max(min, parsed)
        displayValue.value = formatNumber(clamped)
        nextTick(() => {
          emit(clamped)
        })
      } else {
        displayValue.value = formatNumber(min)
        nextTick(() => {
          emit(min)
        })
      }
      return
    }

    const parsedFromDisplay = parseInt(currentDisplayValue, 10)

    if (!isNaN(parsedFromDisplay) && isFinite(parsedFromDisplay) && parsedFromDisplay <= Number.MAX_SAFE_INTEGER) {
      const clamped = Math.max(min, parsedFromDisplay)
      displayValue.value = formatNumber(clamped)
      nextTick(() => {
        emit(clamped)
      })
    } else {
      const currentValue = modelValue()
      if (
        currentValue !== null &&
        currentValue !== undefined &&
        typeof currentValue === 'number' &&
        !isNaN(currentValue) &&
        isFinite(currentValue) &&
        currentValue <= Number.MAX_SAFE_INTEGER
      ) {
        displayValue.value = formatNumber(currentValue)
      } else {
        displayValue.value = formatNumber(min)
        nextTick(() => {
          emit(min)
        })
      }
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'Enter',
      'ArrowLeft',
      'ArrowRight',
      'ArrowUp',
      'ArrowDown',
      'Home',
      'End',
    ]

    if (allowedKeys.includes(event.key)) {
      return
    }

    if (event.ctrlKey || event.metaKey) {
      if (['a', 'c', 'v', 'x'].includes(event.key.toLowerCase())) {
        return
      }
    }

    if (/\d/.test(event.key)) {
      const target = event.target as HTMLInputElement
      const currentValue = target.value.replace(/\s/g, '').replace(/\D/g, '')
      if (currentValue.length >= MAX_DIGITS) {
        event.preventDefault()
        return
      }
    } else {
      event.preventDefault()
    }
  }

  function handlePaste(event: ClipboardEvent) {
    event.preventDefault()
    const target = event.target as HTMLInputElement
    const pasted = event.clipboardData?.getData('text') || ''
    processNumericValue(pasted, target)
  }

  watch(
    () => modelValue(),
    (newValue) => {
      if (!isFocused.value) {
        if (newValue === null || newValue === undefined) {
          const currentFormatted = formatNumber(min)
          if (displayValue.value !== currentFormatted) {
            displayValue.value = currentFormatted
          }
          return
        }
        if (typeof newValue !== 'number' || Number.isNaN(newValue) || !isFinite(newValue)) {
          const currentFormatted = formatNumber(min)
          if (displayValue.value !== currentFormatted) {
            displayValue.value = currentFormatted
          }
          return
        }
        const formatted = formatNumber(newValue)
        if (displayValue.value !== formatted) {
          displayValue.value = formatted
        }
      }
    },
    { immediate: true }
  )

  return {
    displayValue,
    isFocused,
    inputElement,
    handleInput,
    handleFocus,
    handleBlur,
    handleKeydown,
    handlePaste,
  }
}
