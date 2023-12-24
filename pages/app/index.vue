<script setup lang="ts">
import QuizArtwork from './components/QuizArtwork.vue'
import EmptyPlaceholder from '@/components/EmptyPlaceholder.vue'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useQuizBankStore } from '@/stores/quizbank'
import type { QuizRow } from '~/utils/types/quiz.types'

definePageMeta({
  layout: 'app-layout',
})

const router = useRouter()
const routes = [{
  name: 'Question Bank',
  path: '/questionbank',
},
{
  name: 'Quiz Bank',
  path: '/quizbank',
}]
const QUIZ_STORE = useQuizBankStore()
const allQuiz = ref<QuizRow[]>([])
function goToQuiz(quiz: QuizRow) {
  const url = router.resolve({ path: `/quiz/${quiz.id}` })
  window.open(url.href, '_blank')
}

onMounted(async () => {
  allQuiz.value = await QUIZ_STORE.FETCH_QUIZZES({ limit: 5 }) as QuizRow[]
})
</script>

<template>
  <div class="block">
    <!-- <Menu /> -->
    <div class="border">
      <div class="bg-background">
        <div class="grid lg:grid-cols-5">
          <!-- <Sidebar :playlists="playlists" class="hidden lg:block" /> -->
          <div class="col-span-3 lg:col-span-12">
            <div class="h-full p-4">
              <Tabs default-value="navigation" class="h-full space-y-6">
                <div class="space-between flex items-center">
                  <TabsList class="grid w-full grid-cols-3 lg:w-[600px]">
                    <TabsTrigger value="navigation" class="relative">
                      Navigation
                    </TabsTrigger>
                    <TabsTrigger value="quiz" class="relative">
                      Quiz
                    </TabsTrigger>
                    <!-- <TabsTrigger value="music" class="relative">
                      Music
                    </TabsTrigger> -->
                    <TabsTrigger value="upcoming">
                      Upcoming
                    </TabsTrigger>
                    <!-- <TabsTrigger value="live">
                      Live
                    </TabsTrigger> -->
                  </TabsList>
                </div>
                <TabsContent
                  value="navigation"
                  class="h-full flex-col border-none p-0 data-[state=active]:flex"
                >
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <h2 class="text-2xl font-semibold tracking-tight">
                        Navigation
                      </h2>
                      <p class="text-sm text-muted-foreground">
                        Quickly access all modules
                      </p>
                    </div>
                  </div>
                  <Separator class="my-4" />
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button v-for="route in routes" :key="route.name" variant="outline" size="lg" class="w-full h-24" @click="router.push({ path: route.path })">
                      {{ route.name }}
                      <Icon name="radix-icons:arrow-right" class="ms-2 h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>
                <TabsContent
                  value="quiz"
                  class="border-none p-0 outline-none"
                >
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <h2 class="text-2xl font-semibold tracking-tight">
                        Take a Quiz
                      </h2>
                      <p class="text-sm text-muted-foreground">
                        Top picks for you. Updated daily.
                      </p>
                    </div>
                  </div>
                  <Separator class="my-4" />
                  <div class="relative">
                    <ScrollArea>
                      <div class="flex space-x-4 pb-4 max-w-[80vw] md:max-w-full">
                        <QuizArtwork
                          v-for="quiz in allQuiz"
                          :key="quiz.id"
                          :title="quiz.name"
                          :sub="`Questions [${quiz.size}]`"
                          :img="quiz.image_url"
                          class="w-[250px] cursor-pointer"
                          aspect-ratio="portrait"
                          :width="250"
                          :height="330"
                          @click="goToQuiz(quiz)"
                        />
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div>
                  <!-- <div class="mt-6 space-y-1">
                    <h2 class="text-2xl font-semibold tracking-tight">
                      Made for You
                    </h2>
                    <p class="text-sm text-muted-foreground">
                      Your personal playlists. Updated daily.
                    </p>
                  </div>
                  <Separator class="my-4" />
                  <div class="relative">
                    <ScrollArea>
                      <div class="flex space-x-4 pb-4">
                        <AlbumArtwork
                          v-for="album in madeForYouAlbums"
                          :key="album.name"
                          :album="album"
                          class="w-[150px]"
                          aspect-ratio="square"
                          :width="150"
                          :height="150"
                        />
                      </div>
                      <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                  </div> -->
                </TabsContent>
                <TabsContent
                  value="upcoming"
                  class="h-full flex-col border-none p-0 data-[state=active]:flex"
                >
                  <div class="flex items-center justify-between">
                    <div class="space-y-1">
                      <h2 class="text-2xl font-semibold tracking-tight">
                        Upcoming Quiz
                      </h2>
                      <p class="text-sm text-muted-foreground">
                        Your favorite quizzes. Updated daily.
                      </p>
                    </div>
                  </div>
                  <Separator class="my-4" />
                  <EmptyPlaceholder icon="radix-icons:calendar" title="Not Available" text="You do not have any quizzes scheeduled at the moment." />
                </TabsContent>
                <!-- <TabsContent
                  value="live"
                  class="h-full flex-col border-none p-0 data-[state=active]:flex"
                >
                  <EmptyPlaceholder icon="lucide:wifi-off" title="Network Error" text="Failed to connect, please try again later." />
                </TabsContent> -->
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
