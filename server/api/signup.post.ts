import { z } from 'zod'

const bodySchema = z.object({
  email: z.string().email(),
  name: z.string(),
  password: z.string().min(8),
})

export default defineEventHandler(async (event) => {
  const { email, name, password } = await readValidatedBody(event, bodySchema.parse)

  const storage = useStorage('gweather')
  const userKey = `users:${email}`

  const existingUser = await storage.getItem(userKey)
  if (existingUser) {
    throw createError({
      statusCode: 409,
      message: 'User with this email already exists',
    })
  }

  const hashedPassword = await hashPassword(password)

  const newUser = {
    id: crypto.randomUUID(),
    name,
    email,
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  }

  await storage.setItem(userKey, newUser)

  await setUserSession(event, {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    },
  })

  return { success: true, user: { id: newUser.id, name: newUser.name, email: newUser.email } }
})
