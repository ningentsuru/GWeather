import { describe, test, expect, vi, beforeEach } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import type { WeatherResponse, Coord } from '@/types'
import WeatherCurrentLocation from './WeatherCurrentLocation.vue'

const mockCoords = ref<{ latitude: number; longitude: number }>({
  latitude: Number.POSITIVE_INFINITY,
  longitude: Number.POSITIVE_INFINITY,
})
const mockGeoError = ref<any>(null)
const mockResume = vi.fn()
const mockPause = vi.fn()

vi.mock('@vueuse/core', () => ({
  useGeolocation: (options: any) => ({
    coords: mockCoords as Ref<{ latitude: number; longitude: number }>,
    error: mockGeoError,
    resume: mockResume,
    pause: mockPause,
  }),
}))

const mockGetWeather = vi.fn()
const mockGetItem = vi.fn()
const mockSetItem = vi.fn()
const mockRemoveItem = vi.fn()
const mockLoggedIn = ref(false)

mockNuxtImport('useApi', () => {
  return () => ({
    getCurrentLocationWeather: mockGetWeather,
  })
})

mockNuxtImport('useLocalStorage', () => {
  return () => ({
    getItem: mockGetItem,
    setItem: mockSetItem,
    removeItem: mockRemoveItem,
  })
})

mockNuxtImport('useUserSession', () => {
  return () => ({
    loggedIn: mockLoggedIn,
  })
})

const mockWeatherState = ref<WeatherResponse | null>(null)
const mockCoordState = ref<Coord>({ lat: 0, lon: 0 })

mockNuxtImport('useState', () => {
  return <T>(key: string, init?: () => T) => {
    if (key === 'weather') return mockWeatherState as Ref<T>
    if (key === 'coordinates') return mockCoordState as Ref<T>
    return init ? ref(init()) : ref(null)
  }
})

describe('WeatherCurrentLocation Component', () => {
  beforeEach(() => {
    mockCoords.value = { latitude: Number.POSITIVE_INFINITY, longitude: Number.POSITIVE_INFINITY }
    mockGeoError.value = null
    mockLoggedIn.value = false
    mockWeatherState.value = null
    mockCoordState.value = { lat: 0, lon: 0 }

    vi.clearAllMocks()

    mockGetItem.mockReturnValue(null)
  })

  test('No credentials, renders "Unlock this features" message', async () => {
    const component = await mountSuspended(WeatherCurrentLocation)
    await nextTick()

    expect(component.text()).toContain('Unlock this features')
  })

  describe('Has credential', () => {
    beforeEach(() => {
      mockLoggedIn.value = true
    })

    test('renders "Click the button" message when no location and no error', async () => {
      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      expect(component.text()).toContain('Click the button below to allow location access.')
      expect(component.text()).toContain('Get Current Location')
    })

    test('renders coordinates when location is tracked', async () => {
      mockCoords.value = { latitude: 48.8566, longitude: 2.3522 }

      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      expect(component.text()).toContain('Latitude:')
      expect(component.text()).toContain('48.8566')
      expect(component.text()).toContain('Longitude:')
      expect(component.text()).toContain('2.3522')
      expect(component.text()).not.toContain('Click the button')
    })

    test('renders error message when geolocation fails', async () => {
      mockGeoError.value = { message: 'Permission denied' }

      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      expect(component.text()).toContain('Permission denied')
    })

    test('toggles location tracking (Resume) when button clicked and not tracking', async () => {
      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      const button = component.find('button')
      await button.trigger('click')

      expect(mockResume).toHaveBeenCalled()
      expect(mockSetItem).toHaveBeenCalledWith('location-allow', 'true')
      expect(mockCoordState.value).toEqual({ lat: 0, lon: 0 })
    })

    test('toggles location tracking (Pause) when button clicked and already tracking', async () => {
      mockCoords.value = { latitude: 48.8566, longitude: 2.3522 }

      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      const button = component.find('button')
      await button.trigger('click')

      expect(mockPause).toHaveBeenCalled()
      expect(mockSetItem).toHaveBeenCalledWith('location-allow', 'false')
      expect(mockRemoveItem).toHaveBeenCalledWith('coordinates')
    })

    test('calls getWeather when coordinates change and not paused', async () => {
      const mockWeatherData: WeatherResponse = {
        main: 'Clear',
        temp: 20,
        city: 'Paris',
        description: 'Clear',
        dt: 123456,
        country: 'FR',
        sunrise: 123000,
        sunset: 456000,
        timezone: 0,
        icon: '01d',
        createdAt: new Date().toISOString(),
      }
      mockGetWeather.mockResolvedValue(mockWeatherData)

      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      mockCoords.value = { latitude: 51.5074, longitude: -0.1278 }
      await nextTick()

      expect(mockGetWeather).toHaveBeenCalledWith({ lat: 51.5074, lon: -0.1278 })
      expect(mockWeatherState.value).toEqual(mockWeatherData)
      expect(mockCoordState.value).toEqual({ lat: 51.5074, lon: -0.1278 })
      expect(mockSetItem).toHaveBeenCalledWith('weather', expect.any(String))
      expect(mockSetItem).toHaveBeenCalledWith('coordinates', expect.any(String))
    })

    test('does NOT call getWeather if coordinates are the same', async () => {
      mockGetWeather.mockResolvedValue({ temp: 20 } as WeatherResponse)
      mockCoordState.value = { lat: 48.8566, lon: 2.3522 }

      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      mockCoords.value = { latitude: 48.8566, longitude: 2.3522 }
      await nextTick()

      expect(mockGetWeather).not.toHaveBeenCalled()
    })

    test('sets location-allow to false when error occurs', async () => {
      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      mockGeoError.value = { message: 'Timeout' }
      await nextTick()

      expect(mockSetItem).toHaveBeenCalledWith('location-allow', 'false')
    })

    test('button label changes based on tracking state', async () => {
      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()
      expect(component.text()).toContain('Get Current Location')

      mockCoords.value = { latitude: 48.8566, longitude: 2.3522 }
      await nextTick()

      expect(component.text()).toContain('Stop Location Tracking')
    })

    test('renders Google Map button when coordinates exist', async () => {
      mockCoords.value = { latitude: 48.8566, longitude: 2.3522 }

      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      const mapLink = component.find('a[href*="google.com/maps"]')
      expect(mapLink.exists()).toBe(true)
      expect(mapLink.attributes('href')).toContain('48.8566,2.3522')
    })

    test('does not render Google Map button when no coordinates', async () => {
      const component = await mountSuspended(WeatherCurrentLocation)
      await nextTick()

      const mapLink = component.find('a[href*="google.com/maps"]')
      expect(mapLink.exists()).toBe(false)
    })
  })
})
