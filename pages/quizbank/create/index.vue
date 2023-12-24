<script setup lang="ts">
import CreateQuiz from './components/CreateQuiz.vue'
import { Button } from '@/components/ui/button'
import Banner from '@/components/core/page/banner.vue'
import { useQuestionStore } from '@/stores/questionbank'

definePageMeta({
  layout: 'app-layout',
})
const router = useRouter()
const page = {
  title: 'Create Quiz',
  sub: 'Create a new quizzes using quiz builder',
}

const STORE = useQuestionStore()

onMounted(async () => {
  await STORE.FETCH_CATEGORIES()
},
)
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 lg:p-8 md:flex">
    <div class="flex items-center justify-between space-y-2">
      <Banner :title="page.title" :subtitle="page.sub" />
      <div class="flex items-center space-x-2">
        <Button class="lg:w-36" @click="router.back()">
          <Icon name="radix-icons:arrow-left" class="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
    </div>

    <div>
      <CreateQuiz />
    </div>
  </div>
</template>
