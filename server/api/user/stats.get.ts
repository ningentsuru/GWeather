export default defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  const userIdentifier = (user as any).name ?? (user as any).email ?? 'user'
  return { stats: 'Secret data for ' + userIdentifier }
})
