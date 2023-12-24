<script setup lang="ts">
import { cn } from '@/lib/utils'

interface Props {
  title?: string
  sub?: string
  img?: string
  aspectRatio?: 'portrait' | 'square'
  width?: number
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  aspectRatio: 'portrait',
  img: 'https://api.dicebear.com/7.x/shapes/svg?seed=Quiz',
})
</script>

<template>
  <div :class="cn('space-y-3', $attrs.class ?? '')">
    <div class="overflow-hidden rounded-md">
      <img
        :src="img"
        :alt="title"
        :width="width"
        :height="height"
        :class="cn(
          'h-auto w-auto object-cover transition-all hover:scale-105',
          aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-square',
        )"
      >
    </div>
    <div class="space-y-1 text-sm">
      <h3 v-if="props?.title" class="font-medium leading-none">
        {{ title }}
      </h3>
      <p v-if="props?.sub" class="text-xs text-muted-foreground">
        {{ sub }}
      </p>
    </div>
  </div>
</template>
