<script setup lang="ts">
import DataTable from './components/DataTable.vue'
import { columns } from './components/columns'
import type { Question } from './data/schema'
import Banner from '@/components/core/page/banner.vue'
import { Button } from '@/components/ui/button'
import { useQuestionStore } from '@/stores/questionbank'

definePageMeta({
  layout: 'app-layout',
})

const router = useRouter()
const page = {
  title: 'Question Bank',
  sub: 'A collection of questions.',
}
const questions_bank = ref<Question[]>([])
const STORE = useQuestionStore()

onMounted(async () => {
  await STORE.FETCH_CATEGORIES()
  const data = await STORE.FETCH_QUESTIONS({ limit: 100 })
  if (data)
    questions_bank.value = data as any
},
)
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 lg:p-8 md:flex">
    <div class="flex items-center justify-between space-y-2">
      <Banner :title="page.title" :subtitle="page.sub" />
      <div class="flex items-center space-x-2">
        <Button class="lg:w-42" @click="router.push('/questionbank/new')">
          <Icon name="radix-icons:plus-circled" class="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>
    </div>
    <DataTable :data="questions_bank" :columns="columns" />
  </div>
</template>
