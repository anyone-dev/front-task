<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'

const route = useRoute()

const person = computed(() => {
  const id = Number(route.params.id)
  return store.people.find((p) => p.id === id)
})
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <div class="person flex items-center gap-3">
      <img
        src="/photo.jpg"
        :alt="person.name"
        class="person__img"
      />

      <div>
        <label for="hours-input" class="person__label">
          {{ person.name.toUpperCase() }} IS
        </label>

        <div class="flex items-center gap-2">
          <input
            id="hours-input"
            v-model="person.ageInHours"
            v-thousands
            v-auto-width="{ min: 72, extra: 20 }"
            type="text"
            placeholder="7"
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

<style>
.person__img {
  border: 1px solid transparent;
  border-radius: 50%;
  padding: 4px;
  box-sizing: border-box;
  background: #ffffff;
  width: 88px;
  height: 88px;
  object-fit: contain;
}

.person__label {
  display: block;
  color: var(--dark);
  margin-bottom: 12px;
  font-size: 16px;
  line-height: 16px;
  font-weight: bold;
}

.person:focus-within .person__img {
  border-color: var(--primary);
}

.person:focus-within .person__label {
  color: var(--primary);
}
</style>
