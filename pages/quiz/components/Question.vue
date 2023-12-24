<script setup lang="ts">
import VueCountdown from '@chenfengyuan/vue-countdown'
import QOption from './Option.vue'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useQuizStore } from '~/stores/quiz'
import type { QuizQuestion, UserAnswer } from '~/stores/quiz/types'

// import SelectionSheet from './Selection.vue'

const QUIZ_STORE = useQuizStore()
const user = useSupabaseUser()
const confirmAlert = ref(false)
// const status = computed(() => QUIZ_STORE.GET_QUIZ_STATUS)
const current_question_index = defineModel<number>('current_question', { default: 0 })
const total_questions = computed(() => QUIZ_STORE.GET_QUESTIONS.length)
const current_question = ref<QuizQuestion | null>(null)
const current_question_options = ref<UserAnswer[]>([])
const is_last_question = computed(() => current_question_index.value === total_questions.value - 1)

const timer = ref(false) // https://github.com/fengyuanchen/vue-countdown/blob/HEAD/src/README.md
const attended = computed(() => QUIZ_STORE.GET_ATTENDED_QUESTIONS)
const unattended = computed(() => QUIZ_STORE.GET_UNATTENDED_QUESTIONS)
getCurrentQuestion(current_question_index.value)

function getCurrentQuestion(index: number) {
  const Q = QUIZ_STORE.GET_CURRENT_QUESTION(index)
  QUIZ_STORE.SET_CURRENT_QUESTIONS({ index, question: Q! })
  current_question.value = Q
  current_question_options.value = Q?.submitted_answers || []
}

function nextQuestion() {
  if (!is_last_question.value)
    getCurrentQuestion(++current_question_index.value)
}

function reviewAnswers() {
  confirmAlert.value = true
}

async function submitAnswers() {
  QUIZ_STORE.SET_QUIZ_STATUS('submit')
  QUIZ_STORE.SET_QUIZ_META({ end: new Date() })

  await delay(2000)
  await QUIZ_STORE.SUBMIT_RESULT({ submit_as: user?.value?.email })
}

// Single Select
function handleOptionSelected(selectedOption: UserAnswer & { index: number; is_selected: boolean }) {
  current_question_options.value.forEach((option, i) => {
    option.is_selected = i === selectedOption.index ? selectedOption.is_selected : false
  })

  QUIZ_STORE.SET_QUESTION_ANSWERS({ index: current_question_index.value, answers: current_question_options.value })
}

// Allow Multi Select
// function handleOptionSelected(selectedOption: OptionType & { index: number; is_selected: boolean }) {
//   options.value[selectedOption.index].is_selected = selectedOption.is_selected
// }

watch(current_question_index, (newIndex) => {
  getCurrentQuestion(newIndex)
})
</script>

<template>
  <div class="quizze-form">
    <div class="w-full">
      <div class="flex flex-col justify-between p-6">
        <div class="my-auto lg:p-8">
          <div class="w-full">
            <label class="block font-mono text-xs text-slate-400 border-b border-dashed mt-4 mb-4">
              <div class="flex items-center justify-between py-1.5">
                <span>Question</span>
                <span>{{ `${current_question_index + 1}/${total_questions}` }}</span>
              </div>
            </label>

            <div class="min-h-[75px]">
              <label class="text-heading block text-base font-semibold leading-6">
                <div class="flex items-center justify-between">{{ current_question?.question.text }}</div>
              </label>
              <label class="text-muted-foreground block text-xs font-normal leading-6">Can select one</label>
            </div>

            <div class="my-6">
              <fieldset>
                <legend class="sr-only">
                  Options
                </legend>
                <transition-slide>
                  <div class="bg-survey-bg relative max-h-[42vh] space-y-2 overflow-y-auto rounded-md py-0.5">
                    <QOption v-for="(option, i) in current_question_options" :key="i" :icon="`tabler:letter-${String.fromCharCode(97 + i)}`" :option="option" :index="i" @selected="handleOptionSelected" />
                  </div>
                </transition-slide>
              </fieldset>
            </div>

            <div class="flex w-full justify-between mt-auto">
              <Button v-if="is_last_question" variant="default" class="w-full" size="lg" @click="reviewAnswers">
                Submit
                <Icon name="radix-icons:share-2" class="ms-2" />
              </Button>

              <Button v-else variant="default" class="w-full" size="lg" :disabled="is_last_question" @click="nextQuestion();">
                Next
                <Icon name="radix-icons:arrow-right" class="ms-2 " />
              </Button>
            </div>

            <!-- mobile device buttons -->
            <!-- <div class="fixed bottom-0 left-0 right-0 md:hidden lg:hidden">
              <div class="ma-4">
                <Button v-if="is_last_question" variant="default" class="w-full rounded-none" size="lg" @click="status = 'complete'">
                  Submit
                  <Icon name="radix-icons:arrow-right" class="ms-2 " />
                </Button>

                <Button v-else variant="default" :disabled="is_last_question" class="w-full rounded-none" size="lg" @click="nextQuestion()">
                  Next
                  <Icon name="radix-icons:arrow-right" class="ms-2 " />
                </Button>
              </div>
            </div> -->
          </div>
        </div>
        <div v-if="timer" class="countdown text-center mt-6">
          <ClientOnly>
            <VueCountdown v-if="timer" v-slot="{ minutes, seconds }" :time="30 * 60 * 1000" :auto-start="true" class="font-mono text-xs cursor-progress text-slate-500 hover:text-slate-600">
              <Icon name="radix-icons:timer" /> Time Remaining: {{ minutes }}:{{ seconds }}
            </VueCountdown>
          </ClientOnly>
        </div>
      </div>
    </div>

    <!-- confirmation dialog -->
    <AlertDialog :open="confirmAlert">
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Submit Answers</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to submit your answers?
            <span v-if="unattended > 0">You have not attended <span class="text-red-500">{{ unattended }}</span> questions. This action cannot be undone.</span>
          </AlertDialogDescription>
          <AlertDialogDescription>
            <div class="py-0">
              <div class="flex items-center gap-2 justify-center md:justify-start">
                <Badge variant="secondary" class="text-green-500">
                  <Icon name="tabler:circle-filled" class="me-1" /> Attended {{ attended }}
                </Badge>
                <Badge variant="secondary" class="text-orange-500">
                  <Icon name="tabler:circle-filled" class="me-1" /> Unattended {{ unattended }}
                </Badge>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel @click="confirmAlert = false">
            Cancel
          </AlertDialogCancel>
          <!-- <AlertDialogAction>
            <SelectionSheet v-model:current_question="current_question_index" :custom="true" />
          </AlertDialogAction> -->
          <AlertDialogAction @click="submitAnswers">
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
</template>
