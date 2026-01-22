<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

export type InputNumberType = number | null | undefined
interface Props {
  label?: string
  caption?: string
  modelValue: InputNumberType
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: InputNumberType): void
}>()

const inputValue = ref<string>('')
const inputRef = ref<HTMLInputElement | null>(null)
const mirrorRef = ref<HTMLElement | null>(null)

function format(v: string): string {
  return v
    .replace(/\D/g, '')
    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

function updateWidth() {
  if (!mirrorRef.value || !inputRef.value) return

  mirrorRef.value.textContent = inputValue.value || '0'

  inputRef.value.style.width =
    Math.max(72, mirrorRef.value.offsetWidth) + 'px'
}

function adjustCursor(
  input: HTMLInputElement,
  oldValue: string,
  oldCursor: number,
  newValue: string
) {
  let digitsBeforeCursor = 0
  for (let i = 0; i < oldCursor; i++) {
    if (/\d/.test(oldValue[i] || '')) digitsBeforeCursor++
  }

  let newCursor = 0
  let digitsSeen = 0
  for (let i = 0; i < newValue.length; i++) {
    if (/\d/.test(newValue[i] || '')) digitsSeen++
    if (digitsSeen >= digitsBeforeCursor) {
      newCursor = i + 1
      break
    }
  }
  if (digitsSeen < digitsBeforeCursor) newCursor = newValue.length

  input.setSelectionRange(newCursor, newCursor)
}

function onKeyDown(e: KeyboardEvent) {
  const ctrl = e.ctrlKey || e.metaKey;
  const el = e.target as HTMLInputElement;

  if (
    e.key === 'Backspace' ||
    e.key === 'Delete' ||
    e.key === 'Tab' ||
    e.key === 'Escape' ||
    e.key === 'Enter' ||
    e.key === 'Home' ||
    e.key === 'End' ||
    e.key.startsWith('Arrow') ||
    (e.key === 'a' && ctrl) ||
    (e.key === 'c' && ctrl) ||
    (e.key === 'v' && ctrl) ||
    (e.key === 'x' && ctrl) ||
    (e.key === 'z' && ctrl) ||
    (e.key === 'r' && ctrl)
  ) {
    return;
  }

  if (!/^\d$/.test(e.key)) {
    e.preventDefault();
    return;
  }

  if (e.key === '0') {
    const selectionStart = el.selectionStart || 0;
    const selectionEnd = el.selectionEnd || 0;
    const currentValue = el.value.replace(/\s/g, '');
    const digitsOnly = currentValue.replace(/\D/g, '');

    const isFullSelection = selectionStart === 0 && selectionEnd === el.value.length;

    if (!isFullSelection && digitsOnly === '0') {
      e.preventDefault();
      return;
    }

    if (!isFullSelection && selectionStart === 0 && selectionEnd === 0 && digitsOnly.length > 0) {
      const withoutLeadingZeros = digitsOnly.replace(/^0+/, '');
      if (withoutLeadingZeros.length > 0) {
        e.preventDefault();
        return;
      }
    }
  }
}

function onInput(e: InputEvent) {
  const el = e.target as HTMLInputElement
  const oldValue = el.value
  const oldCursor = el.selectionStart || 0

  let raw = oldValue.replace(/\D/g, '')

  if (raw.length > 0) {
    const originalRaw = raw
    raw = raw.replace(/^0+/, '')
    if (raw === '' && originalRaw.length > 0) {
      raw = '0'
    }
  }

  const formatted = format(raw)

  inputValue.value = formatted
  nextTick(() => adjustCursor(el, oldValue, oldCursor, formatted))

  emit('update:modelValue', raw && raw !== '0' ? Number(raw) : (raw === '0' ? 0 : null))
  updateWidth()
}

watch(
  () => props.modelValue,
  (v) => {
    if (document.activeElement === inputRef.value) return

    inputValue.value =
      v !== null && v !== undefined
        ? format(String(v))
        : ''

    setTimeout(() => {
      requestAnimationFrame(() => {
        updateWidth()
      })
    }, 10)
  },
  { immediate: true }
)
</script>

<template>
  <div class="app-input-number">
    <label class="relative inline-block">
      <span class="block font-['Koulen'] leading-[15px] text-blue-800">{{ label || '' }}</span>
      <input
        ref="inputRef"
        class="
          clone-class
          block h-11 min-w-18 mt-3 rounded-md border-[1px] border-gray-300 text-zinc-950
          transition-[border-color]
          focus:border-violet-500
          focus:border-[1.5px]
        "
        :value="inputValue"
        inputmode="numeric"
        autocomplete="off"
        @keydown="onKeyDown"
        @input="onInput"
      />
      <span
        ref="mirrorRef"
        class="
          clone-class
          absolute top-0 left-0 -z-1 invisible whitespace-pre border-[1.5px]
        "
      />
    </label>

    <span
      class="ml-3 font-['Inter'] text-zinc-950"
    >
      {{ caption || '' }}
    </span>
  </div>
</template>

<style scoped>
.app-input-number {
  .clone-class {
    box-sizing: border-box;
    padding: 0 16px 0 8px;
    outline: none;
    font-family: 'Inter', sans-serif;
    font-size: 18px;
    line-height: 18px;
    font-weight: 500;
  }
  input:focus {
    padding: 0 15.5px 0 7.5px;
  }
}
</style>
