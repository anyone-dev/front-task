export const NUMERIC_INPUT_COLORS = {
  border: {
    default: '#CFCADF',
    hover: '#AA9DCE',
    active: '#906FEE',
    disabled: '#E5E7EB',
  },
  label: {
    default: '#1E0E4C',
    active: '#3D06D7',
  },
  text: '#1E0E4C',
  background: {
    disabled: '#F3F4F6',
  },
} as const

export const NUMERIC_INPUT_SIZES = {
  minWidth: 72,
  height: 44,
  padding: {
    horizontal: 8,
    right: 16,
    vertical: 8,
  },
  gap: {
    label: 12,
    caption: 12,
  },
} as const
