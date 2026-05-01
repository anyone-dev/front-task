import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import NumericInput from '@/components/NumericInput.vue'
import { defaultNumericInputHintMessages } from '@/components/numericInput.copy'

describe('NumericInput', () => {
  it('renders zero as a real value and forwards input attributes', () => {
    const wrapper = mount(NumericInput, {
      attrs: {
        id: 'age-input',
        'aria-label': 'Age input',
      },
      props: {
        modelValue: 0,
      },
    })

    const input = wrapper.get('input')

    expect((input.element as HTMLInputElement).value).toBe('0')
    expect(input.attributes('id')).toBe('age-input')
    expect(input.attributes('aria-label')).toBe('Age input')
  })

  it('sanitizes mixed input and emits digits only', async () => {
    const wrapper = mount(NumericInput, {
      props: {
        modelValue: 0,
      },
    })

    const input = wrapper.get('input')
    const element = input.element as HTMLInputElement
    element.value = '12a3'
    element.setSelectionRange(4, 4)

    await input.trigger('input')
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([123])
    expect(element.value).toBe('123')
  })

  it('extracts digits from pasted text and shows a hint', async () => {
    const wrapper = mount(NumericInput, {
      props: {
        modelValue: 0,
      },
    })

    const input = wrapper.get('input')
    const element = input.element as HTMLInputElement
    element.setSelectionRange(0, 1)

    const pasteEvent = new Event('paste', { bubbles: true, cancelable: true })
    Object.defineProperty(pasteEvent, 'clipboardData', {
      value: {
        getData: () => 'price 1500 usd',
      },
    })

    element.dispatchEvent(pasteEvent)
    await nextTick()

    expect(wrapper.emitted('update:modelValue')?.at(-1)).toEqual([1500])
    expect(wrapper.text()).toContain(defaultNumericInputHintMessages.extractedDigits('1 500'))
  })

  it('clamps negative external values to zero in the UI', () => {
    const wrapper = mount(NumericInput, {
      props: {
        modelValue: -10,
      },
    })

    expect((wrapper.get('input').element as HTMLInputElement).value).toBe('0')
  })
})
