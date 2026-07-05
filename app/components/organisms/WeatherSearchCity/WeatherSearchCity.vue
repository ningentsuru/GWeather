<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

import type { WeatherResponse } from '@/types'

const { getCityWeather } = useApi()
const { loggedIn } = useUserSession()
const { setItem } = useLocalStorage()

const weather = useState<WeatherResponse>('weather')

const needCredentials = ref<boolean>(false)

const formSchema = toTypedSchema(
  z.object({
    city: z.string().min(2, {
      message: 'Please enter a valid city name (at least 2 characters).',
    }),
  }),
)

const { handleSubmit, isSubmitting, setFieldTouched, validateField } = useForm({
  validationSchema: formSchema,
})

defineExpose({
  setFieldTouched,
  validateField,
})

const onSubmit = handleSubmit(async (values) => {
  if (weather.value.city && !loggedIn.value) {
    needCredentials.value = true
    return
  }
  weather.value = (await getCityWeather(values)) as WeatherResponse
  setItem('weather', JSON.stringify(weather.value))
})
</script>

<template>
  <Card class="weather-search-city">
    <CardHeader>
      <CardTitle class="text-md sm:text-2xl">Search by City</CardTitle>
      <CardDescription> Enter a city name to retrieve current weather conditions. </CardDescription>
    </CardHeader>
    <CardContent>
      <form class="space-y-4" @submit="onSubmit">
        <FormField v-slot="{ componentField }" name="city">
          <FormItem>
            <FormLabel>City</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder="e.g., Manila, Tokyo, London"
                v-bind="componentField"
              />
            </FormControl>
            <FormDescription> Type the name of any city worldwide. </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <ErrorMessage :show="needCredentials">
          <p>
            You need to <NuxtLink to="/login" class="underline">login</NuxtLink> to search the
            weather
          </p>
        </ErrorMessage>
        <Button type="submit" class="cursor-pointer" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="mr-2 animate-spin">⟳</span>
          {{ isSubmitting ? 'Searching...' : 'Get Weather' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
