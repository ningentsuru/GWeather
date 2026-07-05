import { useStorage } from '#imports'

export default defineEventHandler(async (event) => {
  const session = (await getUserSession(event)) as unknown as { user: { role: 'user' | 'admin' } }

  if (!session.user || session.user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Admin access required',
    })
  }

  const storage = useStorage('gweather')

  const allKeys = await storage.getKeys('weather:')

  const allHistory = await Promise.all(
    allKeys.map(async (key: string) => {
      const data = await storage.getItem<any[]>(key)
      const userId = key.replace('history:', '')
      return { userId, data: data || [] }
    }),
  )

  return allHistory
})
