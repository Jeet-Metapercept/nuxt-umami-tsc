<script setup lang="ts">
import QuizCard from './components/Question.vue'
import SubmitCard from './components/Submit.vue'
import SelectionSheet from './components/Selection.vue'

const project = useRuntimeConfig().public.PROJECT_NAME
const url = useRuntimeConfig().public.BASEURL

definePageMeta({
  layout: 'default',
})

const complete = ref(false)
</script>

<template>
  <div class="h-screen flex items-center justify-center">
    <div class="mx-auto max-w-7xl w-full p-6 lg:p-0 md:max-w-lg">
      <div class="w-full border rounded-lg border-slate-300 shadow-sm">
        <div class="flex h-8 w-full items-center rounded-t-lg bg-slate-100">
          <div class="ml-6 flex space-x-2">
            <div class="h-3 w-3 rounded-full bg-red-500" /><div class="h-3 w-3 rounded-full bg-amber-500" /><div class="h-3 w-3 rounded-full bg-emerald-500" />
          </div><p class="ml-4 flex w-full justify-between font-mono text-sm text-slate-400" />
          <div class="flex items-center">
            <Icon name="radix-icons:star" class="mr-2 cursor-pointer text-muted-foreground" @click="complete = !complete" />
            <Icon name="radix-icons:enter-full-screen" class="mr-2 cursor-pointer text-muted-foreground" />
            <SelectionSheet />
          </div>
        </div>

        <!-- Quiz -->
        <QuizCard v-if="!complete" class="h-[550px]" />

        <!-- Complete -->
        <SubmitCard v-else class="h-[550px]" />
      </div>
      <div class="mt-8">
        <a class="mb-5 mt-2 flex justify-center" :href="url"><p class="text-signature text-xs">Powered by <b><span class="text-info-text hover:text-heading">{{ project }}</span></b></p></a><div class="bg-accent-bg h-2 w-full rounded-full">
          <div class="transition-width bg-brand z-20 h-2 rounded-full duration-500" style="width: 16%;" />
        </div>
      </div>
    </div>
  </div>
</template>
