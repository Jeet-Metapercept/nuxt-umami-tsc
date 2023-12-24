<script setup lang="ts">
import type { QuestionRow } from '@/utils/types/types'
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/toast/use-toast'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface Props {
  questions?: QuestionRow[]
  selectable?: boolean
  loading?: boolean
  max?: number
}
const props = withDefaults(defineProps<Props>(), {
  questions: () => [],
  selectable: false,
  loading: false,
})
const emit = defineEmits(['onSelection'])
const { toast } = useToast()

const selected_questions = ref<QuestionRow[]>([])
function handleChange(question: QuestionRow, checked: boolean) {
  if (checked) {
    if (props.max && selected_questions.value.length === props.max) {
      toast({
        description: `Maximum limit of ${props.max} question reached.`,
        variant: 'destructive',
        duration: 4000,
      })
      return
    }
    selected_questions.value.push(question)
  }

  else { selected_questions.value = selected_questions.value.filter(q => q !== question) }

  emit('onSelection', selected_questions.value)
}
</script>

<template>
  <div>
    <div v-if="!loading" class="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-if="props.selectable" />
            <TableHead>
              Question
            </TableHead>
            <TableHead class="text-right">
              Category
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(question, i) in props.questions" :key="i">
            <TableCell v-if="props.selectable" class="font-medium pl-2">
              <Checkbox
                :id="`question-list-${i}`" :checked="selected_questions.includes(question)"
                @update:checked="checked => handleChange(question, checked)"
              />
            </TableCell>
            <TableCell class="font-medium">
              <label :for="`question-list-${i}`" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{{ question.question.text }}</label>
            </TableCell>
            <TableCell class="text-right">
              <Badge variant="secondary">
                {{ question.category }}
              </Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div v-else class="h-[50px] flex items-center mt-4 ">
      <Icon
        name="svg-spinners:180-ring"
        class="mr-2 h-4 w-4"
      />
      <p class="text-sm">
        loading...
      </p>
    </div>
  </div>
</template>
