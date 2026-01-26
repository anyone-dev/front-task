<script setup lang="ts">
import { computed } from 'vue'
import { store } from '@/store'

import PersonListItem from '@/components/people/PersonListItem.vue'

import { hoursToYears } from '@/utils/age'

const peopleWithAge = computed(() => {
  return store.people.map((person) => ({
    ...person,
    ageInYears: hoursToYears(person.ageInHours),
  }))
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-xl font-bold text-gray-700">People</h1>

    <div v-if="peopleWithAge.length" class="flex flex-col gap-3">
      <PersonListItem
        v-for="person in peopleWithAge"
        :key="person.id"
        :id="person.id"
        :name="person.name"
        :age-in-years="person.ageInYears"
      />
    </div>

    <p v-else class="text-gray-600">No people yet</p>

    <footer class="pt-2">
      <router-link to="/settings" class="text-violet-600 hover:underline text-sm">
        Settings
      </router-link>
    </footer>
  </div>
</template>
