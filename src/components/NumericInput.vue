<script setup lang="ts">
import { useNumericInput } from "@/composables/useNumericInput";
import type { NumericInputProps, NumericInputEmit } from "@/types/numericInput";

const props = defineProps<NumericInputProps>();
const emit = defineEmits<NumericInputEmit>();

const {
  inputRef,
  measureRef,
  formattedValue,
  isFocused,
  enableTransition,
  width,
  onInput,
  handleFocus,
  handleBlur,
  handleBeforeInput,
} = useNumericInput(props, emit);
</script>

<template>
  <div class="relative inline-flex flex-col">
    <label
      v-if="label"
      class="mb-3 select-none font-[Koulen] text-base leading-3.75 tracking-[0.02em] transition-colors"
      :class="[isFocused ? activeLabelColor : labelColor, props.labelUppercase ? 'uppercase' : '']"
    >
      {{ label }}
    </label>

    <div class="relative h-11 min-w-18">
      <input
        ref="inputRef"
        type="text"
        inputmode="numeric"
        placeholder="0"
        :value="formattedValue"
        @input="onInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @beforeinput="handleBeforeInput"
        class="peer absolute left-0 top-0 z-10 h-11 px-2 pr-4 py-1 text-lg font-medium outline-none transition-colors"
        :class="[
          isFocused ? activeInputColor : inputColor,
          !isFocused && hoverInputColor ? `hover:${hoverInputColor}` : null,
          caretColor,
        ]"
        :style="{ width: `${width}px` }"
      />

      <div
        class="absolute left-0 top-0 h-11 rounded-md box-border border"
        :class="[
          isFocused
            ? ['border-[1.5px]', activeBorderColor]
            : [borderColor, hoverBorderColor ? `peer-hover:${hoverBorderColor}` : ''],
        ]"
        :style="{
          width: `${width}px`,
          transition: enableTransition
            ? 'width 0.1s ease-in-out, border-color 0.1s ease'
            : 'none',
        }"
      />

      <span
        v-if="caption"
        class="absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-lg select-none"
        :class="captionColor"
        :style="{
          left: `${width + 12}px`,
          transition: enableTransition ? 'left 0.15s ease-in-out' : 'none',
        }"
      >
        {{ caption }}
      </span>
    </div>

    <span ref="measureRef" class="absolute invisible whitespace-pre px-2 pr-4 text-lg">
      {{ formattedValue || "0" }}
    </span>
  </div>
</template>
