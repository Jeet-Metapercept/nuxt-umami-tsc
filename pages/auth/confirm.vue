<script setup lang="ts">
import { delay } from '@/utils/helper'

const user = useSupabaseUser()
const project = useRuntimeConfig().public.PROJECT_NAME

watch(
  user,
  async () => {
    if (user.value) {
      await delay(7000)
      return navigateTo('/app')
    }
    else { return navigateTo('/auth/login') }
  },
  { immediate: true },
)
</script>

<template>
  <div class="grid h-screen px-4 bg-white place-content-center">
    <div class="text-center">
      <h1 class="font-black text-gray-200 text-7xl">
        <Icon name="svg-spinners:90-ring-with-bg" class="text-stone-400" />
      </h1>

      <p
        class="my-4 text-2xl font-bold tracking-tight text-gray-600 sm:text-4xl"
      >
        Please wait...
      </p>

      <p class="mt-4 text-gray-500">
        you're being redirected to <b>{{ project }}</b>...
      </p>
    </div>
  </div>
</template>
