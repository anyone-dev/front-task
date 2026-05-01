<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import NumericInput from '@/components/NumericInput.vue'
import { normalizeNumericValue } from '@/components/numericInput.utils'
import { store } from '@/store'

const route = useRoute()
const isFocused = ref(false)

const person = computed(() => {
  const id = Number(route.params.id)
  return store.people.find((p) => p.id === id)
})

function updateAge(value: number) {
  if (person.value) {
    person.value.ageInHours = normalizeNumericValue(value)
  }
}
</script>

<template>
  <div v-if="person" class="flex w-full max-w-2xl flex-col gap-6 py-8">
    <router-link
      to="/"
      class="text-sm text-[var(--primary)] hover:underline"
      style="font-family: Inter, sans-serif"
    >
      &larr; Back to list
    </router-link>

    <section class="rounded-[24px] bg-white p-8 shadow-[0_12px_30px_rgba(30,14,76,0.08)]">
      <div class="flex items-center gap-4">
        <img
          src="/img.png"
          :alt="person.name"
          :class="[
            'h-20 w-20 rounded-full object-cover transition-shadow',
            isFocused ? 'ring-2 ring-offset-2 ring-[var(--primary-light)]' : '',
          ]"
        />
        <div class="flex flex-col gap-3">
          <label
            for="hours-input"
            :class="[
              'font-[Koulen] text-[16px] leading-[15px] tracking-[0.32px] uppercase transition-colors',
              isFocused ? 'text-[var(--primary)]' : 'text-[var(--dark)]',
            ]"
          >
            {{ person.name }} is
          </label>
          <div class="flex items-center gap-3">
            <NumericInput
              id="hours-input"
              :model-value="normalizeNumericValue(person.ageInHours)"
              aria-label="Age in hours"
              @update:model-value="updateAge"
              @focus="isFocused = true"
              @blur="isFocused = false"
            />
            <span class="text-[18px] text-[var(--dark)]" style="font-family: Inter, sans-serif">
              hours old
            </span>
          </div>
        </div>
      </div>
    </section>
  </div>

  <div v-else>
    <p class="text-[var(--dark)] opacity-60">Person not found</p>
    <router-link to="/" class="text-[var(--primary)] hover:underline text-sm">Back to list</router-link>
  </div>
</template>
