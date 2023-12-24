import type { Database } from '~/utils/types/supabase.types'
import { useToast } from '@/components/ui/toast/use-toast'

import type { CategoryRow } from '~/utils/types/category.types'

const { toast } = useToast()
const duration = 4000

export default function useCategory() {
  const client = useSupabaseClient<Database>()

  const getCategories = async () => {
    const { data, error } = await client
      .from('category')
      .select('name')

    if (error) {
      toast({
        description: error.message,
        variant: 'destructive',
        duration,
      })
      return error
    }

    return data.map(c => c.name)
  }

  const createCategory = async (categoryRow: CategoryRow) => {
    const { data: c } = await client
      .from('categories')
      .select('*')
      .eq('name', categoryRow.name)

    if (c && c?.length > 0) {
      toast({
        title: 'Category already exists',
        description: categoryRow.name,
        variant: 'destructive',
        duration,
      })
      return false
    }

    const { error } = await client
      .from('categories')
      .insert([categoryRow])

    if (error) {
      toast({
        description: error.message,
        variant: 'destructive',
        duration,
      })
      return false
    }

    return true
  }

  return {
    getCategories,
    createCategory,
  }
}
