<script setup lang="ts">
import { usePageviewStore } from '@/stores/pageview'

const project = useRuntimeConfig().public.PROJECT_NAME
const VIEWS = usePageviewStore()
VIEWS.incrementView()
VIEWS.updateLastSeen()
</script>

<template>
  <section class="bg-gray-50">
    <div
      class="mx-auto w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center"
    >
      <div class="mx-auto max-w-3xl text-center">
        <h1
          class="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-bold drop-shadow-md text-transparent sm:text-7xl"
        >
          {{ project }}
        </h1>

        <p class="mx-auto my-4 max-w-xl sm:text-md/relaxed text-gray-600">
          Integrate Umami Analytics into your Nuxt websites / applications.
        </p>
      </div>
    </div>
  </section>
</template>
