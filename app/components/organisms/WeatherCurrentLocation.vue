<script setup lang="ts">
import { computed } from 'vue'
import { useGeolocation, useDebounceFn } from '@vueuse/core'

const { getCurrentLocationWeather } = useApi()

const emit = defineEmits(['get-weather'])

const useLocationImmediately = computed<boolean>(
  () => import.meta.client && localStorage.getItem('location-allow') === 'true',
)

const { coords, error, resume, pause } = useGeolocation({
  immediate: useLocationImmediately.value,
  enableHighAccuracy: true,
  timeout: 30000,
})

const fetchWeatherDebounced = useDebounceFn(async (lat: number, lon: number) => {
  if (typeof lat === 'number' && typeof lon === 'number' && lat !== Number.POSITIVE_INFINITY) {
    emit('get-weather', await getCurrentLocationWeather({ lat, lon }))
  }
}, 2000)

const isPause = ref<boolean>(false)

const isTracking = computed(() => {
  return (
    coords.value.latitude !== Number.POSITIVE_INFINITY &&
    coords.value.longitude !== Number.POSITIVE_INFINITY &&
    !error.value
  )
})

const buttonLabel = computed(() => {
  if (error.value) return 'Permission Denied'
  return isTracking.value && !isPause.value ? 'Stop Location Tracking' : 'Get Current Location'
})

const toggleLocation = () => {
  if (isTracking.value && !isPause.value) {
    pause()
    isPause.value = true
    localStorage.setItem('location-allow', 'false')
  } else {
    resume()
    isPause.value = false
    localStorage.setItem('location-allow', 'true')
  }
}

watch(
  () => error.value,
  (hasError) => {
    if (hasError) {
      localStorage.setItem('location-allow', 'false')
    }
  },
)

watch(
  () => [coords.value.latitude, coords.value.longitude],
  ([lat, lon]) => {
    fetchWeatherDebounced(Number(lat), Number(lon))
  },
  { deep: true },
)
</script>

<template>
  <Card class="weather-current-location">
    <CardHeader>
      <CardTitle>Weather at Your Location</CardTitle>
    </CardHeader>
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
    <CardFooter class="flex flex-col items-start">
      <Button
        class="cursor-pointer"
        :variant="isTracking && !isPause ? 'destructive' : 'outline'"
        @click="toggleLocation"
      >
        {{ buttonLabel }}
      </Button>
    </CardFooter>
  </Card>
</template>
