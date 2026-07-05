import { describe, test, expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import WeatherWidget from './WeatherWidget.vue'
import type { WeatherResponse } from '@/types'

const { unixAndTimezoneFormat } = useDateFormat()
const { toFahrenheit } = useTemperature()

vi.mock('@lucide/vue', () => ({
  Sun: { template: '<span>sun-icon</span>' },
  Moon: { template: '<span>moon-icon</span>' },
  CloudRain: { template: '<span>rain-icon</span>' },
  Loader2: { template: '<span>loader-icon</span>' },
  Sunrise: { template: '<span>sunrise-icon</span>' },
  Sunset: { template: '<span>sunset-icon</span>' },
}))


describe('WeatherWidget Component', () => {
  test('renders loading state when city is empty', async () => {
    const component = await mountSuspended(WeatherWidget, {
      props: {
        city: '',
        country: '',
        temp: 0,
        description: '',
        createdAt: '',
        icon: '',
        dt: 0,
        timezone: 0,
      },
    })

    await component.vm.$nextTick()

    expect(component.text()).toContain('loader-icon')
    expect(component.text()).not.toContain('Weather Information')
  })

  test('renders weather data when city is provided', async () => {
    const component = await mountSuspended(WeatherWidget, {
      props: {
        city: 'London',
        country: 'UK',
        temp: 20,
        description: 'Clear Sky',
        createdAt: '2026-07-05 12:00',
        icon: '01d',
        dt: 1720180800,
        timezone: 3600,
        sunrise: 1720155600,
        sunset: 1720213200,
      },
    })

    await component.vm.$nextTick()

    const props = component.props() as unknown as WeatherResponse

    expect(component.text()).toContain(props.city)
    expect(component.text()).toContain(props.country)
    expect(component.text()).toContain(`${props.temp}°C`)
    expect(component.text()).toContain(`${toFahrenheit(props.temp, 2)}°F`)
    expect(component.text()).toContain(props.description)
    expect(component.text()).toContain(`Last Fetched: ${props.createdAt}`)
  })

  test('renders Sun icon when hour is between 6 and 18 and not rainy', async () => {
    const component = await mountSuspended(WeatherWidget, {
      props: {
        city: 'Paris',
        country: 'FR',
        temp: 25,
        description: 'Clear',
        createdAt: '',
        icon: '01d',
        dt: 1720180800,
        timezone: 3600,
        sunrise: 0,
        sunset: 0,
      },
    })

    await component.vm.$nextTick()

    expect(component.text()).toContain('sun-icon')
    expect(component.text()).not.toContain('moon-icon')
    expect(component.text()).not.toContain('rain-icon')
  })

  test('renders Moon icon when hour is night (outside 6-18)', async () => {
    const component = await mountSuspended(WeatherWidget, {
      props: {
        city: 'Paris',
        country: 'FR',
        temp: 15,
        description: 'Clear',
        createdAt: '',
        icon: '01n',
        dt: 1720112400,
        timezone: 3600,
        sunrise: 0,
        sunset: 0,
      },
    })

    await component.vm.$nextTick()

    expect(component.text()).toContain('moon-icon')
    expect(component.text()).not.toContain('sun-icon')
    expect(component.text()).not.toContain('rain-icon')
  })

  test('renders CloudRain icon when description includes rain', async () => {
    const component = await mountSuspended(WeatherWidget, {
      props: {
        city: 'Seattle',
        country: 'US',
        temp: 12,
        description: 'Light Rain',
        createdAt: '',
        icon: '10d',
        dt: 1720180800,
        timezone: -25200,
        sunrise: 0,
        sunset: 0,
      },
    })

    await component.vm.$nextTick()

    expect(component.text()).toContain('rain-icon')
    expect(component.text()).not.toContain('sun-icon')
    expect(component.text()).not.toContain('moon-icon')
  })

  test('formats sunrise and sunset times correctly', async () => {
    const component = await mountSuspended(WeatherWidget, {
      props: {
        city: 'Tokyo',
        country: 'JP',
        temp: 28,
        description: 'Clear',
        createdAt: '',
        icon: '01d',
        dt: 1720180800,
        timezone: 32400,
        sunrise: 1720155600,
        sunset: 1720213200,
      },
    })

    await component.vm.$nextTick()

    const props = component.props() as unknown as WeatherResponse

    expect(component.text()).toContain(
      `${unixAndTimezoneFormat(props.sunrise, props.timezone, 'h:mm A')} Sunrise`,
    )
    expect(component.text()).toContain(
      `${unixAndTimezoneFormat(props.sunset, props.timezone, 'h:mm A')} Sunset`,
    )
    expect(component.text()).toContain('sunrise-icon')
    expect(component.text()).toContain('sunset-icon')
  })
})
