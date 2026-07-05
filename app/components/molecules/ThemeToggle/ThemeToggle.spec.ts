import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import ThemeToggle from './ThemeToggle.vue'

vi.mock('@lucide/vue', () => ({
  Sun: { template: '<span>sun-icon</span>' },
  Moon: { template: '<span>moon-icon</span>' },
}))

const setPreferenceMock = vi.fn()
const mockPreference = ref('light')

mockNuxtImport('useColorMode', () => {
  return () => ({
    get value() {
      return mockPreference.value
    },
    get preference() {
      return mockPreference.value
    },
    set preference(val) {
      mockPreference.value = val
      setPreferenceMock(val)
    },
  })
})

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    mockPreference.value = 'light'
    setPreferenceMock.mockClear()
  })

  test('renders Sun icon when light mode', async () => {
    const component = await mountSuspended(ThemeToggle)
    await component.vm.$nextTick()

    expect(component.text()).toContain('sun-icon')
  })

  test('renders Moon icon when dark mode', async () => {
    mockPreference.value = 'dark'

    const component = await mountSuspended(ThemeToggle)
    await component.vm.$nextTick()

    expect(component.text()).toContain('moon-icon')
  })

  test('toggles color mode on click', async () => {
    const component = await mountSuspended(ThemeToggle)
    await component.vm.$nextTick()

    expect(component.text()).toContain('sun-icon')

    await component.find('.toggle-theme').trigger('click')
    await component.vm.$nextTick()

    expect(setPreferenceMock).toHaveBeenCalledWith('dark')
    expect(component.text()).toContain('moon-icon')
  })
})
