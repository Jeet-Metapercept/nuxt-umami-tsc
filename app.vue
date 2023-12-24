<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'

const project = useRuntimeConfig().public.PROJECT_NAME
const project_desc = useRuntimeConfig().public.PROJECT_DESCRIPTION
const host = useRuntimeConfig().public.BASEURL

useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-16x16.png',
    },
  ],
  // script: [
  //   { src: 'https://accounts.google.com/gsi/client', async: true, defer: true },
  // ],
})
useSeoMeta({
  title: project,
  ogTitle: project,
  description: project_desc || `Powered by ${project}`,
  ogDescription: project_desc || `Powered by ${project}`,
  ogImage: `${host}android-chrome-512x512.png`,
  ogUrl: host,
  twitterTitle: project,
  twitterDescription: project_desc || `Powered by ${project}`,
  twitterImage: `${host}android-chrome-512x512.png`,
  twitterCard: 'summary',
})
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
  </NuxtLayout>
  <Toaster />
</template>
