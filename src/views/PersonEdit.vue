<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'
import { NumericInput } from '@/components/NumericInput'

const route = useRoute()

const personId = computed(() => Number(route.params.id))

const person = computed(() => {
  return store.people.find((p) => p.id === personId.value)
})

const isInputFocused = ref(false)

const ageInHours = computed({
  get: () => {
    return person.value?.ageInHours ?? 0
  },
  set: (value: number | null) => {
    const index = store.people.findIndex((p) => p.id === personId.value)
    if (index !== -1) {
      const safeValue = (value === null || value === undefined)
        ? 0
        : (typeof value === 'number' && !Number.isNaN(value) && isFinite(value))
          ? value
          : 0
      store.people[index].ageInHours = safeValue
    }
  },
})
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <div class="flex items-center gap-4">
      <img
        src="/img.png"
        :alt="person.name"
        :class="[
          'w-20 h-20 rounded-full object-cover',
          isInputFocused ? 'border-2 border-violet-500' : 'border-2 border-transparent'
        ]"
      />
      <NumericInput
        v-model="ageInHours"
        :label="`${person.name.toUpperCase()} IS`"
        caption="hours old"
        :min="0"
        @focus="isInputFocused = true"
        @blur="isInputFocused = false"
      />
    </div>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>
