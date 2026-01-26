<script setup lang="ts">
import { computed, useId, ref } from 'vue'
import type { NumericInputProps, NumericInputEmits } from '@/types/numeric-input'
import { useNumericInput } from '@/composables/useNumericInput'
import { useInputWidth } from '@/composables/useInputWidth'
import { NUMERIC_INPUT_COLORS, NUMERIC_INPUT_SIZES } from '@/constants/numeric-input'

const props = withDefaults(defineProps<NumericInputProps>(), {
  label: '',
  caption: '',
  placeholder: '0',
  disabled: false,
  min: 0,
})

const emit = defineEmits<NumericInputEmits>()

const uniqueId = useId()
const inputId = computed(() => `numeric-input-${uniqueId}`)
const labelId = computed(() => `numeric-input-label-${uniqueId}`)
const captionId = computed(() => `numeric-input-caption-${uniqueId}`)

const numericInput = useNumericInput(
  () => props.modelValue,
  (value) => emit('update:modelValue', value),
  props.min
)

const widthComposable = useInputWidth(() => numericInput.displayValue.value)

const displayValue = computed(() => numericInput.displayValue.value)

const inputClasses = computed(() => {
  const base = 'flex items-center rounded-md border transition-colors outline-none'
  const padding = 'px-2 py-2 pr-4'
  const height = 'h-11'

  if (props.disabled) {
    return `${base} ${padding} ${height} cursor-not-allowed`
  }

  if (numericInput.isFocused.value) {
    return `${base} ${padding} ${height} border-[1.5px]`
  }

  return `${base} ${padding} ${height}`
})

const inputStyles = computed(() => {
  let borderColor = NUMERIC_INPUT_COLORS.border.default as string

  if (props.disabled) {
    borderColor = NUMERIC_INPUT_COLORS.border.disabled
  } else if (numericInput.isFocused.value) {
    borderColor = NUMERIC_INPUT_COLORS.border.active
  } else if (isHovered.value) {
    borderColor = NUMERIC_INPUT_COLORS.border.hover
  }

  const backgroundColor = props.disabled ? NUMERIC_INPUT_COLORS.background.disabled : 'transparent'

  return {
    width: `${widthComposable.inputWidth.value}px`,
    minWidth: `${NUMERIC_INPUT_SIZES.minWidth}px`,
    borderColor,
    backgroundColor,
  }
})

const labelStyles = computed(() => {
  const color = props.disabled
    ? NUMERIC_INPUT_COLORS.label.default
    : numericInput.isFocused.value
      ? NUMERIC_INPUT_COLORS.label.active
      : NUMERIC_INPUT_COLORS.label.default

  return {
    color,
    opacity: props.disabled ? 0.5 : 1,
  }
})

const textColor = NUMERIC_INPUT_COLORS.text
const isHovered = ref(false)

function handleFocus(event: FocusEvent) {
  numericInput.handleFocus(event)
  emit('focus')
}

function handleBlur() {
  numericInput.handleBlur()
  emit('blur')
}

function handleMouseEnter() {
  if (!props.disabled && !numericInput.isFocused.value) {
    isHovered.value = true
  }
}

function handleMouseLeave() {
  isHovered.value = false
}
</script>

<template>
  <div class="flex flex-col" :style="{ gap: `${NUMERIC_INPUT_SIZES.gap.label}px` }">
    <label
      v-if="label"
      :id="labelId"
      :for="inputId"
      class="block text-base font-normal tracking-wide"
      :style="labelStyles"
    >
      {{ label }}
    </label>

    <div class="flex items-center" :style="{ gap: `${NUMERIC_INPUT_SIZES.gap.caption}px` }">
      <div class="relative inline-block">
        <input
          :id="inputId"
          :value="displayValue"
          :disabled="disabled"
          :placeholder="placeholder"
          :class="inputClasses"
          :style="inputStyles"
          :aria-label="label || 'Numeric input'"
          :aria-describedby="caption ? captionId : undefined"
          :aria-labelledby="label ? labelId : undefined"
          type="text"
          inputmode="numeric"
          autocomplete="off"
          @input="numericInput.handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="numericInput.handleKeydown"
          @paste="numericInput.handlePaste"
          @mouseenter="handleMouseEnter"
          @mouseleave="handleMouseLeave"
        />
      </div>

      <span
        v-if="caption"
        :id="captionId"
        class="text-lg font-normal"
        :style="{ color: textColor }"
      >
        {{ caption }}
      </span>
    </div>

    <span
      :ref="widthComposable.measureElement"
      class="invisible absolute whitespace-nowrap pointer-events-none"
      style="font-weight: 500; font-size: 18px; line-height: 1.21;"
    >
      {{ displayValue || placeholder }}
    </span>
  </div>
</template>
