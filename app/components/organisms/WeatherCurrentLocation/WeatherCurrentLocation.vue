<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGeolocation } from '@vueuse/core'
import type { WeatherResponse, Coord } from '@/types'

const { loggedIn } = useUserSession()

const { getCurrentLocationWeather } = useApi()
const { getItem, setItem, removeItem } = useLocalStorage()

const emit = defineEmits(['unlock'])

const weather = useState<WeatherResponse>('weather')
const coordinates = useState<Coord>('coordinates')

const useLocationImmediately = computed<boolean>(
  () => loggedIn.value && getItem('location-allow') === 'true',
)

const { coords, error, resume, pause } = useGeolocation({
  immediate: useLocationImmediately.value,
  enableHighAccuracy: true,
  timeout: 30000,
})

const getWeather = async (lat: number, lon: number) => {
  if (coordinates.value.lat === lat && coordinates.value.lon === lon) return
  if (typeof lat === 'number' && typeof lon === 'number' && lat !== Number.POSITIVE_INFINITY) {
    weather.value = (await getCurrentLocationWeather({ lat, lon })) as WeatherResponse
    coordinates.value = { lat, lon }
    setItem('weather', JSON.stringify(weather.value))
    setItem('coordinates', JSON.stringify(coordinates.value))
  }
}

const isPause = ref<boolean>(false)

const hasCoordinates = computed(
  () =>
    coords.value.latitude !== Number.POSITIVE_INFINITY &&
    coords.value.longitude !== Number.POSITIVE_INFINITY,
)

const isTracking = computed(() => hasCoordinates.value && !error.value)

const buttonLabel = computed(() => {
  if (error.value) return 'Permission Denied'
  return isTracking.value && !isPause.value ? 'Stop Location Tracking' : 'Get Current Location'
})

const toggleLocation = () => {
  if (isTracking.value && !isPause.value) {
    pause()
    isPause.value = true
    setItem('location-allow', 'false')
    removeItem('coordinates')
  } else {
    resume()
    isPause.value = false
    setItem('location-allow', 'true')
    coordinates.value = { lat: 0, lon: 0 }
  }
}

watch(
  () => error.value,
  (hasError) => {
    if (hasError) {
      setItem('location-allow', 'false')
    }
  },
)

watch(
  () => [coords.value.latitude, coords.value.longitude, isPause.value],
  ([lat, lon, isPause]) => {
    if (!isPause) getWeather(Number(lat), Number(lon))
  },
  { deep: true },
)
</script>

<template>
  <UnlockCard
    class="weather-current-location"
    unique-id="weather-current-location"
    button-text="Unlock this features"
    :blur="!loggedIn"
    @unlock="emit('unlock', $event)"
  >
    <template #card-header>
      <CardHeader>
        <CardTitle class="text-2xl">Weather at Your Location</CardTitle>
      </CardHeader>
    </template>
    <CardContent>
      <p v-if="coords.latitude && coords.latitude !== Number.POSITIVE_INFINITY">
        <span class="font-semibold">Latitude:</span> {{ coords.latitude }}<br />
        <span class="font-semibold">Longitude:</span> {{ coords.longitude }}
      </p>
      <p v-else-if="error" class="text-destructive">
        {{ error.message }}
      </p>
      <p v-else class="text-muted-foreground">Click the button below to allow location access.</p>
    </CardContent>
    <CardFooter class="flex flex-row lg:flex-col items-start gap-2">
      <Button
        class="cursor-pointer"
        :variant="isTracking && !isPause ? 'destructive' : 'outline'"
        @click="toggleLocation"
      >
        {{ buttonLabel }}
      </Button>
      <Button v-if="hasCoordinates" class="cursor-pointer" variant="outline" as-child>
        <NuxtLink
          :to="`https://www.google.com/maps/@${coords.latitude},${coords.longitude},19z`"
          target="_blank"
        >
          Google Map
        </NuxtLink>
      </Button>
    </CardFooter>
  </UnlockCard>
</template>
