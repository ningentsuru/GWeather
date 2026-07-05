import { Weather } from '@/types'
import { snakeCaseKeys } from '@/../server/utils/transform'
import dayjs from 'dayjs'

export default defineEventHandler(async (event) => {
  const query = await getQuery(event)
  const city = query.city as string

  if (!city) {
    throw createError({
      statusCode: 400,
      statusMessage: 'City parameter is required',
    })
  }

  const session = await getUserSession(event)
  const user = session.user as { id: string } | undefined

  const config = useRuntimeConfig()
  const baseUrl = config.openWeatherApiUrl
  const apiKey = config.openWeatherApiKey

  const url = `${baseUrl}?q=${city}&appid=${apiKey}&units=metric`

  try {
    const data = await $fetch<Weather>(url)

    if (!data.weather || !data.weather[0]) {
      throw new Error('Weather data not available')
    }

    const result = {
      id: crypto.randomUUID(),
      userId: user?.id || 'anonymous',
      city: data.name,
      country: data.sys.country,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      description: data.weather[0].description,
      dt: data.dt,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      temp: data.main.temp,
      timezone: data.timezone,
    }

    if (user && user.id) {
      const storage = useStorage('gweather')
      const userKey = `weather:${user.id}`

      const existingHistory = (await storage.getItem<any[]>(userKey)) || []
      const updatedHistory = [...existingHistory, snakeCaseKeys(result)]

      await storage.setItem(userKey, updatedHistory)
    }

    return result
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch weather',
      cause: error,
    })
  }
})
