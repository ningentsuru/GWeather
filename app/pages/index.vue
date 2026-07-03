<script setup lang="ts">
interface WeatherObject {
  city: string
  icon: string
  temp: number
  description: string
  fetchedAt: string
}
const weather = ref({
  city: '',
  icon: '',
  temp: 0,
  description: '',
  fetchedAt: '',
})
const handleGetWeather = (payload: WeatherObject) => {
  weather.value = payload
}
</script>

<template>
  <div class="current-weather">
    <Card>
      <CardContent class="flex flex-col-reverse gap-4 md:grid md:grid-cols-3 md:gap-4">
        <SearchCity @get-weather="handleGetWeather" />
        <WeatherCurrentLocation @get-weather="handleGetWeather" />
        <WeatherWidget
          :city="weather.city"
          :icon="weather.icon"
          :temp="weather.temp"
          :description="weather.description"
          :fetchedAt="weather.fetchedAt"
        />
      </CardContent>
    </Card>
  </div>
</template>
