import { serverSupabaseUser } from '#supabase/server'

export async function isAuthenticated(event: any): Promise<boolean> {
  const isAuthenticated = await serverSupabaseUser(event)

  if (!isAuthenticated) {
    throw createError({
      statusCode: 403,
      statusMessage:
        'Access Denied: You do not have permission to access this resource.',
    })
  }
  return !!isAuthenticated
}
