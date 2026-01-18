<script setup lang="ts">
import { store } from "@/store";
import { ref } from "vue";
import NumericInput from "@/components/NumericInput.vue";

const inputFocused = ref(false);

function updateMinimumAge(value: number) {
  store.minimumAgeInMonths = value || 0;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <router-link to="/" class="text-dark hover:text-primary-light text-sm">&larr; Back</router-link>

    <h1 class="text-xl font-bold text-dark">Settings</h1>

    <div>
      <div class="flex items-center gap-2">
        <NumericInput
          v-model="store.minimumAgeInMonths"
          v-model:isFocused="inputFocused"
          :label="'minimum age'"
          :label-uppercase="true"
          label-color="text-dark"
          active-label-color="text-primary"
          caption="months"
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
</template>
