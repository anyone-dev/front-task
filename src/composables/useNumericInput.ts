import { ref, computed, watch, nextTick, onMounted } from "vue";
import { DEFAULT_MIN_WIDTH, GAP_AFTER_LAST_DIGIT } from "@/constants/numericInput";
import type { NumericInputProps, NumericInputEmit } from "@/types/numericInput";

export function useNumericInput(props: NumericInputProps, emit: NumericInputEmit) {
  const inputRef = ref<HTMLInputElement | null>(null);
  const measureRef = ref<HTMLSpanElement | null>(null);

  const isFocused = ref(false);
  const enableTransition = ref(false);
  const rawValue = ref(String(props.modelValue ?? ""));

  const minWidth = computed(() => props.minWidth ?? DEFAULT_MIN_WIDTH);
  const width = ref(minWidth.value);

  function digitsOnly(value: string) {
    return value.replace(/\D+/g, "");
  }

  function format(value: string) {
    if (!value) return "";
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  const formattedValue = computed(() => format(rawValue.value));

  function adjustWidth() {
    const el = measureRef.value;
    if (!el) return;

    const textWidth = el.offsetWidth;
    width.value = Math.max(minWidth.value, textWidth + GAP_AFTER_LAST_DIGIT);
  }

  function onInput(e: Event) {
    enableTransition.value = true;
    const el = e.target as HTMLInputElement;
    const digits = digitsOnly(el.value);

    rawValue.value = digits;
    emit("update:modelValue", digits ? Number(digits) : 0);

    nextTick(adjustWidth);
  }

  function handleFocus() {
    isFocused.value = true;
    emit("update:isFocused", true);
  }

  function handleBlur() {
    isFocused.value = false;
    emit("update:isFocused", false);
  }

  function handleBeforeInput(e: InputEvent) {
    if (e.data && !/^\d+$/.test(e.data)) e.preventDefault();
  }

  watch(
    () => props.modelValue,
    (val) => {
      rawValue.value = String(val ?? "");
      nextTick(adjustWidth);
    },
    { immediate: true }
  );

  onMounted(async () => {
    await nextTick();
    if ("fonts" in document) {
      await (document as any).fonts.ready;
    }
    adjustWidth();
  });

  return {
    inputRef,
    measureRef,
    rawValue,
    formattedValue,
    isFocused,
    enableTransition,
    width,
    onInput,
    handleFocus,
    handleBlur,
    handleBeforeInput,
    adjustWidth,
  };
}
