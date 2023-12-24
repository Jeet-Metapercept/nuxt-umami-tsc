<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useQuizStore } from '~/stores/quiz'

const props = defineProps<Props>()
const QUIZ_STORE = useQuizStore()
interface Props {
  custom?: boolean
}
// const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const

const current_question_index = defineModel<number>('current_question', { default: 0 })
const questions_numbers = computed(() => Array.from(QUIZ_STORE.GET_QUESTIONS.keys()))
const marked_as_later = computed(() => QUIZ_STORE.GET_MARKED_AS_LATER)

const submitted_answers = computed(() =>
  QUIZ_STORE.questions.map((item, index) => {
    const hasSelectedAnswer = item.submitted_answers?.some(answer => answer.is_selected)
    return hasSelectedAnswer ? index : null
  }).filter(index => index !== null),
)

const question_icon = computed(() => (index: number) => {
  if (submitted_answers.value.includes(index))
    return 'tabler:circle-filled'

  if (marked_as_later.value.includes(index))
    return 'tabler:circle-half-2'

  else
    return 'tabler:circle'
})

function pickQuestion(q: number) {
  current_question_index.value = q
}
</script>

<template>
  <div class="grid">
    <!-- <Sheet v-for="side in SHEET_SIDES" :key="side"> -->
    <Sheet>
      <SheetTrigger as-child>
        <span v-if="props.custom">
          Switch Question
        </span>
        <button v-else class="inline-flex items-center border appearance-none  rounded-md relative hover:text-slate-600 focus:outline-none dark:text-slate-700 dark:hover:text-slate-500 py-0.2 mr-2 bg-white px-2 font-sans text-sm text-slate-500">
          Switch
          <Icon name="tabler:status-change" class="ml-2 cursor-pointer text-muted-foreground" />
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" class="lg:border lg:w-[800px] lg:mx-auto">
        <SheetHeader class="text-start">
          <SheetTitle>
            Switch to
          </SheetTitle>
          <SheetDescription>
            Jump to a question
          </SheetDescription>
        </SheetHeader>
        <div class="grid pt-4 lg:pb-2">
          <div class="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-5 gap-2 bg-muted rounded p-2">
            <SheetClose v-for="(q, i) in questions_numbers" :key="i" as-child>
              <Button size="sm" :variant="current_question_index === q ? 'default' : 'outline'" type="submit" @click="pickQuestion(q)">
                <Icon :name="question_icon(q)" class="me-2" />{{ q + 1 }}
              </Button>
            </SheetClose>
          </div>
        </div>
        <SheetFooter class="md:items-center md:justify-between">
          <SheetClose as-child>
            <Button type="submit" variant="outline" class="lg:w-36">
              Close
            </Button>
          </SheetClose>

          <div class="py-4">
            <div class="flex gap-1">
              <Badge variant="secondary">
                <Icon name="tabler:circle-filled" class="me-1" /> Attended
              </Badge>
              <Badge variant="secondary">
                <Icon name="tabler:circle" class="me-1" /> Unattended
              </Badge>
              <Badge variant="secondary">
                <Icon name="tabler:circle-half-2" class="me-1" /> Marked as later
              </Badge>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
