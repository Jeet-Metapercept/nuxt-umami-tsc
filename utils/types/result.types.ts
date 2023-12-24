// import { z } from 'zod'

export interface SubmissionAnswer {
  is_selected: boolean
  text: string
}

export interface SubmissionItem {
  question_id: string | number
  submitted_answers: SubmissionAnswer[]
}

export interface ResultQuestion {
  id: number
  question: {
    text: string
    image_url: string | null
    reference: string
    description: string
  }
  answers: {
    text: string
    image_url: string | null
    is_correct: boolean
  }[]
}

export interface ResultRow {
  id?: string
  quiz_id: string
  quiz_name?: string | null
  started_at?: string | null
  ended_at?: string | null
  time_taken?: number | null
  on_background?: number | null
  max_q?: number | null
  attended?: number | null
  unattended?: number | null
  correct?: number | null
  incorrect?: number | null
  percentage?: number | null
  result_link?: string | null
  submission?: SubmissionItem[] | null
  user_email?: string | null
}
