<script setup lang="ts">
import { ref } from 'vue'
import NumericInput from '@/components/NumericInput.vue'
import { normalizeNumericValue } from '@/components/numericInput.utils'
import { store } from '@/store'

const isFocused = ref(false)

function updateMinimumAge(value: number) {
  store.minimumAgeInMonths = normalizeNumericValue(value)
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <router-link to="/" class="text-[var(--primary)] hover:underline text-sm">&larr; Back</router-link>

    <h1 class="text-xl font-bold text-[var(--dark)]">Settings</h1>

    <div>
      <label
        for="min-age-input"
        :class="[
          'block font-[Koulen] text-[16px] leading-[15px] tracking-[0.32px] uppercase transition-colors',
          isFocused ? 'text-[var(--primary)]' : 'text-[var(--dark)]',
        ]"
      >
        Minimum age
      </label>
      <div class="flex items-center gap-3 mt-3">
        <NumericInput
          id="min-age-input"
          :model-value="normalizeNumericValue(store.minimumAgeInMonths)"
          aria-label="Minimum age in months"
          @update:model-value="updateMinimumAge"
          @focus="isFocused = true"
          @blur="isFocused = false"
        />
        <span class="text-[18px] text-[var(--dark)]" style="font-family: Inter, sans-serif">
          months
        </span>
      </div>
    </div>
  </div>
</template>
