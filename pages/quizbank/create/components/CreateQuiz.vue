<script setup lang="ts">
import Questions from './QuestionBank.vue'
import AIQuestions from './AIQuestions.vue'
import { useFaker } from '~/composables/useFaker'
import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { useToast } from '@/components/ui/toast/use-toast'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useQuestionStore } from '@/stores/questionbank'
import { useQuizBankStore } from '@/stores/quizbank'
import type { QuestionRow } from '~/utils/types/types'
import { type QuizRow, quizSchema } from '~/utils/types/quiz.types'

const { toast } = useToast()
const project = useRuntimeConfig().public.PROJECT_NAME
const QUESTION_STORE = useQuestionStore()
const QUIZ_STORE = useQuizBankStore()
const user = useSupabaseUser()
const faker = useFaker()
const isLoading = ref(false)
const isComplete = ref<{ complete: boolean; quizid: string | undefined }>({
  complete: false,
  quizid: undefined,
})

// Categories
const categories = computed(() => QUESTION_STORE.GET_CATEGORIES)
const isSategoriesOpen = ref(false)
const selectedCategory = ref(categories.value[0])
function filterCategoryFunction(val: string[], search: string) {
  return val.filter(item => item.toLowerCase().includes(search.toLowerCase()))
}

// Difficultly
const difficulty = Array.from({ length: 10 }, (_, index) => index + 1)
const selectedDifficultly = ref()

// Max Number of Question
const maxQ = [5, 10, 20, 30, 40, 50]
const selectedMaxQ = ref(maxQ[0].toString())

// Time limits
const timeLimits = [10, 30, 45, 60, 90, 0]
const selectedTimelimit = ref(timeLimits[timeLimits.length - 1].toString())

// Randomize Questions
const selectedRandomize = ref(false)

// Show results
const selectedShowResults = ref(true)

// Selected Questions
const selectedQuestions = ref<QuestionRow[]>([])
function handleSelectedQuestions(questions: QuestionRow[]) {
  // console.log(selectedQuestions.value)
  selectedQuestions.value = questions
}
// Selected AI Questions
function handleAISelectedQuestions(aiquestions: QuestionRow[]) {
  selectedQuestions.value = aiquestions
}
function removeSelectedQuestion(index: number) {
  selectedQuestions.value.splice(index, 1)
}

// Questions
type QuestionsTab = 'pick' | 'auto' | 'ai'
const questionsTab = ref<QuestionsTab>('auto')
const questions = ref<QuestionRow[]>([])
async function fetchQuestions(limit?: number) {
  isLoading.value = true
  const data = await QUESTION_STORE.FETCH_QUESTIONS({ limit })
  if (data) {
    if (!questions.value.length)
      await delay(3000)
    questions.value = data as any[]
  }
  isLoading.value = false
}

function tabChange(tab: string) {
  questionsTab.value = tab as QuestionsTab
  if (tab === 'pick')
    fetchQuestions()
}

const quiz = reactive<QuizRow>({
  name: faker.generateQuizName(),
  description: '',
  image_url: `https://api.dicebear.com/7.x/shapes/svg?seed=${faker.generateQuizName()}`,
  category: selectedCategory.value,
  size: Number(selectedMaxQ.value) || 0,
  max_time: Number(selectedTimelimit.value) || 0,
  difficulty: Number(selectedDifficultly.value) || 1,
  randomize: false,
  published: false,
  show_results: true,
})

function exampleQuiz() {
  const randomQuiz = faker.generateRandomQuiz()

  quiz.name = randomQuiz.name
  quiz.description = randomQuiz.description
  selectedMaxQ.value = (randomQuiz.size!).toString()
  selectedCategory.value = randomQuiz.category!
  selectedTimelimit.value = (randomQuiz.max_time!).toString()
  selectedDifficultly.value = randomQuiz.difficulty?.toString()
  selectedRandomize.value = randomQuiz.randomize!
  selectedShowResults.value = randomQuiz.show_results!
}

async function submitQuiz() {
  isLoading.value = true

  const quizRow: QuizRow = {
    name: quiz.name,
    description: quiz.description,
    image_url: quiz.image_url,
    category: selectedCategory.value,
    size: Number(selectedMaxQ.value) || 0,
    max_time: Number(selectedTimelimit.value) || 0,
    difficulty: Number(selectedDifficultly.value) || 1,
    randomize: selectedRandomize.value,
    published: quiz.published,
    show_results: quiz.show_results,
    views: 0,
  }

  if (user.value?.email)
    quizRow.author = user.value?.email

  // validations
  const validationResult = quizSchema.safeParse(quizRow)

  if (validationResult.success) {
    // add manual questions
    if (questionsTab.value === 'pick') {
      const questionIds = selectedQuestions.value.map(q => q.id!)
      const questionCount = questionIds.length
      quizRow.questions = questionIds

      if (questionCount !== quizRow.size) {
        let description
        if (questionCount < quizRow.size!)
          description = `Number of questions (${questionCount}) is less than the required size (${quizRow.size}).`
        else
          description = `Number of questions (${questionCount}) exceeds the required size (${quizRow.size}).`

        toast({
          title: 'Validation Error',
          description,
          variant: 'destructive',
          duration: 8000,
        })
        isLoading.value = false
        return
      }

      await delay(3000)
      const newquiz: QuizRow[] = await QUIZ_STORE.NEW_QUIZ(quizRow) as QuizRow[]
      if (newquiz) {
        isComplete.value.quizid = newquiz[0].id
        await QUIZ_STORE.UPDATE_QUIZ({ quizId: newquiz[0].id, quizData: { ...newquiz[0], direct_link: `${window.location.origin}/quiz/${newquiz[0].id}` } }) as QuizRow[]
      }
    }

    // generate auto questions
    if (questionsTab.value === 'auto') {
      const random_questions: QuestionRow[] = await QUESTION_STORE.FETCH_RANDOM_QUESTIONS({ limit: quizRow.size }).catch(e => console.error(e)) as QuestionRow[]

      const questionIds = random_questions.map(q => q.id!)
      const questionCount = questionIds.length
      quizRow.questions = questionIds

      if (questionCount !== quizRow.size) {
        const description = `The question bank contains only ${questionCount} questions for your settings, which is insufficient to meet the requested criteria of ${quizRow.size} questions. Please readjust your configuration accordingly.`
        toast({
          title: 'Validation Error',
          description,
          variant: 'destructive',
          duration: 8000,
        })
        isLoading.value = false
        return
      }

      await delay(3000)
      const newquiz: QuizRow[] = await QUIZ_STORE.NEW_QUIZ(quizRow) as QuizRow[]
      if (newquiz) {
        isComplete.value.quizid = newquiz[0].id
        await QUIZ_STORE.UPDATE_QUIZ({ quizId: newquiz[0].id, quizData: { ...newquiz[0], direct_link: `${window.location.origin}/quiz/${newquiz[0].id}` } }) as QuizRow[]
      }
    }

    // add ai questions
    if (questionsTab.value === 'ai') {
      const questionCount = selectedQuestions.value.length

      if (questionCount !== quizRow.size) {
        let description
        if (questionCount < quizRow.size!)
          description = `Number of questions (${questionCount}) is less than the required size (${quizRow.size}).`
        else
          description = `Number of questions (${questionCount}) exceeds the required size (${quizRow.size}).`

        toast({
          title: 'Validation Error',
          description,
          variant: 'destructive',
          duration: 8000,
        })
        isLoading.value = false
        return
      }

      // add generated questions to question_bank
      const questionsCreated = await QUESTION_STORE.CREATE_BULK_QUESTIONS({ questions: selectedQuestions.value }).catch(e => console.error(e)) as unknown as QuestionRow[]
      if (!questionsCreated) {
        isLoading.value = false
        return
      }

      const questionIds = questionsCreated?.map(q => q.id!)
      quizRow.questions = questionIds

      await delay(3000)
      const newquiz: QuizRow[] = await QUIZ_STORE.NEW_QUIZ(quizRow) as QuizRow[]
      if (newquiz) {
        isComplete.value.quizid = newquiz[0].id
        await QUIZ_STORE.UPDATE_QUIZ({ quizId: newquiz[0].id, quizData: { ...newquiz[0], direct_link: `${window.location.origin}/quiz/${newquiz[0].id}` } }) as QuizRow[]
      }
    }

    isComplete.value.complete = true
    isLoading.value = false
  }
  else {
    // console.log(questionInput.value)
    console.error('Validation errors:', validationResult.error.errors)
    const errorMessages = useMap(validationResult.error.errors, e => useGet(e, 'message', ''))
    const allErrors = useUniq(errorMessages)
    toast({
      title: 'Validation Failed',
      description: allErrors.join('\n'),
      variant: 'destructive',
      duration: 8000,
    })
    isLoading.value = false
  }
}
</script>

<template>
  <div class="">
    <!-- <Button> new comp</Button> -->
    <Card v-if="!isComplete.complete">
      <CardHeader>
        <CardTitle class="flex justify-between">
          Quiz <Button size="sm" variant="outline" :disabled="isLoading" @click="exampleQuiz">
            <Icon
              name="radix-icons:question-mark-circled"
              class="mr-2 h-4 w-4"
            />
            Sample Quiz
          </Button>
        </CardTitle>
        <CardDescription>Create a new quiz</CardDescription>
      </CardHeader>

      <Separator class="mb-8" />

      <CardContent class="grid gap-6 mt-2">
        <div class="grid gap-2">
          <Label for="title" class="flex items-center justify-between">Title <Icon name="radix-icons:update" class="ms-1 w-3 h-3 cursor-pointer" @click="quiz.name = faker.generateQuizName()" /></Label>
          <Input id="title" v-model="quiz.name" placeholder="Quiz Title" :disabled="isLoading" />
        </div>
        <div class="flex gap-4 items-start">
          <div class="w-[110px] h-[110px] flex items-center justify-center rounded border cursor-pointer">
            <!-- <Icon name="material-symbols:add-photo-alternate-outline" class="w-12 h-12 text-slate-200" /> -->
            <img
              alt="quiz-logo"
              :src="quiz.image_url"
              class="block rounded"
              :height="110"
              :width="110"
            >
          </div>

          <div class="flex flex-col flex-grow">
            <Label for="description" class="mb-2">Description</Label>
            <Textarea
              id="description"
              v-model="quiz.description"
              placeholder="Please include all information relevant to your quiz."
              :disabled="isLoading"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="grid gap-2">
            <Label for="category">Category</Label>
            <Popover v-model:open="isSategoriesOpen">
              <PopoverTrigger as-child>
                <Button
                  variant="outline"
                  role="combobox"
                  :aria-expanded="isSategoriesOpen"
                  class=" justify-between"
                >
                  {{ selectedCategory ? selectedCategory : 'Select Category' }}
                  <Icon name="radix-icons:chevron-down" class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent class="p-0 lg:min-w-[350px]">
                <Command :filter-function="filterCategoryFunction">
                  <CommandInput placeholder="Search category..." />
                  <CommandEmpty>No category found.</CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem
                        v-for="c in categories"
                        :key="c"
                        :value="c"
                        @select="(ev) => {
                          selectedCategory = ev.detail.value!
                          isSategoriesOpen = false
                        }"
                      >
                        <Icon
                          name="radix-icons:check" :class="cn(
                            'mr-2 h-4 w-4',
                            selectedCategory === c ? 'opacity-100' : 'opacity-0',
                          )"
                        />

                        {{ c }}
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div class="grid gap-2">
            <Label for="timelimit">Time limit</Label>
            <Select v-model="selectedTimelimit" :disabled="isLoading">
              <SelectTrigger id="timelimit" class="line-clamp-1 w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(d, i) in timeLimits" :key="i" :value="d.toString()">
                  <Icon name="radix-icons:timer" /> {{ d === 0 ? `no limit` : `${d} min` }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label for="difficulty-level">Difficultly</Label>
            <Select v-model="selectedDifficultly" :disabled="isLoading">
              <SelectTrigger id="difficulty-level" class="line-clamp-1 w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(d, i) in difficulty" :key="i" :value="d.toString()">
                  {{ d }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="grid gap-2">
            <Label for="max-q-level">Number of Questions</Label>
            <Select v-model="selectedMaxQ" :disabled="isLoading">
              <SelectTrigger id="max-q-level" class="line-clamp-1 w-full truncate">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="(q, i) in maxQ" :key="i" :value="q.toString()">
                  {{ q }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid gap-2">
            <Label for="randomize">Randomization</Label>
            <Switch
              id="randomize"
              :checked="selectedRandomize"
              @update:checked="selectedRandomize = !selectedRandomize"
            />
          </div>

          <div class="grid gap-2">
            <Label for="show-results">Show Results</Label>
            <Switch
              id="show-results"
              :checked="selectedShowResults"
              @update:checked="selectedShowResults = !selectedShowResults"
            />
          </div>
        </div>

        <div class="grid gap-2">
          {{ questionsTab }}
          <Label for="quiz-questions">Questions</Label>
          <Tabs id="quiz-questions" default-value="auto" @update:model-value="(e) => tabChange(e)">
            <TabsList class="grid w-full grid-cols-3 lg:w-[400px]">
              <TabsTrigger value="auto">
                Auto
              </TabsTrigger>
              <TabsTrigger value="pick">
                Manual
              </TabsTrigger>
              <TabsTrigger value="ai" :disabled="false">
                {{ project }} AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="auto">
              <Alert class="mt-4">
                <Icon name="material-symbols:magic-button" class="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  Questions will be selected automatically based on your quiz configurations.
                </AlertDescription>
              </Alert>
            </TabsContent>
            <TabsContent value="ai">
              <Alert class="mt-4">
                <Icon name="radix-icons:magic-wand" class="h-4 w-4" />
                <AlertTitle>{{ project }} AI</AlertTitle>
                <AlertDescription>
                  Generate questions effortlessly with {{ project }} AI.
                </AlertDescription>
              </Alert>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
                <div class="grid gap-2">
                  <AIQuestions :max="Number(selectedMaxQ)" :category="selectedCategory" @on-selection="handleAISelectedQuestions" />
                </div>
                <div class="grid gap-2">
                  <div class="bg-muted rounded">
                    <div class="m-2">
                      <ClientOnly>
                        <draggable v-model="selectedQuestions">
                          <transition-group name="fade">
                            <div v-for="(q, i) in selectedQuestions" :key="i" class="bg-white rounded ring-gray-400 hover:ring-1 border my-2 p-2">
                              <div class="flex items-center justify-between rounded-md p-2 transition-all  cursor-grab">
                                <div class="space-y-1">
                                  <p class="text-sm font-medium leading-2">
                                    {{ `${i + 1}. ` }}{{ q.question.text }}
                                  </p>
                                </div>

                                <div class="flex items-center gap-2">
                                  <Icon name="radix-icons:minus-circled" class="text-muted-foreground hover:text-red-500 cursor-pointer" @click="removeSelectedQuestion(i)" />
                                  <Icon name="radix-icons:drag-handle-horizontal" class="text-muted-foreground cursor-row-resize" />
                                </div>
                              </div>
                            </div>
                          </transition-group>
                        </draggable>
                      </ClientOnly>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="pick">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="grid gap-2">
                  <Questions :selectable="true" :max="Number(selectedMaxQ)" :loading="isLoading" :questions="questions" @on-selection="handleSelectedQuestions" />
                </div>
                <div class="grid gap-2">
                  <div class="bg-muted rounded">
                    <div class="m-2">
                      <ClientOnly>
                        <draggable v-model="selectedQuestions">
                          <transition-group name="fade">
                            <div v-for="(q, i) in selectedQuestions" :key="i" class="bg-white rounded ring-gray-400 hover:ring-1 border my-2 p-2">
                              <div class="flex items-center justify-between rounded-md p-2 transition-all  cursor-grab">
                                <div class="space-y-1">
                                  <p class="text-sm font-medium leading-2">
                                    {{ `${i + 1}. ` }}{{ q.question.text }}
                                  </p>
                                  <!-- <p class="text-sm text-muted-foreground">
                                    <Badge>{{ q.category }}</Badge>
                                  </p> -->
                                </div>
                                <div class="flex items-center gap-2">
                                  <Icon name="radix-icons:minus-circled" class="text-muted-foreground hover:text-red-500 cursor-pointer" @click="removeSelectedQuestion(i)" />
                                  <Icon name="radix-icons:drag-handle-horizontal" class="text-muted-foreground cursor-row-resize" />
                                </div>
                              </div>
                            </div>
                          </transition-group>
                        </draggable>
                      </ClientOnly>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>

      <CardFooter class="flex justify-end space-x-2">
        <Button variant="outline" class="lg:w-36" :disabled="isLoading">
          Reset
        </Button>

        <Button class="lg:w-36" :disabled="isLoading" @click="submitQuiz">
          <Icon
            v-if="isLoading"
            name="svg-spinners:180-ring"
            class="mr-2"
          />
          Create Quiz
        </Button>
      </CardFooter>
    </Card>

    <transition-fade v-else appear>
      <Alert>
        <AlertTitle>New Quiz Created!</AlertTitle>
        <AlertDescription class="mt-2">
          Your new quiz has been successfully created and added to the quiz bank.
        </AlertDescription>

        <AlertDescription class="flex flex-wrap justify-start mt-8 gap-2">
          <NuxtLink to="/quizbank" class="w-full md:w-auto">
            <Button variant="default" size="default" class="w-full md:w-auto">
              Go to Quiz Bank
            </Button>
          </NuxtLink>

          <Button variant="outline" size="default" class="w-full md:w-auto" @click="isComplete.complete = false;">
            Create Another Quiz
          </Button>

          <NuxtLink v-if="isComplete.complete && isComplete.quizid" :to="`/quiz/${isComplete.quizid}`" class="w-full md:w-auto">
            <Button variant="outline" size="default" class="w-full md:w-auto">
              Take a Preview
            </Button>
          </NuxtLink>
        </AlertDescription>
      </Alert>
    </transition-fade>
  </div>
</template>
