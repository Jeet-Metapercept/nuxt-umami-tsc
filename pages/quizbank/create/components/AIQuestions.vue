<script setup lang="ts">
import Questions from './QuestionBank.vue'
import Placeholder from '@/components/EmptyPlaceholder.vue'
import type { QuestionRow } from '@/utils/types/types'
import { Button } from '@/components/ui/button'

interface AIQuizQuestion {
  question: {
    text: string
    description: string
    reference: string
  }
  answers: {
    text: string
    is_correct: boolean
  }[]
  category: string
  difficulty: number
  tags: string[]
}

interface Props {
  category?: string
  max?: number
}
const props = withDefaults(defineProps<Props>(), {
  max: 10,
  category: 'Random',
})
const emit = defineEmits(['onSelection'])

const loading = ref(false)
const aiquestions = ref<QuestionRow[]>([])

async function generateQuestionAI() {
  loading.value = true
  const params = { message: `Please generate quiz questions for category ${props?.category}`, category: props?.category, count: 10, difficulty: 1 }

  const { data, error } = await useFetch<{ response: Array<AIQuizQuestion> }>('/api/ai/generate/questions', {
    body: params,
    method: 'post',
  })

  if (error.value)
    console.error(error.value)

  if (data.value) {
    const questionRowQuestions: QuestionRow[] = data.value?.response.map((q) => {
      return {
        ...q,
        author: 'ai@quizzee.com',
        view_only_answers: q.answers.map(a => ({ text: a.text })),
      }
    })

    aiquestions.value = questionRowQuestions
  }

  loading.value = false
}

// eslint-disable-next-line unused-imports/no-unused-vars
async function generateQuestionFlowiseAI() {
  try {
    loading.value = true
    const params = { message: `Please generate quiz questions for category ${props?.category}`, category: props?.category, count: 5, difficulty: 1 }

    const { data, error } = await useFetch(
      'https://ai.proximabiz.net/api/v1/prediction/536be74f-1cb5-482d-82fc-ba0230afc57b',
      {
        method: 'post',
        headers: {
          'Authorization': 'Bearer wkMbWswqgs3zZZXm2/Dwe5oOZYrzGooNoO7QPfuWFsk=',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: params.message }),
      },
    )

    if (error.value) {
      console.error('API Error:', error.value)
      loading.value = false
      throw new Error(`API Error: ${error.value}`)
    }

    const ai_questions = data.value as string
    // JSON Sanity Check and Parsing
    try {
      const jsonMatch = ai_questions?.match(/json\s*({.*})/s)
      const fixedJsonStr = jsonMatch ? jsonMatch[1] : ai_questions
      const ai_questions_json = JSON.parse(fixedJsonStr) as AIQuizQuestion[]

      if (ai_questions_json) {
        const questionRowQuestions: QuestionRow[] = ai_questions_json.map((q) => {
          return {
            ...q,
            author: 'testai@quizzee.com',
            view_only_answers: q.answers.map(a => ({ text: a.text })),
            views: 0,
            published: false,
          }
        })

        aiquestions.value = questionRowQuestions

        // // add questions to question bank first
        // const questionsCreated = await QUESTION_STORE.CREATE_BULK_QUESTIONS({ questions: aiquestions.value })

        // if (questionsCreated)
        //   aiquestions.value = questionsCreated as unknown as QuestionRow[]
      }
    }
    catch (jsonError) {
      console.error('JSON Parsing Error:', jsonError)
      // Handle JSON parsing errors
      // return or throw custom error
    }
  }
  catch (error) {
    console.error('General Error:', error)
    loading.value = false
  }
  finally {
    loading.value = false
  }
}

const selected_ai_questions = ref<QuestionRow[]>([])
function handleSelectedQuestions(questions: QuestionRow[]) {
  selected_ai_questions.value = questions

  emit('onSelection', selected_ai_questions.value)
}
</script>

<template>
  <div>
    <Placeholder
      v-if="aiquestions.length === 0" :icon="loading ? 'svg-spinners:bars-rotate-fade' : 'fluent:document-one-page-sparkle-20-regular'"
      title="AI Assistant" :text="loading ? 'This may take up to a minute, please be patient.' : 'create AI-powered questions easily'"
      class="mb-4"
    />

    <div class="grid gap-2 grid-cols-1">
      <Button :disabled="loading" @click="generateQuestionAI">
        <Icon :name="loading ? 'svg-spinners:blocks-wave' : 'material-symbols:magic-button'" class="me-2" />
        {{ loading ? 'Generating...' : selected_ai_questions.length ? `Generate Again` : `Generate` }}
      </Button>
    </div>

    <div v-if="aiquestions.length > 0" class="grid gap-2">
      <Questions :selectable="true" :max="Number(props.max)" :loading="loading" :questions="aiquestions" @on-selection="handleSelectedQuestions" />
    </div>
  </div>
</template>
