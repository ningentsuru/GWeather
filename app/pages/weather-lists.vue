<script setup lang="ts">
import authenticated from '@/middleware/authenticated'
import type { WeatherResponse } from '@/types'

const { unixAndTimezoneFormat } = useDateFormat()
const { toFahrenheit } = useTemperature()

definePageMeta({
  middleware: authenticated,
})

interface Meta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}
const history = ref<{ data: WeatherResponse[]; meta: Meta }>({
  data: [],
  meta: { page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false },
})

const { getUserHistory } = useApi()

const loadHistory = async (page: number = 1) => {
  const response = await getUserHistory(page, 10)
  history.value = response as any
}

onMounted(async () => {
  await loadHistory(1)
})

const onPageChange = (newPage: number) => {
  loadHistory(newPage)
}
</script>

<template>
  <Card class="weather-history">
    <CardContent>
      <DataTable
        class="w-full"
        :datas="history.data"
        :columns="[
          { name: 'Date time', field: 'dt' },
          { name: 'Country', field: 'country' },
          { name: 'City', field: 'city' },
          { name: 'Temperature °C/°F', field: 'temp' },
          { name: 'Description', field: 'description' },
        ]"
        :meta="history.meta"
        @page-change="onPageChange"
      >
        <template #cell-dt="{ row }">
          {{ unixAndTimezoneFormat(row.dt, row.timezone, 'YYYY-MM-DD HH:mm:ss') }}
        </template>

        <template #cell-temp="{ row }">
          <div class="flex w-30 justify-between">
            <span class="w-12 text-right">{{ row.temp }}°C</span> /
            <span class="w-12">{{ toFahrenheit(row.temp, 2) }}°F</span>
          </div>
        </template>

        <template #cell-description="{ row }">
          <div class="flex gap-2">
            <img
              :src="`https://openweathermap.org/img/wn/${row.icon}@2x.png`"
              alt="weather icon"
              :class="[
                row.icon.includes('n') ? 'bg-blue-400' : 'bg-blue-400',
                'border-foreground/50 h-5 w-5 rounded-full border shadow-sm',
              ]"
            />
            <span>{{ row.description }}</span>
          </div>
        </template>
      </DataTable>
    </CardContent>
  </Card>
</template>
