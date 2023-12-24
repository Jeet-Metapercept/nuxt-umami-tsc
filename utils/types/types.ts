import { z } from 'zod'

export interface Answer {
  text: string
  image_url?: string | null
  is_correct: boolean
}

export interface QuestionRow {
  id?: string
  question: {
    text: string
    description: string
    image_url?: string | null
    reference: string
  }
  answers: {
    text: string
    image_url?: string | null
    is_correct: boolean
  }[]
  view_only_answers: {
    text: string
    image_url?: string | null
  }[]
  author: string
  category: string
  difficulty: number
  tags: string[]
  views?: number
  published?: boolean
}

const questionSchema = z.object({
  text: z.string()
    .min(5, 'Question must be at least 5 characters.')
    .max(250, 'Question cannot exceed 250 characters.'),
  description: z.string()
    .max(700, 'Question description cannot exceed 700 characters.')
    .optional(),
  image_url: z.string().url().nullable().optional(),
  reference: z.string()
    .max(100, 'Reference cannot exceed 100 characters.')
    .optional(),
})

const answerSchema = z.object({
  text: z.string()
    .min(1, 'Answer must be at least 1 characters.')
    .max(100, 'Answer cannot exceed 100 characters.'), // Add min and max validation here
  image_url: z.string().url().nullable().optional(),
  is_correct: z.boolean(),
})

export const questionRowSchema = z.object({
  question: questionSchema,
  answers: z
    .array(answerSchema)
    .refine(answers => answers.length >= 2, {
      message: 'At least two options are required.',
    })
    .refine(answers => answers.some(answer => answer.is_correct), {
      message: 'At least one options must be marked as correct.',
    })
    .refine((answers) => {
      const uniqueTexts = new Set()
      for (const answer of answers) {
        if (uniqueTexts.has(answer.text))
          return false

        uniqueTexts.add(answer.text)
      }
      return true
    }, {
      message: 'Options cannot have duplicates.',
    }),
  author: z.string().email().optional(),
  category: z.string().optional(),
  difficulty: z.number().min(1).max(10),
  tags: z.array(z.string()),
  views: z.number(),
  published: z.boolean(),
})
