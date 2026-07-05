<script setup lang="ts">
interface Column {
  name: string
  field: string
}

interface Meta {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface DataTableProps {
  datas: any[]
  columns: Column[]
  meta?: Meta
}

const props = withDefaults(defineProps<DataTableProps>(), {
  datas: () => [],
  columns: () => [],
  meta: () => ({ page: 1, limit: 10, total: 0, totalPages: 0, hasNext: false, hasPrev: false }),
})

const emit = defineEmits<{
  (e: 'page-change', page: number): void
}>()

const currentPage = computed(() => props.meta?.page || 1)
const totalPages = computed(() => props.meta?.totalPages || 0)

const handlePageChange = (newPage: number) => {
  if (newPage < 1 || newPage > totalPages.value) return
  if (newPage === currentPage.value) return
  emit('page-change', newPage)
}
const visiblePages = computed(() => {
  const pages: (number | 'ellipsis')[] = []
  const total = totalPages.value
  const current = currentPage.value
  const delta = 1

  for (let i = 1; i <= total; i++) {
    if (i === 1 || i === total || (i >= current - delta && i <= current + delta)) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== 'ellipsis' && pages.length > 0) {
      pages.push('ellipsis')
    }
  }
  return pages
})
</script>

<template>
  <div class="w-full">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead v-for="{ name } in columns" :key="name">
            {{ name }}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow v-if="datas.length === 0">
          <TableCell :colspan="columns.length" class="h-24 text-center"> No results. </TableCell>
        </TableRow>
        <TableRow v-for="(data, index) in datas" :key="data.id || index">
          <TableCell v-for="{ field } in columns" :key="field">
            <slot :name="`cell-${field}`" :row="data" :field="field" :value="data[field]">
              <slot name="cell" :row="data" :field="field" :value="data[field]">
                {{ data[field] }}
              </slot>
            </slot>
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <div v-if="meta && meta.totalPages > 1" class="flex items-center justify-center gap-2 py-4">
      <Button
        class="cursor-pointer text-xs sm:text-sm"
        variant="outline"
        size="sm"
        :disabled="!meta.hasPrev"
        @click="handlePageChange(meta.page - 1)"
      >
        Previous
      </Button>

      <div class="hidden sm:flex" v-for="(page, index) in visiblePages" :key="index">
        <Button
          v-if="page !== 'ellipsis'"
          class="cursor-pointer"
          variant="outline"
          size="sm"
          :class="{ 'bg-foreground! text-background!': page === meta.page }"
          @click="handlePageChange(page)"
        >
          {{ page }}
        </Button>
        <span v-else key="`ellipsis-${index}`" class="px-2">...</span>
      </div>
      <div class="flex text-xs sm:hidden">{{ currentPage }} out of {{ totalPages }} Pages</div>

      <Button
        class="cursor-pointer text-xs sm:text-sm"
        variant="outline"
        size="sm"
        :disabled="!meta.hasNext"
        @click="handlePageChange(meta.page + 1)"
      >
        Next
      </Button>
    </div>
  </div>
</template>
