<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import EmptyPlaceholder from '@/components/EmptyPlaceholder.vue'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'
import Banner from '@/components/core/page/banner.vue'
import { useQuizBankStore } from '~/stores/quizbank'
import type { QuizRow } from '~/utils/types/quiz.types'
import { useQuestionStore } from '~/stores/questionbank'

definePageMeta({
  layout: 'app-layout',
})
const router = useRouter()
const page = {
  title: 'Quiz Bank',
  sub: 'A collection of quizzes.',
}
const QUIZ_STORE = useQuizBankStore()
const STORE = useQuestionStore()
const allQuiz = ref<QuizRow[]>([])

onMounted(async () => {
  await STORE.FETCH_CATEGORIES()
  allQuiz.value = await QUIZ_STORE.FETCH_QUIZZES({}) as QuizRow[]
})
</script>

<template>
  <div class="h-full flex-1 flex-col space-y-8 lg:p-8 md:flex">
    <div class="flex items-center justify-between space-y-2">
      <Banner :title="page.title" :subtitle="page.sub" />
      <div class="flex items-center space-x-2">
        <Button class="lg:w-36" @click="router.push('/quizbank/create')">
          <Icon name="radix-icons:plus-circled" class="mr-2 h-4 w-4" />Create
        </Button>
      </div>
    </div>

    <div>
      <Tabs default-value="all">
        <TabsList class="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="recent">
            Recent
          </TabsTrigger>
          <TabsTrigger value="all">
            All
          </TabsTrigger>
        </TabsList>
        <TabsContent value="recent">
          <EmptyPlaceholder icon="radix-icons:info-circled" title="No Quizzes Found" text="You do not have any quizzes at the moment." />
        </TabsContent>
        <TabsContent value="all">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead class="w-[100px]" />
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  Questions
                </TableHead>
                <TableHead>
                  Duration
                </TableHead>
                <TableHead class="text-right pr-8">
                  Link
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody v-if="allQuiz.length">
              <TableRow v-for="q in allQuiz" :key="q.id">
                <TableCell>
                  <Avatar>
                    <AvatarImage
                      :src="q?.image_url || 'https://api.dicebear.com/7.x/initials/svg?seed=Quiz'" alt="quiz-avatar"
                    />
                    <AvatarFallback>{{ q.name }}</AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell class="font-medium">
                  {{ q.name }}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {{ q.category }}
                  </Badge>
                </TableCell>
                <TableCell>
                  {{ q.size }}
                </TableCell>
                <TableCell>
                  {{ q.max_time === 0 ? 'no limit' : `${q.max_time} min` }}
                </TableCell>
                <TableCell class="text-right">
                  <a :href="q.direct_link" target="_blank">
                    <Button variant="link" class="text-right">
                      <Icon name="radix-icons:external-link" class="me-2" />
                      View
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  </div>
</template>
