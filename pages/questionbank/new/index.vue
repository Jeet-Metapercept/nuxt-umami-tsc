<script setup lang="ts">
import CreateQuestion from './components/CreateQuestion.vue'
import { Button } from '@/components/ui/button'

const router = useRouter()

definePageMeta({
  layout: 'app-layout',
})
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 lg:p-8 md:flex">
    <div class="flex items-center justify-between space-y-2">
      <div>
        <h2 class="text-2xl font-bold tracking-tight">
          New Question
        </h2>
        <p class="text-muted-foreground">
          Create a new question
        </p>
      </div>
      <div class="flex items-center space-x-2">
        <Button class="lg:w-36" @click="router.back()">
          <Icon name="radix-icons:arrow-left" class="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>
    <CreateQuestion />
  </div>
</template>
