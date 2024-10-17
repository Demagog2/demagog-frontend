import { z } from 'zod'
import { emptyStringToUndefined } from '@/libs/schema/empty-string'

export const sourceSchema = z.object({
  name: z.string().trim().min(1, 'Název musí obsahovat alespoň jeden znak.'),
  sourceUrl: z
    .string()
    .url('URL zdroje není ve správném formátu.')
    .optional()
    .or(emptyStringToUndefined),
  transcript: z.string().optional().or(emptyStringToUndefined),
  mediumId: z.string().optional(),
  publishedAt: z.string().date().optional(),
})
