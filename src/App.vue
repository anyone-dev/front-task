<template>
  <div class="max-w-lg mx-auto py-20 custom-el">
    <div class="flex items-center gap-[16px]">
      <div class="bg-gray-300 rounded-full w-[80px] h-[80px] overflow-hidden">
        <img
          src="@/raoul-droog-yMSecCHsIBc-unsplash.jpg"
          alt="pic"
          class="w-full h-full block object-cover"
        />
      </div>
      <div class="flex flex-col gap-[12px]">
        <label for="hours-old" class="sname" :class="{ 'active': isInputFocused }">{{ student.name }} is</label>
        <div class="flex gap-2 items-baseline">
          <div class="relative">
            <input
              v-model="displayValue"
              @input="handleInput"
              @blur="formatNumber"
              @focus="handleFocus"
              @keydown="handleKeydown"
              @click="handleClick"
              name="hours-old"
              id="hours-old"
              class="min-w-[72px] w-[72px] bg-transparent outline-none h-[44px] opacity-0 px-[8px] py-[2px]"
              type="text"
              inputmode="numeric"
              ref="inputRef"
            />
            <div
              class="absolute inset-0 pointer-events-none flex items-center justify-start h-[44px] border-[#CFCADF] border-[1.5px] rounded-md px-[8px] py-[2px]"
              :class="{ 'cursor-active': isInputFocused }"
            >
              <span class="val whitespace-pre text-[#CFCADF]" :class="{ 'text-black': isInputFocused }">{{ displayValue }}</span>
              <div
                v-if="isInputFocused"
                class="absolute top-2 bottom-2 w-0.5 bg-black cursor-caret"
                :style="{ left: cursorPosition + 'px' }"
              ></div>
            </div>
          </div>
          <div class="text whitespace-nowrap">hours old</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'

const student = {
  name: 'Hugh',
  age: null as number | null,
  image: null,
}

const displayValue = ref('')
const inputRef = ref<HTMLInputElement>()
const isInputFocused = ref(false)
const cursorPosition = ref(0)

const createMeasurementSpan = () => {
  const span = document.createElement('span')
  span.className = 'whitespace-pre invisible absolute'
  span.style.fontSize = '18px'
  span.style.fontFamily = 'sans-serif'
  return span
}

const getCursorPixelPosition = (input: HTMLInputElement, cursorIndex: number): number => {
  const container = input.parentElement
  if (!container) return 0

  const measurementSpan = createMeasurementSpan()
  measurementSpan.textContent = displayValue.value.substring(0, cursorIndex)

  container.appendChild(measurementSpan)
  const position = measurementSpan.offsetWidth
  container.removeChild(measurementSpan)

  return position + 8
}

const updateCursorPosition = () => {
  if (!inputRef.value || !isInputFocused.value) return

  const input = inputRef.value
  const cursorIndex = input.selectionStart || 0
  cursorPosition.value = getCursorPixelPosition(input, cursorIndex)
}

const handleFocus = () => {
  isInputFocused.value = true
  clearFormatting()
  nextTick(() => {
    updateCursorPosition()
  })
}

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement

  const numericValue = target.value.replace(/\D/g, '')

  student.age = numericValue ? Number(numericValue) : null
  displayValue.value = formatNumberWithSpaces(numericValue)

  nextTick(() => {
    adjustInputWidth()
    updateCursorPosition()
  })
}

const handleClick = () => {
  nextTick(updateCursorPosition)
}

const handleKeydown = () => {
  nextTick(updateCursorPosition)
}

const formatNumberWithSpaces = (value: string): string => {
  const numericValue = value.replace(/\D/g, '')
  if (!numericValue) return ''
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const formatNumber = () => {
  isInputFocused.value = false
  if (displayValue.value) {
    displayValue.value = formatNumberWithSpaces(displayValue.value)
    nextTick(adjustInputWidth)
  }
}

const clearFormatting = () => {
  if (displayValue.value) {
    displayValue.value = displayValue.value
    nextTick(adjustInputWidth)
  }
}

const adjustInputWidth = () => {
  if (!inputRef.value) return

  const input = inputRef.value
  const span = input.parentElement?.querySelector('span')

  if (span) {
    const newWidth = Math.max(72, span.scrollWidth + 16)
    input.style.width = `${newWidth}px`
  }
}

watch(displayValue, () => {
  if (isInputFocused.value) {
    nextTick(updateCursorPosition)
  }
})
</script>

<style scoped>
.custom-el {
  font-family: 'Inter', sans-serif;
  font-optical-sizing: auto;
  font-weight: 400;
  font-style: normal;
  font-size: 18px;
  line-height: 1;
}
.sname {
  font-family: 'Koulen', sans-serif;
  font-weight: 400;
  font-style: normal;
  &.active {
    color: #906fee;
  }
}

input {
  font-family: sans-serif;
}

.cursor-caret {
  animation: blink 1s infinite;
}

.cursor-active {
  border-color: #906fee;
}

.invisible {
  opacity: 0;
  pointer-events: none;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
