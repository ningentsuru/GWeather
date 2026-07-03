<script setup lang="ts">
import { Loader2 } from '@lucide/vue'

interface WeatherObject {
  city: string
  icon: string
  temp: number
  description: string
  fetchedAt: string
}

const props = withDefaults(defineProps<WeatherObject>(), {
  city: '',
  icon: '',
  temp: 0,
  description: '',
  fetchedAt: '',
})

const isLoading = computed(() => !props.city)

const cacheAndUpdateData = computed(() => {
  
})
</script>

<template>
  <Card class="weather-widget">
    <template v-if="!isLoading">
      <CardHeader>
        <CardTitle class="flex items-center gap-2">
          <img
            :src="`https://openweathermap.org/img/wn/${props.icon}@2x.png`"
            :alt="`${props.description} weather icon`"
            class="h-10 w-10"
          />
          <span>{{ props.city }}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-4xl font-bold">{{ props.temp }}°C</p>
        <p class="text-muted-foreground capitalize">{{ props.description }}</p>
      </CardContent>
      <CardFooter>
        <small class="text-muted-foreground"> Updated: {{ props.fetchedAt }} </small>
      </CardFooter>
    </template>

    <template v-else>
      <CardContent class="flex h-full items-center justify-center">
        <Loader2 class="text-muted-foreground h-8 w-8 animate-spin" />
        <span class="sr-only">Loading weather data...</span>
      </CardContent>
    </template>
  </Card>
</template>
