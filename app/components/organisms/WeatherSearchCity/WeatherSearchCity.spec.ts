import { describe, test, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import WeatherSearchCity from './WeatherSearchCity.vue'

describe('WeatherSearchCity', () => {
  test('shows validation error when city is too short', async () => {
    const component = await mountSuspended(WeatherSearchCity)
    const input = component.find('input[type="text"]')

    await input.setValue('a')
    await component.vm.setFieldTouched('city', true)
    await component.vm.validateField('city')

    await flushPromises()
    await component.vm.$nextTick()

    expect(component.html()).toContain('Please enter a valid city name (at least 2 characters).')
  })
})
