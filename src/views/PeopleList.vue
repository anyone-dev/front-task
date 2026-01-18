<script setup lang="ts">
import { computed } from "vue";
import { store } from "@/store";

const peopleWithYears = computed(() => {
  return store.people
    .filter((person) => person.ageInHours / 730 >= store.minimumAgeInMonths)
    .map((person) => ({
      ...person,
      ageInYears: Math.floor(person.ageInHours / 8760),
    }));
});

function resetMinimumAge() {
  store.minimumAgeInMonths = 0;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <h1 class="text-xl font-bold text-dark">People</h1>

    <div class="flex flex-col gap-3">
      <router-link
        v-for="person in peopleWithYears"
        :key="person.id"
        :to="`/person/${person.id}`"
        class="group flex items-center gap-3 p-3 bg-white rounded-md outline outline-mid-grey hover:outline-[1.5px] hover:outline-primary-light"
      >
        <div class="relative w-20 h-20">
          <img src="/img.png" :alt="person.name" class="w-20 h-20 rounded-full object-cover" />

          <div
            class="pointer-events-none absolute -inset-0.75 rounded-full border border-primary opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-in-out"
          ></div>
        </div>

        <div>
          <div class="font-bold font-[Koulen] text-dark group-hover:text-primary">
            {{ person.name }}
          </div>
          <div class="text-dark">{{ person.ageInYears }} years old</div>
        </div>
      </router-link>
    </div>

    <div class="flex flex-col gap-1 items-start">
      <router-link to="/settings" class="text-dark hover:text-primary-light text-sm">
        Settings
      </router-link>
      <button
        @click="resetMinimumAge"
        class="text-dark hover:text-primary-light text-sm cursor-pointer"
      >
        Reset settings
      </button>
    </div>
  </div>
</template>
