import { z } from 'zod'

export const mediaPersonalitySchema = z.object({
  name: z.string().trim().min(1, 'Zadejte jméno moderátora.'),
})
