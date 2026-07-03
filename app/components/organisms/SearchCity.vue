<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'

const { getCityWeather } = useApi()

const emit = defineEmits(['get-weather'])

const formSchema = toTypedSchema(
  z.object({
    city: z.string().min(2, {
      message: 'Please enter a valid city name (at least 2 characters).',
    }),
  }),
)

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (values) => {
  emit('get-weather', await getCityWeather(values))
})
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Search by City</CardTitle>
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
        <Button type="submit" class="cursor-pointer" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="mr-2 animate-spin">⟳</span>
          {{ isSubmitting ? 'Searching...' : 'Get Weather' }}
        </Button>
      </form>
    </CardContent>
  </Card>
</template>
