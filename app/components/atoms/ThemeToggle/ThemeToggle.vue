<script setup lang="ts">
import { Sun, Moon } from '@lucide/vue'

const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (val: boolean) => {
    colorMode.preference = val ? 'dark' : 'light'
  },
})

const toggleDark = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}
</script>

<template>
  <ClientOnly>
    <Button
      class="toggle-theme h-5 w-5 cursor-pointer rounded-full p-4"
      variant="outline"
      size="lg"
      @click.prevent="toggleDark"
    >
      <Sun v-if="!isDark" class="h-5 w-5" />
      <Moon v-else class="h-5 w-5" />
    </Button>
    <template #fallback>
      <div
        class="h-5 w-5 animate-spin cursor-not-allowed rounded-full border-x border-gray-400 p-4"
      />
    </template>
  </ClientOnly>
</template>
