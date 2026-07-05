<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { WeatherResponse, Coord } from '@/types'

const router = useRouter()

const { getItem } = useLocalStorage()

const coordinates = useState<Coord>('coordinates', () => ({
  lat: 0,
  lon: 0,
}))

const weather = useState<WeatherResponse>('weather', () => ({
  city: '',
  country: '',
  description: '',
  dt: 0,
  createdAt: '',
  icon: '',
  main: '',
  sunrise: 0,
  sunset: 0,
  temp: 0,
  timezone: 0,
}))

const handleUnlock = (value: string) => {
  const to = value === 'weather-current-location' ? '/login' : undefined

  if (to) {
    router.push(to)
  }
}

onMounted(() => {
  if (import.meta.client) {
    const storedCoordinates = getItem('coordinates')
    const storedWeather = getItem('weather')

    if (storedCoordinates) {
      coordinates.value = JSON.parse(storedCoordinates)
    }

    if (storedWeather) {
      weather.value = JSON.parse(storedWeather)
    }
  }
})
</script>

<template>
  <Card class="current-weather">
    <CardContent class="flex flex-col-reverse gap-4 lg:grid lg:grid-cols-3 lg:gap-4">
      <WeatherSearchCity />
      <WeatherCurrentLocation @unlock="handleUnlock($event)" />
      <WeatherWidget
        :city="weather.city"
        :country="weather.country"
        :description="weather.description"
        :dt="weather.dt"
        :createdAt="weather.createdAt"
        :icon="weather.icon"
        :main="weather.main"
        :sunrise="weather.sunrise"
        :sunset="weather.sunset"
        :temp="weather.temp"
        :timezone="weather.timezone"
      />
    </CardContent>
  </Card>
</template>
