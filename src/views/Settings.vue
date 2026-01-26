<script setup lang="ts">
import { computed } from 'vue'
import { store } from '@/store'
import { NumericInput } from '@/components/NumericInput'

const minimumAgeInMonths = computed({
  get: () => store.minimumAgeInMonths,
  set: (value: number | null) => {
    if (value === null || value === undefined) {
      store.minimumAgeInMonths = 0
    } else if (typeof value === 'number' && !Number.isNaN(value) && isFinite(value)) {
      store.minimumAgeInMonths = value
    } else {
      store.minimumAgeInMonths = 0
    }
  },
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <h1 class="text-xl font-bold text-gray-700">Settings</h1>

    <NumericInput
      v-model="minimumAgeInMonths"
      label="MINIMUM AGE"
      caption="months"
      :min="0"
    />
  </div>
</template>
