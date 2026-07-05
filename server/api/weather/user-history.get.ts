export default defineEventHandler(async (event) => {
  const session = await getUserSession(event)
  if (!session.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const user = session.user as { id: string }

  const query = getQuery(event)

  const page = Number(query.page) || 1
  const limit = Number(query.limit) || 10
  const sortOrder = (query.sort as string) || 'desc'

  const safePage = Math.max(1, page)
  const safeLimit = Math.min(100, Math.max(1, limit))

  const storage = useStorage('gweather')
  const userKey = `weather:${user.id}`

  let history = await storage.getItem<any[]>(userKey)

  if (!history || !Array.isArray(history)) {
    history = []
  }

  history.sort((a, b) => {
    const dateA = new Date(a.created_at || a.dt || 0).getTime()
    const dateB = new Date(b.created_at || b.dt || 0).getTime()

    if (isNaN(dateA) || isNaN(dateB)) return 0

    return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
  })

  const total = history.length
  const totalPages = Math.ceil(total / safeLimit)

  const start = (safePage - 1) * safeLimit
  const end = start + safeLimit

  const paginatedHistory = history.slice(start, end)

  return {
    data: paginatedHistory,
    meta: {
      page: safePage,
      limit: safeLimit,
      total,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  }
})
