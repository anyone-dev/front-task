<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { store } from '@/store'
import PersonAgeEditor from "@/components/people/PersonAgeEditor.vue";

const route = useRoute()

const personId = computed(() => Number(route.params.id))

const person = computed(() => {
  if (!personId.value) {
    return null
  }

  return store.people.find((p) => p.id === personId.value)
})
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-violet-600 hover:underline text-sm">&larr; Back</router-link>

    <PersonAgeEditor
      v-model="person.ageInHours"
      :name="person.name"
    />
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-violet-600 hover:underline text-sm">Back to list</router-link>
  </div>
</template>
