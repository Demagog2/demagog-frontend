import { z } from 'zod'

export const sourceSchema = z.object({
  name: z.string().trim().min(1, 'Název musí obsahovat alespoň jeden znak.'),
  sourceUrl: z.string().url('URL zdroje není ve správném formátu.').optional(),
  transcript: z.string().optional(),
})
