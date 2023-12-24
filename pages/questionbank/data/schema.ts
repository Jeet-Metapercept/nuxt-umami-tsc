import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  label: z.string(),
  priority: z.string(),
})

export type Task = z.infer<typeof taskSchema>

export const answerSchema = z.object({
  text: z.string()
    .min(1, 'Answer must be at least 1 character.')
    .max(100, 'Answer cannot exceed 100 characters.'),
  image_url: z.string().url().nullable().optional(),
  is_correct: z.boolean(),
})

export const questionSchema = z.object({
  question: z.object({
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
  }),
  answers: z
    .array(answerSchema)
    .refine(answers => answers.length >= 2, {
      message: 'At least two options are required.',
    })
    .refine(answers => answers.some(answer => answer.is_correct), {
      message: 'At least one option must be marked as correct.',
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

export type Question = z.infer<typeof questionSchema>
