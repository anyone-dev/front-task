export interface NumericInputProps {
  modelValue: number;
  minWidth?: number;
  label?: string;
  labelUppercase?: boolean;
  labelColor?: string;
  activeLabelColor?: string;
  caption?: string;
  captionColor?: string;
  caretColor?: string;
  inputColor?: string;
  hoverInputColor?: string;
  activeInputColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
  activeBorderColor?: string;
}

export type NumericInputEmit = {
  (e: "update:modelValue", value: number): void;
  (e: "update:isFocused", value: boolean): void;
};
