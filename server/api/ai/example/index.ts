import OpenAI from 'openai'
import { checkPerms, returnUnauthorized } from './util'
import { serverSupabaseUser } from '#supabase/server'

const AUTH_REQUIRED = false
const runtimeConfig = useRuntimeConfig()
const openai = new OpenAI({
  apiKey: runtimeConfig.OPENAI_API_KEY,
  timeout: 30 * 1000, // 30 seconds (default is 10 minutes)
})

function createSystemPrompt(): OpenAI.Chat.ChatCompletionSystemMessageParam {
  return {
    role: 'system',
    content: 'You are a helpful assistant. Only provide answers to questions requested by the user.',
  }
}

export default defineEventHandler(async (event) => {
  if (AUTH_REQUIRED) {
    const user = await serverSupabaseUser(event)
    if (!checkPerms(user))
      return returnUnauthorized()
  }

  const body = await readBody(event)

  const system_prompt = createSystemPrompt()
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
    // response_format: { type: 'json_object' },
  }

  const chatCompletion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create(params)

  return {
    response: chatCompletion.choices[0].message.content,
  }
})
