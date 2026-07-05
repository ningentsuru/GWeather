<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const route = useRoute()
const { userLogin, userSignup } = useApi()

interface LoginSignUpProp {
  isLogin?: boolean
}

const props = withDefaults(defineProps<LoginSignUpProp>(), {
  isLogin: false,
})

const { fetch: refreshSession } = useUserSession()

const serverError = ref<string | null>(null)

const getFormSchema = (isLogin: boolean) => {
  return z.object({
    email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
    name: isLogin
      ? z.string().optional()
      : z.string().regex(/^\s*\S+\s+\S+[\s\S]*$/, 'Name must contain at least two words'),

    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
  })
}

const formSchema = toTypedSchema(getFormSchema(props.isLogin))

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const loginSignup = async (body: { email: string; name?: string; password: string }) => {
  serverError.value = null

  try {
    if (props.isLogin) {
      await userLogin({ email: body.email, password: body.password })
    } else {
      await userSignup({
        email: body.email,
        name: body.name ?? '',
        password: body.password,
      })
    }

    await refreshSession()

    const redirectPath = (route.query.redirect as string) || '/'

    await navigateTo(redirectPath)
  } catch (error: any) {
    const message =
      error?.response?._data?.message || 'Invalid email or password. Please try again.'
    serverError.value = message
  }
}

const onSubmit = handleSubmit(async (values) => {
  await loginSignup(values)
})

const onInput = () => {
  if (serverError.value) serverError.value = null
}
</script>

<template>
  <Card class="login-sign-up w-full max-w-sm">
    <form class="space-y-4" @submit="onSubmit">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>Enter your email below to login to your account</CardDescription>
        <CardAction>
          <Button type="button" variant="link" as-child>
            <NuxtLink :to="isLogin ? '/sign-up' : '/login'">
              {{ isLogin ? 'Sign up' : 'Login' }}
            </NuxtLink>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent class="flex flex-col gap-4">
        <FormField v-slot="{ componentField }" name="email">
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="admin@admin.com"
                v-bind="componentField"
                @input="onInput"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-if="!isLogin" v-slot="{ componentField }" name="name">
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input type="text" placeholder="John Doe" v-bind="componentField" @input="onInput" />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ componentField }" name="password">
          <FormItem>
            <FormLabel>Password</FormLabel>
            <FormControl>
              <Input
                type="password"
                placeholder="Admin1234"
                v-bind="componentField"
                @input="onInput"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </CardContent>
      <CardFooter class="flex flex-col gap-2">
        <ErrorMessage :show="Boolean(serverError)">
          <p>{{ serverError }}</p>
        </ErrorMessage>
        <Button type="submit" class="w-full cursor-pointer" :disabled="isSubmitting">
          Sign In
        </Button>
      </CardFooter>
    </form>
  </Card>
</template>

<style scoped></style>
