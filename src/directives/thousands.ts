import type { Directive } from 'vue'

function formatThousands(digits: string): string {
  if (!digits) return ''

  return Number(digits).toLocaleString('ru-RU')
}

function extractDigits(value: string): string {
  return value.toString().replace(/\D/g, '')
}

export const vThousands: Directive<HTMLInputElement, void> = {
  mounted(el) {
    const update = () => {
      const digits = extractDigits(el.value)
      const formatted = formatThousands(digits)

      if (el.value !== formatted) {
        el.value = formatted
      }

      el.dispatchEvent(new Event('input', { bubbles: true }))
    }

    const onInput = () => update()
    el.addEventListener('input', onInput)
    update()

    el.setAttribute('inputmode', 'numeric')
  },

  beforeUnmount(el) {
    const onInput = (el as any).__vThousandsOnInput__

    if (onInput) {
      el.removeEventListener('input', onInput)
    }

    delete (el as any).__vThousandsOnInput__
  },
}
