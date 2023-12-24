<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useQuizStore } from '~/stores/quiz'
import type { QuizQuestion } from '~/stores/quiz/types'
import UserNav from '@/components/core/header/components/UserNav.vue'

const { auth } = useSupabaseClient()
const QUIZ_STORE = useQuizStore()
const route = useRoute()
const router = useRouter()
const user = useSupabaseUser()
const quiz = computed(() => QUIZ_STORE.GET_QUIZ)
const start = ref({ isLoading: false, text: 'Verifying user...' })
const status = computed(() => QUIZ_STORE.GET_QUIZ_STATUS)
const default_img = 'https://api.dicebear.com/7.x/initials/svg?seed=Quiz'

function redirectUnauthenticatedUsers() {
  if (user.value)
    return true

  if (!user.value) {
    router.push({
      path: '/auth/login',
      query: {
        redirect: route.fullPath,
      },
    })
  }
}

async function loginWithGoogle() {
  const { error } = await auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.href,
    },
  })
  if (error)
    start.value.isLoading = false
}

async function prepareQuestions(ids: string[]) {
  const questions = await QUIZ_STORE.FETCH_QUIZZE_QUESTIONS({ ids }).catch(() => QUIZ_STORE.SET_QUIZ_STATUS('error')) as unknown as QuizQuestion[]

  const questionsWithSubmittedAnswer = questions.map(item => ({
    ...item,
    submitted_answers: item.view_only_answers.map(answer => ({
      ...answer,
      is_selected: false,
    })),
  }))

  await QUIZ_STORE.SET_QUESTIONS(questionsWithSubmittedAnswer)
  QUIZ_STORE.SET_QUIZ_STATUS('ready')
}

async function startQuiz() {
  start.value.isLoading = true
  // prepare questions only if user authenticated
  await delay(2000)
  if (redirectUnauthenticatedUsers() && quiz.value) {
    start.value.text = 'Gathering questions...'
    await prepareQuestions(quiz.value.questions!).catch(() => QUIZ_STORE.SET_QUIZ_STATUS('error'))
    await delay(3000)
    start.value.text = 'Resetting timer...'
    // Countdown loop
    for (let countdown = 3; countdown >= 0; countdown--) {
      start.value.text = `Beginning in ${countdown}...`
      await delay(1000)
    }

    start.value.isLoading = false
    QUIZ_STORE.SET_QUIZ_META({ start: new Date() })
    QUIZ_STORE.SET_QUIZ_STATUS('in-process')
  }
}
</script>

<template>
  <div class="complete-form">
    <div class="flex items-center justify-center h-full">
      <div class="text-center">
        <div class="text-brand flex items-center justify-center">
          <Icon v-if="status !== 'ready'" name="svg-spinners:bouncing-ball" class="w-24 h-24 text-green-600 rounded-full" />
          <transition-fade v-else appear>
            <Avatar class="h-12 w-12 mb-4">
              <AvatarImage
                :src="quiz?.image_url || default_img" alt="quiz-image"
              />
              <AvatarFallback>QZ</AvatarFallback>
            </Avatar>
          </transition-fade>
        </div>
        <span class="bg-slate-300 mb-[10px] inline-block h-1 w-16 rounded-[100%]" />

        <div v-if="status === 'pre'">
          <label class="mb-1.5 text-muted-foreground block text-sm font-normal leading-6">
            <Icon name="svg-spinners:180-ring" class="me-2 h-3 w-3" />preparing, please wait.</label>
        </div>

        <transition-fade appear>
          <div v-if="status === 'ready'">
            <span class="text-heading mb-1.5 block text-base font-semibold leading-6">
              <div class="flex items-center  justify-center">{{ quiz?.name || 'Take a Quiz' }}</div>
            </span>

            <span class="text-muted-foreground block text-sm font-normal leading-6">
              {{ start.isLoading ? start.text : `Total Questions [${quiz?.size || '?'}]` }}
            </span>

            <div class="mt-6 flex justify-center gap-2">
              <div v-if="user?.email" class="w-full">
                <Button type="submit" variant="default" class="w-full" :class="start.isLoading ? 'cursor-progress' : ''" :disabled="!user" @click="startQuiz">
                  <Icon v-if="start.isLoading" name="svg-spinners:180-ring" class="me-3" />
                  {{ start.isLoading ? 'Please wait...' : 'Ready' }}
                </Button>

                <div class="mt-6 text-start">
                  <div class="flex items-center space-x-2 ring-1 ring-secondary rounded-full p-1 ">
                    <UserNav />

                    <div>
                      <p class="text-sm font-medium leading-none">
                        {{ user?.user_metadata.full_name || 'Guest' }}
                      </p>
                      <p class="text-xs text-muted-foreground">
                        {{ user?.email || 'guestuser@email.com' }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center w-3/4">
                <Button variant="outline" @click="loginWithGoogle">
                  <Icon name="logos:google-icon" class="mr-2 h-4 w-4" />
                  Continue with Google
                </Button>

                <p class="font-normal leading-5 text-xs text-muted-foreground py-2">
                  By proceeding, you agree to the
                  <a href="/terms" class="hover:underline underline-offset-4 hover:text-primary">Terms of Service</a> and
                  <a href="/privacy" class="hover:underline underline-offset-4 hover:text-primary">Privacy Policy</a>.
                </p>
              </div>
            </div>
            <!-- <div class="mt-4 text-start">
              <Alert variant="default">
                <Icon name="lucide:lock" class="w-4 h-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div> -->
          </div>
        </transition-fade>
      </div>
    </div>
  </div>
</template>
