<script setup lang="ts">
defineProps<{
  id: number
  name: string
  ageInYears: number
}>()
</script>

<template>
  <router-link
    :to="`/person/${id}`"
    class="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200 hover:border-violet-500"
  >
    <img
      src="/photo.jpg"
      :alt="name"
      class="w-10 h-10 rounded-full border-2 border-violet-500 object-cover"
    />

    <div>
      <div class="font-bold text-gray-700">{{ name }}</div>
      <div class="text-gray-600">{{ ageInYears }} years old</div>
    </div>
  </router-link>
</template>
