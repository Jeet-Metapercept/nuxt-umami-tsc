import { z } from 'zod'

export interface CategoryRow {
  created_by: string
  name: string
}

export const categorySchema = z.object({
  created_by: z.string().email(),
  name: z.string().min(1, 'Category name must not be empty'),
})
