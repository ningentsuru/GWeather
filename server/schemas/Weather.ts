import { z } from 'zod'

const CoordSchema = z.object({
  lon: z.number(),
  lat: z.number(),
})

const WeatherConditionSchema = z.object({
  id: z.number(),
  main: z.string(),
  description: z.string(),
  icon: z.string(),
})

const MainWeatherSchema = z.object({
  temp: z.number(),
  feels_like: z.number(),
  temp_min: z.number(),
  temp_max: z.number(),
  pressure: z.number(),
  humidity: z.number(),
  sea_level: z.number().optional(),
  grnd_level: z.number().optional(),
})

const WindSchema = z.object({
  speed: z.number(),
  deg: z.number(),
  gust: z.number().optional(),
})

const CloudsSchema = z.object({
  all: z.number(),
})

const SysSchema = z.object({
  type: z.number(),
  id: z.number(),
  country: z.string(),
  sunrise: z.number(),
  sunset: z.number(),
})

export const WeatherSchema = z
  .object({
    coord: CoordSchema,
    weather: z.array(WeatherConditionSchema),
    base: z.string(),
    main: MainWeatherSchema,
    visibility: z.number(),
    wind: WindSchema,
    clouds: CloudsSchema,
    dt: z.number(),
    sys: SysSchema,
    timezone: z.number(),
    id: z.number(),
    name: z.string(),
    cod: z.number(),
  })
  .strict()

export const WeatherResponseSchema = z
  .object({
    city: z.string(),
    country: z.string(),
    description: z.string(),
    dt: z.number(),
    createdAt: z.string(),
    icon: z.string(),
    main: z.string(),
    sunrise: z.number(),
    sunset: z.number(),
    temp: z.number(),
    timezone: z.number(),
  })
  .strict()

export default { WeatherSchema, WeatherConditionSchema, CoordSchema, WeatherResponseSchema }
