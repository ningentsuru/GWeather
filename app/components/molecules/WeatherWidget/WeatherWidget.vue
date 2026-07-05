<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon, CloudRain, Loader2, Sunrise, Sunset } from '@lucide/vue'

interface WeatherProps {
  city: string
  country: string
  temp: number
  description: string
  createdAt: string
  icon: string
  dt: number
  timezone: number
  sunrise?: number
  sunset?: number
}

const props = withDefaults(defineProps<WeatherProps>(), {
  city: '',
  country: '',
  temp: 0,
  description: '',
  createdAt: '',
  icon: '',
  dt: 0,
  timezone: 0,
  sunrise: 0,
  sunset: 0,
})

const { unixAndTimezoneFormat } = useDateFormat()
const { toFahrenheit } = useTemperature()

const isLoading = computed(() => !props.city)

const WeatherIcon = computed(() => {
  const hour = Number(unixAndTimezoneFormat(props.dt, props.timezone, 'HH'))
  const isRainy =
    props.description.toLowerCase().includes('rain') ||
    props.description.toLowerCase().includes('drizzle') ||
    props.description.toLowerCase().includes('thunder')

  if (isRainy) return CloudRain
  return hour >= 6 && hour < 18 ? Sun : Moon
})

const formatTime = (timestamp: number) => {
  if (!timestamp) return '--:--'
  const offsetMinutes = props.timezone / 60
  return unixAndTimezoneFormat(timestamp, offsetMinutes, 'h:mm A')
}

const sunriseTime = computed(() => formatTime(props.sunrise))
const sunsetTime = computed(() => formatTime(props.sunset))
</script>

<template>
  <Card class="weather-widget">
    <template v-if="!isLoading">
      <CardHeader>
        <CardTitle class="text-md sm:text-2xl"> Weather Information </CardTitle>
      </CardHeader>

      <CardContent class="bg-foreground flex h-40 gap-4 rounded-xl border">
        <div
          class="text-background/80 flex w-full flex-col items-start justify-center gap-3 text-sm"
        >
          <div class="text-background flex w-full justify-between font-bold">
            <component
              v-if="WeatherIcon"
              :is="WeatherIcon"
              class="flex h-full w-fit items-center rounded-l-full border-2 border-gray-500 py-2 pr-1 pl-2 sm:h-10 sm:border-4 sm:py-1 sm:pr-0 sm:pl-1"
            />
            <div class="flex flex-1 items-center">
              <span
                class="border-x-foreground z-10 -mx-0.5 h-5 flex-1 border-2 border-gray-500 sm:-mx-1 sm:border-4"
              />
            </div>
            <div
              class="text-md text-md flex h-full items-center justify-end gap-1 rounded-r-full border-2 border-gray-500 p-2 px-2 leading-6 sm:h-10 sm:flex-row sm:gap-4 sm:border-4 sm:px-4 sm:text-3xl sm:leading-normal lg:px-2 lg:text-xl xl:text-3xl"
            >
              <span>{{ props.temp }}°C</span>
              <span>/</span>
              <span> {{ toFahrenheit(props.temp, 2) }}°F</span>
            </div>
          </div>
          <div class="flex w-full justify-between text-xs sm:text-sm">
            <p class="text-background/80 text-center capitalize">{{ props.description }}</p>
            <div class="flex gap-1">
              <span>{{ props.city }},</span><strong>{{ props.country }}</strong>
            </div>
          </div>
          <div class="flex w-full justify-between text-xs sm:text-sm">
            <div class="flex flex-col-reverse items-center gap-1 sm:flex-row">
              <Sunrise class="h-4 w-4" />
              <span>{{ sunriseTime }} Sunrise</span>
            </div>
            <div class="flex flex-col-reverse items-center gap-1 sm:flex-row">
              <Sunset class="h-4 w-4" />
              <span>{{ sunsetTime }} Sunset</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter class="flex justify-end">
        <span class="border-b text-xs sm:text-sm"> Last Fetched: {{ props.createdAt }} </span>
      </CardFooter>
    </template>

    <template v-else>
      <CardContent class="flex h-full flex-col items-center justify-center">
        <Loader2 class="text-muted-foreground h-8 w-8 animate-spin" />
        <span class="typed-[Waiting_for_your_action...] typed-caret typed-infinite" />
      </CardContent>
    </template>
  </Card>
</template>
