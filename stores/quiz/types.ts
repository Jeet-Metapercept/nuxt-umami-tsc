import type { QuizViewState } from '~/pages/quiz/helper'
import type { QuizRow } from '~/utils/types/quiz.types'
import type { ResultRow } from '~/utils/types/result.types'

export interface QuizQuestionType {
  text: string
  image_url: string | null
  reference: string
  description: string
}

interface QuizAnswer {
  text: string
  image_url?: string | null
}

export interface UserAnswer {
  text: string
  image_url?: string | null
  is_selected?: boolean
}

export interface QuizQuestion {
  id: number
  category: string
  question: QuizQuestionType
  view_only_answers: QuizAnswer[]
  submitted_answers?: UserAnswer[]
}

interface quizmeta {
  started_at?: Date | string
  ended_at?: Date | string
  leave_count: number
}

export interface State {
  status: QuizViewState
  quiz: QuizRow | null
  questions: QuizQuestion[]
  current_question: { question: QuizQuestion | null; index: number }
  marked_as_later: number[]
  meta: quizmeta
  result: ResultRow | null
}
