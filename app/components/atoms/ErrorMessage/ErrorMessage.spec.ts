import { describe, test, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ErrorMessage from './ErrorMessage.vue'

describe('ErrorMessage Component', () => {
  test('by default', async () => {
    const component = await mountSuspended(ErrorMessage, {
      props: { show: false },
    })

    expect(component.isVisible()).toBeFalsy()
  })

  test('renders slot content when show is true', async () => {
    const message = 'Invalid credentials'
    const component = await mountSuspended(ErrorMessage, {
      props: { show: true },
      slots: { default: message },
    })

    expect(component.isVisible()).toBe(true)
    expect(component.text()).toContain(message)
    expect(component.classes()).toContain('error-message')
  })
})
