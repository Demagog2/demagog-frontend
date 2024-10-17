import { z } from 'zod'
import { emptyStringToUndefined } from '@/libs/schema/empty-string'

export const sourceSchema = z.object({
  name: z.string().trim().min(1, 'Název musí obsahovat alespoň jeden znak.'),
  experts: z.array(z.string()).optional(),
  sourceUrl: z
    .string()
    .url('URL zdroje není ve správném formátu.')
    .optional()
    .or(emptyStringToUndefined),
  transcript: z.string().optional().or(emptyStringToUndefined),
  mediumId: z.string().optional(),
  mediaPersonalities: z.array(z.string()).optional(),
  releasedAt: z.string().date().optional(),
})
