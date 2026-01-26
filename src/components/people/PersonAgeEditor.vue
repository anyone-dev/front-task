<script setup lang="ts">
import { computed } from 'vue'
import NumericInput from "@/components/inputs/NumericInput.vue";

const props = defineProps<{
  name: string
  modelValue: number
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const upperName = computed(() => props.name.toUpperCase())
</script>

<template>
  <div class="person flex items-center gap-3">
    <img src="/photo.jpg" :alt="name" class="person__img" />

    <div>
      <label for="hours-input" class="person__label">
        {{ upperName }} IS
      </label>

      <div class="flex items-center gap-3">
        <NumericInput
          id="hours-input"
          :model-value="modelValue"
          @update:modelValue="emit('update:modelValue', $event)"
        />
        <span class="text-gray-600">hours old</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.person {
  font-family: "Inter", sans-serif;
  color: var(--dark);
  font-size: 18px;
}

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
  font-family: "Koulen", sans-serif;
  display: block;
  color: var(--dark);
  margin-bottom: 12px;
  font-size: 16px;
  letter-spacing: 1px;
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
