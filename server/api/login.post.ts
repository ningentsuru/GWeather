import { z } from 'zod'

interface User {
  id: string
  name: string
  email: string
  password: string
}

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const { email, password } = await readValidatedBody(event, bodySchema.parse)

  const storage = useStorage('gweather')
  const userKey = `users:${email}`

  const user = await storage.getItem<User>(userKey)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unable to log in.  Please check your details or create a new account.' })
  }

  const isValid = await verifyPassword(user.password, password)

  if (!isValid) {
    throw createError({ statusCode: 401, message: 'Unable to log in.  Please check your details or create a new account.' })
  }

  await setUserSession(event, {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
  })

  return { success: true }
})
