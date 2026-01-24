import type { Directive } from 'vue'

type Options = {
  min?: number
  max?: number
  extra?: number
}

function clamp(n: number, min: number, max?: number) {
  if (typeof max === 'number') {
    return Math.min(Math.max(n, min), max)
  }

  return Math.max(n, min)
}

function getTextWidth(text: string, input: HTMLInputElement): number {
  const span = document.createElement('span')
  span.style.position = 'absolute'
  span.style.visibility = 'hidden'
  span.style.whiteSpace = 'pre'

  const cs = getComputedStyle(input)
  span.style.font = cs.font
  span.style.letterSpacing = cs.letterSpacing

  span.textContent = text || input.placeholder || ''

  document.body.appendChild(span)
  const width = span.getBoundingClientRect().width
  document.body.removeChild(span)

  return width
}

export const vAutoWidth: Directive<HTMLInputElement, Options | number | undefined> = {
  mounted(el, binding) {
    const opts: Options =
      typeof binding.value === 'number'
        ? { min: binding.value }
        : (binding.value ?? {})

    const min = opts.min ?? 72
    const max = opts.max
    const extra = opts.extra ?? 24

    const resize = () => {
      const text = el.value
      const contentWidth = getTextWidth(text, el)
      const next = clamp(Math.ceil(contentWidth + extra), min, max)

      el.style.width = `${next}px`
    }

    resize()

    el.addEventListener('input', resize)
    ;(el as any).__vAutoWidthResize__ = resize
  },

  updated(el) {
    const resize = (el as any).__vAutoWidthResize__

    if (resize) {
      resize()
    }
  },

  beforeUnmount(el) {
    const resize = (el as any).__vAutoWidthResize__

    if (resize) {
      el.removeEventListener('input', resize)
    }

    delete (el as any).__vAutoWidthResize__
  },
}
