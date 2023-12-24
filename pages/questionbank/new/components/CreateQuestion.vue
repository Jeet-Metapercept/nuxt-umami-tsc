<script setup lang="ts">
import { sampleQuestion } from './resources'
import { type Answer, type QuestionRow, questionRowSchema } from '@/utils/types/types'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Avatar } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/toast/use-toast'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import QuestionPreview from '@/components/QuestionPreview.vue'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { useQuestionStore } from '@/stores/questionbank'

const QUESTION_BANK = useQuestionStore()
const user = useSupabaseUser()
const isLoading = ref(false)
const isComplete = ref(false)
const isPreviewOpen = ref(false)
const { toast } = useToast()

const isOpenImage = ref({
  enabled: false,
  url: '',
})
// Categories
const isSategoriesOpen = ref(false)
const categories = computed(() => QUESTION_BANK.GET_CATEGORIES)
const selectedCategory = ref(categories.value[0])
function filterCategoryFunction(val: string[], search: string) {
  return val.filter(item => item.toLowerCase().includes(search.toLowerCase()))
}

// Difficultly
const difficulty = Array.from({ length: 10 }, (_, index) => index + 1)
const selectedDifficultly = ref()

// Tags
const tags = ref([
  { text: 'Tag-1', active: false },
  { text: 'Tag-2', active: false },
  { text: 'Tag-3', active: false },
  { text: 'Tag-4', active: false },
  { text: 'Tag-5', active: false },
])

function toggleTag(index: number) {
  tags.value[index].active = !tags.value[index].active
}

// Answers
const max_allowed_answers = 10
const answers = ref<Array<Answer>>(Array.from({ length: 4 }, () => ({ text: '', image_url: null, is_correct: false })))

function toggleIsCorrect(index: number) {
  answers.value[index].is_correct = !answers.value[index].is_correct
}

function addOption() {
  if (answers.value.length < max_allowed_answers) {
    answers.value.push({
      text: `Option ${String.fromCharCode(65 + answers.value.length)}`,
      image_url: null,
      is_correct: false,
    })
  }
  else {
    toast({
      description: `Maximum limit of ${max_allowed_answers} options reached.`,
      variant: 'destructive',
      duration: 4000,
    })
  }
}

function removeOption(index: number) {
  if (answers.value.length > 2) {
    answers.value.splice(index, 1)
    for (let i = 0; i < answers.value.length; i++)
      answers.value[i].text = `Option ${String.fromCharCode(65 + i)}`
  }
  else {
    toast({
      description: 'Minimum of 2 options required.',
      variant: 'destructive',
      duration: 4000,
    })
  }
}

const initialQuestion = ref({
  question: {
    text: '',
    description: '',
    image_url: isOpenImage.value.enabled ? isOpenImage.value.url : null,
    reference: '',
  },
  view_only_answers: Array.from({ length: 4 }, () => ({ text: '', image_url: null })),
  answers: Array.from({ length: 4 }, () => ({ text: '', image_url: null, is_correct: false })),
  author: '',
  category: selectedCategory.value,
  difficulty: 1,
  tags: [],
  views: 0,
  published: false,
})

const questionInput = ref<QuestionRow>(initialQuestion.value)
function resetQuestion() {
  questionInput.value = initialQuestion.value
  answers.value = initialQuestion.value.answers
}

function exampleQuestion() {
  questionInput.value = sampleQuestion
  answers.value = sampleQuestion.answers
  selectedCategory.value = sampleQuestion.category
  selectedDifficultly.value = sampleQuestion.difficulty.toString()
}

async function previewQuestion() {
  questionInput.value.question.text = questionInput.value.question.text.trim()
  questionInput.value.question.description = questionInput.value.question.description.trim()
  questionInput.value.question.reference = questionInput.value.question.reference.trim()
  questionInput.value.view_only_answers = answers.value.map(a => ({ text: a.text.trim(), image_url: a.image_url }))
  questionInput.value.answers = answers.value.map(a => ({ ...a, text: a.text.trim() }))

  questionInput.value.category = selectedCategory.value
  questionInput.value.difficulty = Number(selectedDifficultly.value) || 1
  questionInput.value.tags = tags.value.filter(tag => tag.active === true).map(tag => tag.text)

  if (user.value?.email)
    questionInput.value.author = user.value?.email

  // validations
  const validationResult = questionRowSchema.safeParse(questionInput.value)

  if (validationResult.success) {
    // console.log(questionInput.value)
    isPreviewOpen.value = true
  }
  else {
    // console.log(questionInput.value)
    // console.error('Validation errors:', validationResult.error.errors)
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

async function submitQuestion() {
  isLoading.value = true

  const questions = questionInput.value
  await delay(3000)
  const newQ = await QUESTION_BANK.CREATE_QUESTION({ questionRow: questions })
  isPreviewOpen.value = false
  isLoading.value = false

  if (newQ) {
    isComplete.value = true
    resetQuestion()
  }
}
</script>

<template>
  <Card v-if="!isComplete">
    <CardHeader>
      <CardTitle class="flex justify-between">
        New <Button size="sm" variant="outline" :disabled="isLoading" @click="exampleQuestion">
          <Icon
            name="radix-icons:question-mark-circled"
            class="mr-2 h-4 w-4"
          />
          Sample Question
        </Button>
      </CardTitle>
      <CardDescription>Add new question to question bank</CardDescription>
    </CardHeader>
    <Separator class="mb-8" />
    <CardContent class="grid gap-6">
      <Collapsible v-model:open="isOpenImage.enabled">
        <CollapsibleTrigger as-child>
          <Button variant="outline" class="w-48" :disabled="isLoading">
            <Icon name="radix-icons:image" class="mr-2 h-4 w-4" />Add Image
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div class="grid mt-4">
            <div class="flex w-full items-center gap-1.5 my-1">
              <p class="text-sm text-muted-foreground w-24">
                Image URL
              </p>
              <Input id="url" v-model="isOpenImage.url" placeholder="https://" class="mr-1" :disabled="isLoading" />
              <!-- <Button class="w-48" size="sm">
                Preview
              </Button> -->
            </div>
            <div v-if="isOpenImage.enabled && isOpenImage.url" class="mt-4">
              <NuxtImg
                alt="Question Image"
                :src="isOpenImage.url"
                width="400"
                class="block p-4 border border-dashed"
                :placeholder="'https://placehold.co/300x200?text=Invalid+Image'"
              />
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div class="grid gap-2">
        <Label for="question">Question</Label>
        <Input id="question" v-model="questionInput.question.text" placeholder="Type your Question..." :disabled="isLoading" />
      </div>
      <div class="grid gap-2">
        <Label for="description">Description</Label>
        <Textarea
          id="description"
          v-model="questionInput.question.description"
          placeholder="Please include all information relevant to your question."
          :disabled="isLoading"
        />
      </div>
      <div class="grid lg:grid-cols-2 gap-4">
        <div class="grid gap-2">
          <Label for="answers">Options</Label>
          <div class="flex flex-col flex-wrap gap-2">
            <div v-for="(a, i) in answers" :key="i" class="flex items-center gap-2">
              <Avatar>
                <Icon :name="`tabler:letter-${String.fromCharCode(97 + i)}`" class="h-4 w-4" />
              </Avatar>
              <Input v-model="a.text" :placeholder="`Option ${String.fromCharCode(65 + i)}`" :disabled="isLoading" />

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button
                      size="icon"
                      variant="ghost"
                      class="text-muted-foreground rounded-full"
                      :class="{ 'text-green-500 border-green-500 hover:text-green-600 hover:border-green-600': a.is_correct }"
                      :disabled="isLoading"
                      @click="toggleIsCorrect(i)"
                    >
                      <Icon :name="a.is_correct ? 'tabler:circle-check-filled' : 'tabler:circle-check' " class="w-5 h-5" :class="{ 'text-green-500': a.is_correct }" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mark as Correct Answer</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger as-child>
                    <Button size="icon" variant="ghost" class="w-14 rounded-full" :disabled="isLoading" @click="removeOption">
                      <Icon name="radix-icons:cross-2" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Button variant="outline" size="sm" class="border-dashed" :disabled="isLoading" @click="addOption">
              <Icon name="radix-icons:plus-circled" class="mr-2 h-4 w-4" />Add Option
            </Button>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="grid gap-2">
          <Label for="reference">Reference</Label>
          <Input id="reference" v-model="questionInput.question.reference" placeholder="eg. AIIMS 2021" :disabled="isLoading" />
        </div>
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
            <PopoverContent class="p-0">
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
          <Label for="security-level">Difficultly</Label>
          <Select v-model="selectedDifficultly" :disabled="isLoading">
            <SelectTrigger id="security-level" class="line-clamp-1 w-full truncate">
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

      <div class="grid">
        <Label for="tags">Tags</Label>
        <div class="flex flex-wrap mt-2">
          <Toggle
            v-for="(t, i) in tags"
            :key="i"
            :disabled="isLoading"
            size="sm"
            :aria-label="`Toggle {t}`"
            class="me-2 w-24"
            :pressed="t.active"
            :class="{
              'border border-solid': t.active,
              'border border-dashed': !t.active,
            }"
            @click="toggleTag(i)"
          >
            {{ t.text }}
          </Toggle>
        </div>
      </div>
    </CardContent>
    <CardFooter class="flex justify-end space-x-2">
      <Button variant="outline" class="lg:w-48" :disabled="isLoading">
        Reset
      </Button>

      <Button variant="default" class="lg:w-48" :disabled="isLoading" @click="previewQuestion">
        Submit
      </Button>

      <!-- <Button class="w-48" :disabled="isLoading" @click="previewQuestion">
        Submit
      </Button> -->
    </CardFooter>
  </Card>

  <transition-fade v-else appear>
    <Alert>
      <AlertTitle>Question Submitted !</AlertTitle>
      <AlertDescription class="mt-2">
        Thank you for your submission. We've received it and will be available shortly in the question bank.
      </AlertDescription>

      <AlertDescription class="flex justify-start mt-8 gap-2">
        <NuxtLink to="/questionbank">
          <Button variant="default" size="default">
            Go to Question Bank
          </Button>
        </NuxtLink>

        <Button variant="outline" size="default" @click="isComplete = false; resetQuestion()">
          Add Another
        </Button>
      </AlertDescription>
    </Alert>
  </transition-fade>

  <QuestionPreview :open="isPreviewOpen" :loading="isLoading" :editable="true" :question="questionInput" @close="isPreviewOpen = false" @submit="submitQuestion" />
  <!-- <ConfirmDialog :open="isDialogOpen" title="Question submitted to Question Bank" @close="isDialogOpen = false" /> -->
</template>
