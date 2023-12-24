import type { User } from '@supabase/supabase-js'
import type OpenAI from 'openai'

export interface GenerateQuestionParams {
  category: string
  count: number
  difficulty: number
}

import { z } from 'zod'

export const GenerateQuestionSchema = z.object({
  category: z.string(),
  count: z.number().min(1).max(10),
  difficulty: z.number().min(1).max(10),
  message: z.string().max(100),
})

export type GenerateQuestionRequest = z.infer<typeof GenerateQuestionSchema>

const ai_question_format_string = 'Quiz questions including \'text\' (5-250 chars), optional \'description\' (up to 700 chars), \'answers\' array (4 items, each with \'text\' 1-100 chars and a boolean \'is_correct\'), optional \'category\', \'difficulty\' (1-10), and an optional \'tags\' array (up to 2 items, default \'AI\')'
const ai_example_questions_response_format = JSON.stringify([{
  question: {
    text: '<question text>',
    reference: '<question reference>',
    description: '<question description>',
  },
  answers: [
    {
      text: '<answer text>',
      is_correct: true || false,
    },
    {
      text: '<answer text>',
      is_correct: true || false,
    },
    {
      text: '<answer text>',
      is_correct: true || false,
    },
    {
      text: '<answer text>',
      is_correct: true || false,
    },
  ],
  category: '<question category>',
  tags: ['AI'],
  difficulty: '<difficulty level on a scale from 1 to 10, where 1 is easiest and 10 is hardest>',
}], null, 2)

export function systemPrompt({ category, count, difficulty }: GenerateQuestionParams): OpenAI.Chat.ChatCompletionSystemMessageParam {
  return {
    role: 'system',
    content: `You are an assistant tasked with creating a set of '${count}' unique quiz questions in the category of '${category}', with each question having a difficulty level of ${difficulty}.
        - Format these questions as JSON objects, adhering to the structure: ${ai_question_format_string}, example response format: ${ai_example_questions_response_format}.
        - The output should be an array of these questions, precisely matching the count of '${count}', and consistent with the given example structure.
        - Each question should include fields like text, reference, description, and be given an appropriate difficulty rating.
        - Accompany each question with multiple-choice answers (4), specifying one correct answer (randomly positioned) and the rest as incorrect options.
        - Ensure that the JSON output is an array of questions, each tailored to the specified category and difficulty level, and consistent with the given structure.
        - Please provide the following information in a plain JSON format without any Markdown or code block formatting
      `,
  }
}

export function returnUnauthorized() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        message: getRandomReturnMessage(),
      })
    }, 1000) // Delay for authenticity and to prevent spam
  })
}

function getRandomReturnMessage() {
  const messages = [
    'Hey, looks like you\'ve stumbled upon a premium feature! Upgrade now to unlock it and get the most out of our platform.',
    'This feature is exclusive to our premium members. Upgrade your account now to get access and enjoy all the benefits of our premium membership.',
    'Sorry, this feature is only available to our premium members. Upgrade now to enjoy exclusive perks and access to our best features.',
    'Hey there! This feature is one of the many benefits of our premium membership. Upgrade now to unlock it and start enjoying our premium features.',
    'This feature is part of our premium membership package. Upgrade now to unlock it and get access to our premium features.',
    'Sorry, you need to be a premium member to access this feature. Upgrade now to enjoy all the perks of our premium membership.',
    'Hey, it looks like you\'re missing out on a premium feature! Upgrade now to get access and start enjoying all our premium features.',
    'This feature is reserved for our premium members. Upgrade now to unlock it and get access to all our premium features and perks.',
    'Sorry, this feature is only available to our premium members. Upgrade now to get access and start enjoying all the benefits of our premium membership.',
    'Hey there! This feature is one of the many benefits of our premium membership. Upgrade now to unlock it and start enjoying our premium features.',
    'This feature is part of our premium membership package. Upgrade now to unlock it and get access to our premium features.',
    'Sorry, you need to be a premium member to access this feature. Upgrade now to enjoy all the perks of our premium membership.',
    'Hey, it looks like you\'re missing out on a premium feature! Upgrade now to get access and start enjoying all our premium features.',
  ]
  return messages[Math.floor(Math.random() * messages.length)]
}

export function checkPerms(user: User | null) {
  if (!user)
    return false
  // Do some other check here, checking a custom user field, etc.
  return true
}
