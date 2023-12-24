<script setup lang="ts">
import QuestionCard from './components/Question.vue'
import SubmitCard from './components/Submit.vue'
import PrepareCard from './components/Prepare.vue'
import ErrorCard from './components/Error.vue'
import ScoreCard from './components/Score.vue'
import SelectionSheet from './components/Selection.vue'
import { getValidQuizIdFromRouteParam } from './helper'
import type { QuizRow } from '~/utils/types/quiz.types'
import { useQuizStore } from '~/stores/quiz'

const route = useRoute()
const visibility = useDocumentVisibility()
const project = useRuntimeConfig().public.PROJECT_NAME
const host = useRuntimeConfig().public.BASEURL
const QUIZ_STORE = useQuizStore()
definePageMeta({
  layout: 'default',
})

const quizView = computed(() => QUIZ_STORE.GET_QUIZ_STATUS)
const quiz = computed(() => QUIZ_STORE.GET_QUIZ)
const quizId = getValidQuizIdFromRouteParam(route.params.id)

const current_question_index = ref<number>(0)
const marked_as_later = computed(() => QUIZ_STORE.GET_MARKED_AS_LATER)

async function prepareQuiz(quizId: string) {
  const response = await QUIZ_STORE.FETCH_QUIZZE({ quizId }).catch(() => QUIZ_STORE.SET_QUIZ_STATUS('error')) as QuizRow
  if (!response) {
    await delay(2000)
    QUIZ_STORE.SET_QUIZ_STATUS('error')
    return
  }

  await QUIZ_STORE.SET_QUIZ(response)
  QUIZ_STORE.SET_QUIZ_STATUS('ready')
}

watch(visibility, (current, previous) => {
  if (current === 'visible' && previous === 'hidden') {
    if (quizView.value === 'in-process')
      QUIZ_STORE.SET_QUIZ_META({ leavecount: true })
  }
})

onMounted(async () => {
  if (!quizId) {
    QUIZ_STORE.SET_QUIZ_STATUS('error')
    return
  }

  await prepareQuiz(quizId)
})

useSeoMeta({
  title: () => quiz.value?.name || project,
  description: () => quiz.value?.description || `Powered by ${project}`,
  ogTitle: () => quiz.value?.name || project,
  ogDescription: () => quiz.value?.description || `Powered by ${project}`,
  ogImage: () => quiz.value?.image_url || `${host}android-chrome-512x512.png`,
  ogUrl: () => quiz.value?.direct_link || host,
  twitterTitle: () => quiz.value?.name || project,
  twitterDescription: () => quiz.value?.description || `Powered by ${project}`,
  twitterImage: () => quiz.value?.image_url || `${host}android-chrome-512x512.png`,
  twitterCard: 'summary',
})
</script>

<template>
  <div class="min-h-[100vh] flex items-center justify-center">
    <div class="mx-auto max-w-7xl w-full p-6 lg:p-0 md:max-w-lg">
      <div class="w-full border rounded-lg border-slate-300 shadow-sm">
        <div class="flex h-8 w-full items-center rounded-t-lg bg-slate-100">
          <div class="ml-6 flex space-x-2">
            <div class="h-3 w-3 rounded-full bg-red-500" /><div class="h-3 w-3 rounded-full bg-amber-500" /><div class="h-3 w-3 rounded-full bg-emerald-500" />
          </div>
          <p class="ml-4 flex w-full justify-between font-mono text-sm text-slate-400" />
          <div v-if="quizView === 'in-process'" class="flex items-center">
            <button
              class="flex items-center border appearance-none rounded-md hover:text-slate-600 focus:outline-none dark:text-slate-700 dark:hover:text-slate-500 bg-white text-sm text-slate-500 p-[3px] mr-1"
              @click="QUIZ_STORE.TOGGLE_MARKED_AS_LATER(current_question_index)"
            >
              <Icon :name="marked_as_later.includes(current_question_index) ? 'radix-icons:bookmark-filled' : 'radix-icons:bookmark'" class="cursor-pointer text-muted-foreground" />
            </button>
            <SelectionSheet v-model:current_question="current_question_index" />
          </div>
        </div>

        <!-- Pre -->
        <PrepareCard v-if="quizView === 'pre' || quizView === 'ready'" class="h-[550px]" :quiz="quiz" />

        <!-- Quiz -->
        <transition-fade v-else-if="quizView === 'in-process'" appear>
          <QuestionCard v-model:current_question="current_question_index" />
        </transition-fade>

        <!-- Submit -->
        <transition-fade v-else-if="quizView === 'submit' || quizView === 'complete'" appear>
          <SubmitCard class="h-[550px]" />
        </transition-fade>

        <!-- Score -->
        <transition-fade v-else-if="quizView === 'result'" appear>
          <ScoreCard class="h-[550px]" />
        </transition-fade>

        <!-- Error -->
        <transition-fade v-else appear>
          <ErrorCard class="h-[550px]" />
        </transition-fade>
      </div>

      <div class="mt-8">
        <a class="mb-5 mt-2 flex justify-center" :href="host"><p class="text-signature text-xs">Powered by <b><span class="text-info-text hover:text-heading">{{ project }}</span></b></p></a><div class="bg-accent-bg h-2 w-full rounded-full">
          <div class="transition-width bg-brand z-20 h-2 rounded-full duration-500" style="width: 16%;" />
        </div>
      </div>
    </div>
  </div>
</template>
