import { defineStore } from 'pinia'
import type { State } from './types'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Database } from '~/utils/types/supabase.types'
import type { QuizRow } from '~/utils/types/quiz.types'

const { toast } = useToast()

export const useQuizBankStore = defineStore('quizBankStore', {
  state: (): State => ({
    quiz: '',
  }),
  getters: { },
  actions: {
    async FETCH_QUIZZES({ limit }: { limit?: number }) {
      const client = useSupabaseClient<Database>()

      const { data, error } = await client
        .from('quiz_bank')
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
    async NEW_QUIZ(quizData: QuizRow) {
      const client = useSupabaseClient<Database>()
      const { data, error } = await client
        .from('quiz_bank')
        .insert([quizData])
        .select()

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
    async UPDATE_QUIZ({ quizId, quizData }: { quizId?: string; quizData: QuizRow }) {
      const client = useSupabaseClient<Database>()

      if (!quizId) {
        toast({
          description: 'Quiz ID is required for update.',
          variant: 'destructive',
          duration: 4000,
        })
        return
      }

      const { data, error } = await client
        .from('quiz_bank')
        .update({ direct_link: quizData.direct_link })
        .eq('id', quizId)
        .select()

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
  },
})
