<script setup lang="ts">
// import { useQuizStore } from '~/stores/quiz'

// const QUIZ_STORE = useQuizStore()

// const quizView = computed(() => QUIZ_STORE.GET_QUIZ_STATUS)
</script>

<template>
  <div class="complete-form">
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="text-brand flex items-center justify-center">
          <Icon name="radix-icons:info-circled" class="w-24 h-24 text-red-600 rounded-full" />
        </div>
        <span class="bg-slate-300 mb-[10px] inline-block h-1 w-16 rounded-[100%]" />
        <div class="flex flex-col items-center justify-center mx-auto">
          <label for="error" class="text-heading mb-1.5 block text-base font-semibold leading-6">
            <div class="flex items-center  justify-center">Not Found</div>
          </label>
          <label for="error" class="text-muted-foreground block text-sm font-normal leading-6">Sorry, quiz no longer available or expired.</label>
        </div>
      </div>
    </div>
  </div>
</template>
