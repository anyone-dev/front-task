<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'

const route = useRoute()

const person = computed(() => {
  const id = Number(route.params.id)
  return store.people.find((p) => p.id === id)
})

function updateAge(value: string) {
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
      <div>
        <label for="hours-input" class="block text-sm font-bold tracking-wide text-gray-700">
          {{ person.name.toUpperCase() }} IS
        </label>
        <div class="flex items-center gap-2">
          <input
            id="hours-input"
            type="text"
            :value="person.ageInHours"
            @input="updateAge(($event.target as HTMLInputElement).value)"
            class="border border-gray-300 rounded px-2 py-1 text-lg outline-none"
            placeholder="0"
          />
          <span class="text-gray-600">hours old</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>
