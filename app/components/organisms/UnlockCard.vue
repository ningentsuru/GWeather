<script setup lang="ts">
const emit = defineEmits(['unlock'])

interface UnlockBackgroundProps {
  uniqueId: string
  buttonText: string
  blur?: boolean
}

const props = withDefaults(defineProps<UnlockBackgroundProps>(), {
  uniqueId: '',
  buttonText: '',
  blur: false,
})
</script>

<template>
  <Card>
    <slot name="card-header" />

    <slot v-if="!props.blur" />

    <CardContent
      v-if="props.blur"
      class="overlay-content inset-0 z-10 flex h-full w-full items-center justify-center backdrop-blur-sm"
    >
      <Button variant="outline" class="cursor-pointer" @click.prevent="emit('unlock', uniqueId)">
        {{ buttonText }}
      </Button>
    </CardContent>
  </Card>
</template>
