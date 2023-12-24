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
          Beautifully designed <a class="underline underline-offset-4 hover:text-primary" href="https://www.shadcn-vue.com">shadcn</a> components that you can copy and paste into your apps. Accessible. Customizable. Open Source.
        </p>

        <div class="flex flex-wrap justify-center gap-4">
          <NuxtLink
            to="/app"
            class="block w-full rounded px-12 py-3 text-sm font-medium text-gray-600 shadow hover:blue-gray-700 focus:outline-none focus:ring hover:border-emerald-900 active:text-red-500 sm:w-auto"
          >
            Get Started
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>
