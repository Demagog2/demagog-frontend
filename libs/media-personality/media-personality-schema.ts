import { z } from 'zod'

export const mediaPersonalitySchema = z.object({
  name: z.string(),
})
