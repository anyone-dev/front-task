import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const MIN_INPUT_WIDTH = 72
const PADDING_OFFSET = 32

export function useInputWidth(displayValue: () => string) {
  const inputWidth = ref<number>(MIN_INPUT_WIDTH)
  const measureElement = ref<HTMLSpanElement | null>(null)
  let resizeObserver: ResizeObserver | null = null

  function updateWidth() {
    if (!measureElement.value) {
      return
    }

    nextTick(() => {
      if (measureElement.value) {
        const width = measureElement.value.offsetWidth
        inputWidth.value = Math.max(MIN_INPUT_WIDTH, width + PADDING_OFFSET)
      }
    })
  }

  function setupObserver() {
    if (!measureElement.value || typeof ResizeObserver === 'undefined') {
      return
    }

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        inputWidth.value = Math.max(MIN_INPUT_WIDTH, width + PADDING_OFFSET)
      }
    })

    resizeObserver.observe(measureElement.value)
  }

  const stopWatcher = watch(
    () => displayValue(),
    () => {
      updateWidth()
    },
    { immediate: false }
  )

  onMounted(() => {
    updateWidth()
    setupObserver()
  })

  onUnmounted(() => {
    if (resizeObserver) {
      resizeObserver.disconnect()
      resizeObserver = null
    }
    stopWatcher()
  })

  return {
    inputWidth,
    measureElement,
  }
}
