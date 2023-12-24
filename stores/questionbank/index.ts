import { defineStore } from 'pinia'
import type { State } from './types'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Database } from '~/utils/types/supabase.types'
import type { QuestionRow } from '~/utils/types/types'

const { toast } = useToast()

export const useQuestionStore = defineStore('questionStore', {
  state: (): State => ({
    question: '',
    categories: ['Random', 'General'],
  }),
  getters: {
    GET_CATEGORIES: state => state.categories,
  },
  actions: {
    async FETCH_QUESTIONS({ limit }: { limit?: number }) {
      const client = useSupabaseClient<Database>()

      const { data, error } = await client
        .from('question_bank')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit || 10)

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        return error
      }

      return data
    },
    async FETCH_CATEGORIES() {
      const client = useSupabaseClient<Database>()
      const { data, error } = await client
        .from('category')
        .select('name')

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        return error
      }

      const response = data.map(d => d.name) as string[]
      this.categories.push(...response)

      return response
    },
    async FETCH_QUESTIONS_BY_ID({ id, limit }: { id: string[]; limit?: number }) {
      const client = useSupabaseClient<Database>()
      const { data, error } = await client
        .from('question_bank')
        .select('*')
        .in('id', id)
        .limit(limit || 10)

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        return error
      }

      return data
    },
    async CREATE_QUESTION({ questionRow }: { questionRow: Omit<QuestionRow, 'id'> }) {
      const client = useSupabaseClient<Database>()

      const { data: existingQuestions } = await client
        .from('question_bank')
        .select('*')
        .eq('question->>text', questionRow.question.text)

      if (existingQuestions && existingQuestions.length > 0) {
        toast({
          title: 'Question already exists',
          description: questionRow.question.text,
          variant: 'destructive',
          duration: 4000,
        })
        return false
      }

      const { error } = await client
        .from('question_bank')
        .insert([questionRow])

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        return false
      }

      return true
    },
    async CREATE_BULK_QUESTIONS({ questions }: { questions: Omit<QuestionRow, 'id'>[] }) {
      const client = useSupabaseClient<Database>()

      const questionTexts = questions.map(q => q.question.text)
      const { data: existingQuestions } = await client
        .from('question_bank')
        .select('question->>text')
        .in('question->>text', questionTexts)

      if (existingQuestions && existingQuestions.length > 0) {
        const existingQuestionTexts = existingQuestions.map(q => q.text)
        toast({ title: 'Question Already exists.', description: `${existingQuestionTexts.join(', ')}`, variant: 'destructive', duration: 4000 })
        return false
      }

      // create
      const { data, error } = await client
        .from('question_bank')
        .insert([...questions])
        .select()

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        return false
      }

      return data
    },
    async FETCH_RANDOM_QUESTIONS({ limit, category, difficulty }: {
      limit?: number
      category?: string
      difficulty?: number
    }) {
      const client = useSupabaseClient<Database>()

      const { data, error } = await client
        .rpc('get_random_questions', {
          p_count: limit || 10,
          p_category: category,
          p_difficulty: difficulty,
        })

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        return error
      }

      return data as unknown as QuestionRow[]
    },
  },
})
