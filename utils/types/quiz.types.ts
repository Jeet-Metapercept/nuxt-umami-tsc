import { z } from 'zod'

export interface QuizRow {
  id?: string
  name: string
  description?: string
  image_url?: string
  category?: string
  size?: number
  max_time?: number
  randomize?: boolean
  difficulty?: number
  views?: number
  author?: string
  published?: boolean
  direct_link?: string
  show_results?: boolean

  questions?: string[]
}

export const quizSchema = z.object({
  name: z.string()
    .min(5, 'Name must be at least 5 character long')
    .max(250, 'Name cannot exceed 250 characters'),
  description: z.string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional(),
  image_url: z.string().url().nullable().optional(),

  category: z.string().optional(),

  size: z.number().min(1, 'Size must be at least 1'),
  max_time: z.number()
    .refine(val => val === 0 || val >= 10, {
      message: 'Max time must be 0 or at least 10 minutes',
    }),
  randomize: z.boolean(),
  difficulty: z.number().min(1).max(10),
  views: z.number(),
  author: z.string().email().optional(),
  published: z.boolean(),

  direct_link: z.string().url().optional(),

  show_results: z.boolean(),

  questions: z.array(z.number()).optional(),

})

// Use the schema to validate data
// Example: const validatedQuizRow = quizRowSchema.parse(someQuizRowData);
