import { defineStore } from 'pinia'
import type { QuizQuestion, State, UserAnswer } from './types'
import { useToast } from '@/components/ui/toast/use-toast'
import type { Database } from '~/utils/types/supabase.types'
import type { ResultQuestion, ResultRow, SubmissionItem } from '~/utils/types/result.types'
import { type QuizViewState, getScore } from '~/pages/quiz/helper'
import type { QuizRow } from '~/utils/types/quiz.types'

const { toast } = useToast()

export const useQuizStore = defineStore('quizStore', {
  state: (): State => ({
    status: 'pre',
    quiz: null,
    questions: [],
    current_question: { question: null, index: 0 },
    marked_as_later: [],
    meta: {
      started_at: undefined,
      ended_at: undefined,
      leave_count: 0,
    },
    result: null,
  }),
  getters: {
    GET_QUIZ: state => state.quiz,
    GET_QUIZ_STATUS: state => state.status,
    GET_QUESTIONS: state => state.questions,
    GET_RESULT: state => state.result,
    GET_CURRENT_QUESTION: state => (questionIndex: number) => {
      return questionIndex >= 0 && questionIndex < state.questions.length
        ? state.questions[questionIndex]
        : null
    },
    GET_MARKED_AS_LATER: state => state.marked_as_later,
    GET_ATTENDED_QUESTIONS: state =>
      state.questions.filter(question =>
        question.submitted_answers?.some(answer => answer.is_selected),
      ).length,
    GET_UNATTENDED_QUESTIONS: state =>
      state.questions.filter(question =>
        !question.submitted_answers?.some(answer => answer.is_selected),
      ).length,
    GET_QUIZ_META: state => state.meta,
  },
  actions: {
    async SET_QUIZ(quiz: QuizRow) {
      this.quiz = quiz
    },
    async SET_QUIZ_STATUS(status: QuizViewState) {
      this.status = status
    },
    async SET_QUESTIONS(questions: QuizQuestion[]) {
      this.questions = questions
    },
    async TOGGLE_MARKED_AS_LATER(index: number) {
      this.marked_as_later.includes(index) ? this.marked_as_later.splice(this.marked_as_later.indexOf(index), 1) : this.marked_as_later.push(index)
    },
    async SET_CURRENT_QUESTIONS({ index, question }: { index: number; question: QuizQuestion }) {
      this.current_question.index = index
      this.current_question.question = question
    },
    async SET_QUESTION_ANSWERS({ index, answers }: { index: number; answers: UserAnswer[] }) {
      if (index >= 0 && index < this.questions.length)
        this.questions[index].submitted_answers = answers
    },
    async SET_QUIZ_META({ start, end, leavecount }: { start?: Date; end?: Date; leavecount?: boolean }) {
      if (start)
        this.meta.started_at = start

      if (end)
        this.meta.ended_at = end

      if (leavecount)
        ++this.meta.leave_count
    },
    async FETCH_QUIZZE({ quizId }: { quizId: string }) {
      const client = useSupabaseClient<Database>()

      if (!quizId) {
        toast({
          title: 'Error',
          description: 'Invalid Quiz ID',
          variant: 'destructive',
          duration: 4000,
        })
        return null
      }

      const { data, error } = await client
        .from('quiz_bank')
        .select('*')
        .eq('id', quizId)
        .single()

      if (error) {
        console.error(error.message)
        // toast({
        //   description: error.message,
        //   variant: 'destructive',
        //   duration: 4000,
        // })
        return null
      }

      return data
    },
    async FETCH_QUIZZE_QUESTIONS({ ids }: { ids: string[] }) {
      const client = useSupabaseClient<Database>()
      const { data, error } = await client
        .from('question_bank')
        .select('id, category, question, view_only_answers')
        .in('id', ids)

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        throw error
      }

      return data
    },
    async FETCH_RESULT({ resultId }: { resultId: string }) {
      const client = useSupabaseClient<Database>()

      if (!resultId) {
        toast({
          title: 'Error',
          description: 'not found',
          variant: 'destructive',
          duration: 4000,
        })
        return null
      }

      const { data, error } = await client
        .from('results_bank')
        .select('*')
        .eq('id', resultId)
        .single()

      if (error) {
        console.error(error.message)
        return null
      }

      return data
    },
    async COMPILE_RESULT({ resultRow }: { resultRow: Omit<ResultRow, 'id'> }) {
      const client = useSupabaseClient<Database>()
      const submission = JSON.parse(JSON.stringify(resultRow.submission)) || []
      const questionIds = submission.map((q: SubmissionItem) => q.question_id)

      const { data, error } = await client
        .from('question_bank')
        .select('id, question, answers')
        .in('id', questionIds)

      if (error) {
        toast({
          description: error.message,
          variant: 'destructive',
          duration: 4000,
        })
        return false
      }

      const score = getScore({
        questions: data as ResultQuestion[],
        answers: submission,
      })

      await delay(2000)

      const { data: submissionData, error: submissionError } = await client
        .from('results_bank')
        .insert([{
          ...resultRow,
          correct: score?.correct,
          incorrect: score?.incorrect,
          percentage: score?.correctPercentage,
          submission,
        }])
        .select()

      if (submissionError) {
        toast({
          description: submissionError.message,
          variant: 'destructive',
          duration: 4000,
        })
        return false
      }

      return submissionData
    },
    async SUBMIT_RESULT({ submit_as }: { submit_as?: string }) {
      const quiz = this.GET_QUIZ
      const attended = this.GET_ATTENDED_QUESTIONS
      const unattended = this.GET_UNATTENDED_QUESTIONS
      const meta = this.GET_QUIZ_META
      const endDate = meta.ended_at ? new Date(meta.ended_at.toString()) : null
      const startDate = meta.started_at ? new Date(meta.started_at.toString()) : null
      const time = endDate && startDate
        ? (endDate.getTime() - startDate.getTime()) / 60000
        : 0

      const submission: SubmissionItem[] = this.GET_QUESTIONS.map(item => ({
        question_id: item.id,
        submitted_answers: (item.submitted_answers ?? []).map(answer => ({
          is_selected: answer.is_selected ?? false,
          text: answer.text,
        })),
      }))

      const resultRow: ResultRow = {
        quiz_id: quiz?.id || '',
        quiz_name: quiz?.name,
        started_at: meta.started_at ? new Date(meta.started_at).toISOString() : null,
        ended_at: meta.ended_at ? new Date(meta.ended_at).toISOString() : null,
        time_taken: Number(time.toFixed(2)),
        on_background: meta.leave_count,
        max_q: quiz?.size,
        attended,
        unattended,
        submission: submission || [],
      }

      if (submit_as)
        resultRow.user_email = submit_as

      // uploading resulsts
      const score = await this.COMPILE_RESULT({ resultRow }) as ResultRow[]
      this.result = score[0]
      await delay(1000)
      this.status = 'complete'
    },
  },
  // persist: {
  //   storage: persistedState.localStorage,
  // },
})
