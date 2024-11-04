import { z } from 'zod'

export const mediumSchema = z.object({
  name: z.string(),
})
