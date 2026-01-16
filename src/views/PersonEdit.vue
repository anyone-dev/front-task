<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getPersonById, updatePersonAge } from '@/store'
import { updateInputWithCursorPreservation } from '@/utils/cursor'

const route = useRoute()
const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const measureRef = ref<HTMLElement | null>(null)
const inputWidth = ref('72px')

const person = computed(() => {
  const id = Number(route.params.id)
  return getPersonById(id)
})

function formatNumber(value: number | string) {
  if (!value) return ''
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
}

const formattedAge = computed(() => formatNumber(person.value?.ageInHours || ''))

watch(formattedAge, async () => {
  await nextTick()
  if (measureRef.value) {
    const width = measureRef.value.offsetWidth
    inputWidth.value = `${Math.max(width + 24, 72)}px`
  }
}, { immediate: true })

function updateAge(event: Event) {
  const input = event.target as HTMLInputElement
  const value = input.value
  
  // Remove any non-digit characters
  const rawValue = value.replace(/\D/g, '')
  
  if (person.value) {
    updatePersonAge(person.value.id, Number(rawValue) || 0)
    
    // Force input value update and restore cursor
    const newValue = formatNumber(rawValue)
    updateInputWithCursorPreservation(input, newValue)
  }
}

function enableEdit() {
  if (isEditing.value) return
  isEditing.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

function disableEdit() {
  isEditing.value = false
}

function onEnter() {
  inputRef.value?.blur()
}
</script>

<template>
  <div v-if="person" class="flex flex-col gap-4">
    <router-link to="/" class="text-primary hover:underline text-sm">&larr; Back</router-link>

    <div class="flex items-center gap-3">
      <div class="relative">
        <img
          src="/cat.jpg"
          :alt="person.name"
          class="w-[80px] h-[80px] rounded-full object-cover relative z-10"
        />
        <div 
          class="absolute -inset-[3px] rounded-full border border-primary opacity-0 transition-opacity"
          :class="{ 'opacity-100': isEditing }"
        ></div>
      </div>
      <div class="flex flex-col gap-3">
        <label for="hours-input" :class="[
          isEditing ? 'block text-sm font-bold tracking-wide text-primary'
          : 'block text-sm font-bold tracking-wide text-dark']"
          >
          {{ person.name.toUpperCase() }} IS
        </label>
        <div class="flex items-center gap-3 group cursor-pointer" @click="enableEdit">
          <span 
            ref="measureRef" 
            class="absolute invisible whitespace-pre text-lg -z-50 opacity-0 pointer-events-none"
            aria-hidden="true"
          >{{ formattedAge || '0' }}</span>
          <input
            ref="inputRef"
            id="hours-input"
            type="text"
            inputmode="numeric"
            :value="formattedAge"
            @input="updateAge"
            @blur="disableEdit"
            @keyup.enter="onEnter"
            :disabled="!isEditing"
            class="no-arrow rounded px-2 py-1 text-lg outline-none transition-colors"
            :class="[
              isEditing 
                ? 'border-[1.5px] border-primary-light text-dark' 
                : 'border-[1px] m-[0.5px] pointer-events-none bg-white text-light-grey border-light-grey group-hover:border-mid-grey'
            ]"
            :style="{ width: inputWidth }"
            placeholder="0"
          />
          <span class="text-gray-600">hours old</span>
        </div>
      </div>
    </div>
  </div>

  <div v-else>
    <p class="text-gray-600">Person not found</p>
    <router-link to="/" class="text-primary hover:underline text-sm">Back to list</router-link>
  </div>
</template>

<style scoped>
.no-arrow::-webkit-outer-spin-button,
.no-arrow::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.no-arrow {
  -moz-appearance: textfield;
}
</style>
