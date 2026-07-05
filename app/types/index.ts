import { z } from 'zod'
import schemas from '@/../server/schemas/Weather'

export type Weather = z.infer<typeof schemas.WeatherSchema>
export type WeatherCondition = z.infer<typeof schemas.WeatherConditionSchema>
export type Coord = z.infer<typeof schemas.CoordSchema>
export type WeatherResponse = z.infer<typeof schemas.WeatherResponseSchema>
