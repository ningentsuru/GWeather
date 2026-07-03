interface WeatherResponse {
  name: string
  main: { temp: number }
  weather: { description: string; icon: string }[]
}

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const city = query.city as string

  if (!city) {
    throw createError({
      statusCode: 400,
      statusMessage: 'City parameter is required',
    })
  }

  const config = useRuntimeConfig()
  const baseUrl = config.openWeatherApiUrl
  const apiKey = config.openWeatherApiKey

  const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`

  try {
    const data = await $fetch<WeatherResponse>(url)

    if (!data.weather || !data.weather[0]) {
      throw new Error('Weather data not available')
    }

    return {
      city: data.name,
      temp: data.main.temp,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      fetchedAt: new Date().toLocaleString(),
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch weather',
      cause: error,
    })
  }
})
