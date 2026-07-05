import type { WeatherResponse } from '@/types'

export function useWeather() {
  const { getItem, setItem } = useLocalStorage()
  const currentWeather = ref<any>(null)
  const weatherHistory = ref<any[]>([])

  const fetchWeather = async (city: string) => {
    try {
      const data = await $fetch<WeatherResponse>('/api/weather', { query: { city } })

      currentWeather.value = data

      const exists = weatherHistory.value.some(
        (item) => item.city === data.city && item.createdAt === data.createdAt,
      )

      if (!exists) {
        weatherHistory.value.unshift(data)
        setItem('weatherHistory', JSON.stringify(weatherHistory.value))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const loadHistory = () => {
    const stored = getItem('weatherHistory')
    if (stored) weatherHistory.value = JSON.parse(stored)
  }

  return { currentWeather, weatherHistory, fetchWeather, loadHistory }
}
