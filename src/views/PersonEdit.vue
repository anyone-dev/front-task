<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'
import AppInput, { type InputNumberType } from "@/components/AppInputNumber.vue";

const route = useRoute()

const person = computed(() => {
  const id = Number(route.params.id)
  return store.people.find((p) => p.id === id)
})

const label = computed(() => person.value
  ? person.value.name.toUpperCase() + ' IS'
  : ''
)

function updateAge(value: InputNumberType) {
  if (person.value) {
    person.value.ageInHours = Number(value) || 0
  }
}
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <div class="flex items-center gap-3">
      <img
        src="/img.png"
        :alt="person.name"
        class="w-14 h-14 rounded-full border-2 border-violet-500 object-cover"
      />
      <AppInput
        :label="label"
        caption="hours old"
        :model-value="person.ageInHours"
        @update:model-value="updateAge"
      />
    </div>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>
