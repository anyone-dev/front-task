export interface NumericInputProps {
  modelValue: number | null
  label?: string
  caption?: string
  placeholder?: string
  disabled?: boolean
  min?: number
}

export interface NumericInputEmits {
  (e: 'update:modelValue', value: number | null): void
  (e: 'focus'): void
  (e: 'blur'): void
}
