<script setup lang="ts">
import { cn } from '@/lib/utils'
</script>

<template>
  <nav
    :class="cn('flex items-center space-x-4 lg:space-x-6', $attrs.class ?? '')"
  >
    <a
      href="/app"
      class="text-sm font-medium transition-colors hover:text-primary"
    >
      Overview
    </a>
    <a
      href="/questionbank"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Question Bank
    </a>
    <a
      href="/quizbank"
      class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
    >
      Qizzeez
    </a>
  </nav>
</template>
