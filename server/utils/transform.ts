import { snakeCase as toSnake } from 'snake-case'

export function snakeCaseKeys<T extends Record<string, any>>(obj: T): T {
  if (typeof obj !== 'object' || obj === null) return obj

  if (Array.isArray(obj)) {
    return obj.map(snakeCaseKeys) as unknown as T
  }

  const newObj: any = {}
  for (const [key, value] of Object.entries(obj)) {
    newObj[toSnake(key)] = typeof value === 'object' ? snakeCaseKeys(value) : value
  }
  return newObj
}
