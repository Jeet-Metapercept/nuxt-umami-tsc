import { serverSupabaseClient } from '#supabase/server'
import { isAuthenticated } from '~/server/api/user/isAuth'
import type { Database } from '~/utils/types/supabase.types'

export default defineEventHandler(async (event) => {
  await isAuthenticated(event)

  const requestBody = await readBody(event)
  const ids = requestBody.ids

  if (!Array.isArray(ids)) {
    console.error('Invalid request format: \'ids\' should be an array.')
    throw createError({ statusCode: 400, statusMessage: 'Bad Request' })
  }

  const client = await serverSupabaseClient<Database>(event)
  const { data, error } = await client
    .from('question_bank')
    .select('id, category, question, answers')
    .in('id', ids)

  if (error) {
    console.error(error)
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' })
  }

  return { data }
})
