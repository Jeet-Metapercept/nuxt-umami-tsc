import OpenAI from 'openai'
import type { GenerateQuestionRequest } from './config'
import { GenerateQuestionSchema, checkPerms, returnUnauthorized, systemPrompt } from './config'
import { serverSupabaseUser } from '#supabase/server'

const AUTH_REQUIRED = false
const runtimeConfig = useRuntimeConfig()
const openai = new OpenAI({
  apiKey: runtimeConfig.OPENAI_API_KEY,
  timeout: 60 * 1000, // 60 seconds (default is 10 minutes)
})

export default defineEventHandler(async (event) => {
  if (AUTH_REQUIRED) {
    const user = await serverSupabaseUser(event)
    if (!checkPerms(user))
      return returnUnauthorized()
  }

  const body: GenerateQuestionRequest = await readBody(event)

  const validationResult = GenerateQuestionSchema.safeParse(body) // Validate request body using Zod
  if (!validationResult.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request',
      data: validationResult.error.issues,
    })
  }
  // eslint-disable-next-line no-console
  console.table(body)
  const system_prompt = systemPrompt({ category: body.category, difficulty: body.difficulty, count: body.count })
  const messages: OpenAI.Chat.ChatCompletionUserMessageParam[] = [{
    role: 'user',
    content: body.message,
  }]

  const params: OpenAI.Chat.ChatCompletionCreateParams = {
    model: 'gpt-3.5-turbo',
    messages: [system_prompt, ...messages],
    max_tokens: 2048,
    temperature: 0.5,
    top_p: 1,
    stream: false,
    response_format: { type: 'text' }, // gpt-4-1106-preview or gpt-3.5-turbo-1106
  }

  const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params)
  // console.log(chatCompletion.choices[0].message.content)

  const ai_questions = chatCompletion.choices[0].message.content

  // JSON senity
  if (ai_questions) {
    const jsonMatch = ai_questions?.match(/json\s*({.*})/s)
    const fixedJsonStr = jsonMatch ? jsonMatch[1] : ai_questions

    const ai_questions_json = JSON.parse(fixedJsonStr)

    return {
      response: ai_questions_json,
    }
  }

  return null
})
