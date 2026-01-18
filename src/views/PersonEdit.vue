<script setup lang="ts">
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { store } from "@/store";
import NumericInput from "@/components/NumericInput.vue";

const route = useRoute();
const inputFocused = ref(false);

const person = computed(() => {
  const id = Number(route.params.id);
  return store.people.find((p) => p.id === id);
});
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-dark hover:text-primary-light text-sm">&larr; Back</router-link>

    <div class="flex items-center gap-3">
      <div class="relative w-20 h-20">
        <img src="/img.png" :alt="person.name" class="w-20 h-20 rounded-full object-cover" />
        <div
          class="pointer-events-none absolute -inset-0.75 rounded-full border border-primary transition-all duration-300 ease-in-out"
          :class="{
            'opacity-100 scale-100': inputFocused,
            'opacity-0 scale-95': !inputFocused,
          }"
        ></div>
      </div>

      <div class="flex">
        <NumericInput
          v-model="person.ageInHours"
          v-model:isFocused="inputFocused"
          :label="person.name + ' is'"
          :label-uppercase="true"
          label-color="text-dark"
          active-label-color="text-primary"
          caption="hours old"
          caption-color="text-dark"
          caret-color="caret-primary"
          input-color="text-light-grey"
          hover-input-color="text-mid-grey"
          active-input-color="text-dark"
          border-color="border-light-grey"
          hover-border-color="border-mid-grey"
          active-border-color="border-primary-light"
        />
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-dark">Person not found</p>
    <router-link to="/" class="text-dark hover:text-primary-light text-sm"
      >Back to list</router-link
    >
  </div>
</template>
