<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: number
    placeholder?: string
    minWidth?: number
    extraWidth?: number
  }>(),
  {
    placeholder: '7',
    minWidth: 72,
    extraWidth: 20,
  },
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const inputValue = computed({
  get() {
    return String(props.modelValue)
  },

  set(value: string) {
    const digits = value.replace(/\D/g, '')
    emit('update:modelValue', digits ? Number(digits) : 0)
  },
})
</script>

<template>
  <input
    v-model="inputValue"
    v-thousands
    v-auto-width="{ min: minWidth, extra: extraWidth }"
    type="text"
    :placeholder="placeholder"
  />
</template>
