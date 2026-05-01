<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import {
  countDigitsBefore,
  formatWithSpaces,
  normalizeDigitString,
  normalizeNumericValue,
  posFromDigitCount,
  stripNonDigits,
} from '@/components/numericInput.utils'
import {
  defaultNumericInputHintMessages,
  type NumericInputHintMessages,
} from '@/components/numericInput.copy'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(
  defineProps<{
    modelValue: number
    placeholder?: string
    minWidth?: number
    hintMessages?: NumericInputHintMessages
  }>(),
  {
    placeholder: '0',
    minWidth: 72,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
  focus: []
  blur: []
}>()

const attrs = useAttrs()
const inputRef = ref<HTMLInputElement | null>(null)
const mirrorRef = ref<HTMLSpanElement | null>(null)

const hint = ref<{ text: string; type: 'info' | 'error' } | null>(null)
let hintTimer: ReturnType<typeof setTimeout> | undefined
let cleanupFontsListener: (() => void) | undefined

function getHintMessages(): NumericInputHintMessages {
  return props.hintMessages ?? defaultNumericInputHintMessages
}

function getHorizontalChromePx(input: HTMLInputElement) {
  const styles = window.getComputedStyle(input)
  const padding =
    parseFloat(styles.paddingLeft || '0') + parseFloat(styles.paddingRight || '0')
  const border =
    parseFloat(styles.borderLeftWidth || '0') + parseFloat(styles.borderRightWidth || '0')

  return padding + border
}

// --- Display value ---

const displayValue = ref(formatWithSpaces(String(normalizeNumericValue(props.modelValue))))

watch(
  () => props.modelValue,
  (val) => {
    const normalized = normalizeNumericValue(val)
    const current = Number(stripNonDigits(displayValue.value) || '0')
    if (current !== normalized) {
      displayValue.value = formatWithSpaces(String(normalized))
      nextTick(syncWidth)
    }
  },
)

// --- Auto-width via mirror span ---

function syncWidth() {
  if (!mirrorRef.value || !inputRef.value) return
  // Width must be recomputed from actual runtime styles because webfonts
  // and focused border/padding states can differ from the initial estimate.
  const textWidth = Math.ceil(mirrorRef.value.getBoundingClientRect().width)
  const chromeWidth = getHorizontalChromePx(inputRef.value)
  const caretBuffer = 4
  inputRef.value.style.width = `${Math.max(props.minWidth, Math.ceil(textWidth + chromeWidth + caretBuffer))}px`
}

function syncWidthAfterFontsLoad() {
  if (!('fonts' in document)) return

  document.fonts.ready.then(() => {
    nextTick(syncWidth)
  })

  const handleFontsLoaded = () => {
    nextTick(syncWidth)
  }

  document.fonts.addEventListener?.('loadingdone', handleFontsLoaded)
  cleanupFontsListener = () => {
    document.fonts.removeEventListener?.('loadingdone', handleFontsLoaded)
  }
}

onMounted(() => {
  syncWidth()
  syncWidthAfterFontsLoad()
})

// --- Hint ---

function showHint(text: string, type: 'info' | 'error') {
  if (hintTimer !== undefined) clearTimeout(hintTimer)
  hint.value = { text, type }
  hintTimer = setTimeout(() => {
    hint.value = null
  }, 3500)
}

// --- Core: apply digits and restore caret ---

function commit(digits: string, caretDigitPos: number) {
  const clean = normalizeDigitString(digits)
  const normalized = normalizeNumericValue(Number(clean))
  const formatted = formatWithSpaces(String(normalized))
  displayValue.value = formatted
  emit('update:modelValue', normalized)

  const newCaret = posFromDigitCount(formatted, caretDigitPos)
  nextTick(() => {
    syncWidth()
    inputRef.value?.setSelectionRange(newCaret, newCaret)
  })
}

// --- Event handlers ---

function onInput(e: Event) {
  const el = e.target as HTMLInputElement
  const caret = el.selectionStart ?? el.value.length
  const digits = stripNonDigits(el.value)
  const digitCaret = countDigitsBefore(el.value, caret)
  commit(digits, digitCaret)
}

function onPaste(e: ClipboardEvent) {
  e.preventDefault()
  const text = e.clipboardData?.getData('text') ?? ''
  if (!text) return

  const pastedDigits = stripNonDigits(text)
  const hadNonDigits = text.length !== pastedDigits.length

  if (!pastedDigits) {
    showHint(getHintMessages().noDigits, 'error')
    return
  }

  const el = inputRef.value
  if (!el) return
  const start = el.selectionStart ?? 0
  const end = el.selectionEnd ?? 0
  const cur = stripNonDigits(displayValue.value)

  const dBefore = countDigitsBefore(displayValue.value, start)
  const dEnd = countDigitsBefore(displayValue.value, end)

  const newDigits = cur.slice(0, dBefore) + pastedDigits + cur.slice(dEnd)
  commit(newDigits, dBefore + pastedDigits.length)

  if (hadNonDigits) {
    showHint(getHintMessages().extractedDigits(formatWithSpaces(pastedDigits)), 'info')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.ctrlKey || e.metaKey || e.altKey) return
  if (e.key.length === 1 && (e.key < '0' || e.key > '9')) {
    e.preventDefault()
  }
}

function onFocus() {
  emit('focus')
  syncWidth()
}

function onBlur() {
  emit('blur')
  syncWidth()
}

onBeforeUnmount(() => {
  if (hintTimer !== undefined) clearTimeout(hintTimer)
  cleanupFontsListener?.()
})
</script>

<template>
  <div class="numeric-input-wrap">
    <input
      ref="inputRef"
      :value="displayValue"
      :placeholder="placeholder"
      :style="{ minWidth: `${minWidth}px` }"
      v-bind="attrs"
      class="numeric-input"
      inputmode="numeric"
      @input="onInput"
      @paste="onPaste"
      @keydown="onKeydown"
      @focus="onFocus"
      @blur="onBlur"
    />
    <span ref="mirrorRef" class="numeric-input-mirror" aria-hidden="true">{{
      displayValue || placeholder
    }}</span>
    <Transition name="hint">
      <span v-if="hint" :class="['numeric-input-hint', `numeric-input-hint--${hint.type}`]">
        {{ hint.text }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
.numeric-input-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.numeric-input {
  height: 44px;
  padding: 8px 16px 8px 8px;
  border: 1px solid var(--light-grey);
  border-radius: 6px;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  color: var(--dark);
  background: transparent;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.numeric-input::placeholder {
  color: var(--dark);
  opacity: 0.3;
}

.numeric-input:hover {
  border-color: var(--mid-grey);
}

.numeric-input:focus {
  border-width: 1.5px;
  border-color: var(--primary-light);
  /* compensate 0.5px growth to prevent layout shift */
  padding: 7.5px 15.5px 7.5px 7.5px;
}

.numeric-input-mirror {
  visibility: hidden;
  position: absolute;
  left: 0;
  top: 0;
  white-space: pre;
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  font-size: 18px;
  pointer-events: none;
}

.numeric-input-hint {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 6px;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Inter', sans-serif;
  font-size: 12px;
  line-height: 1.4;
  white-space: nowrap;
  z-index: 10;
}

.numeric-input-hint--info {
  color: var(--primary);
  background: color-mix(in srgb, var(--primary-light) 20%, transparent);
}

.numeric-input-hint--error {
  color: var(--error);
  background: color-mix(in srgb, var(--error) 20%, transparent);
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
