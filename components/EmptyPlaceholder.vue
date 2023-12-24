<script setup lang="ts">
interface Props {
  icon?: string
  title?: string
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  icon: 'tabler:info-circle',
  title: 'Uh oh!',
  text: 'An error occurred, please retry.',
})

const size = '44'
</script>

<template>
  <div class="flex h-[250px] shrink-0 items-center justify-center rounded-md border border-dashed">
    <div class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
      <Icon :name="props.icon" :size="size" class="text-muted-foreground" />
      <h3 class="mt-4 text-lg font-semibold">
        {{ title }}
      </h3>
      <p class="mb-4 mt-2 text-sm text-muted-foreground">
        {{ text }}
      </p>
    </div>
  </div>
</template>
