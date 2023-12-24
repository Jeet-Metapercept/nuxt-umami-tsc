<script setup lang="ts">
interface Props {
  title: string
  subtitle: string
}

const props = defineProps<Props>()
</script>

<template>
  <div>
    <h2 class="text-2xl font-bold tracking-tight">
      {{ props.title }}
    </h2>
    <p class="text-muted-foreground">
      {{ props.subtitle }}
    </p>
  </div>
</template>
