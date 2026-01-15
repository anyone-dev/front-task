<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="flex items-center gap-3">
      <img
        src="/img.png"
        alt="Samuel"
        class="w-14 h-14 rounded-full border-2 border-violet-500 object-cover"
      />
      <div>
        <label for="hours-input" class="block text-sm font-bold tracking-wide text-gray-700">
          SAMUEL IS
        </label>
        <div class="flex items-center gap-2">
          <input
            id="hours-input"
            :value="formattedValue"
            @input="handleInput"
            class="border border-gray-300 rounded px-2 py-1 text-lg outline-none"
            :style="{ width: inputWidth + 'px' }"
            placeholder="0"
          />
          <span class="text-gray-600">hours old</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const rawValue = ref('')

const formattedValue = computed(() => {
  if (!rawValue.value) return ''
  return rawValue.value.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
})

const inputWidth = computed(() => {
  const len = formattedValue.value.length
  return Math.max(72, len * 10) // approximate character width
})

function handleInput(e: any) {
  const input = e.target.value.replace(/\s/g, '')
  if (/^\d*$/.test(input)) {
    rawValue.value = input
  }
}
</script>
