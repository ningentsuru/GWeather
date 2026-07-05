<script setup lang="ts">
interface ErrorMessageProp {
  show: boolean
}

const props = withDefaults(defineProps<ErrorMessageProp>(), {
  show: false,
})
</script>

<template>
  <div
    v-if="show"
    class="error-message bg-destructive/15 text-destructive w-full rounded-md p-3 text-center text-sm"
  >
    <slot />
  </div>
</template>
