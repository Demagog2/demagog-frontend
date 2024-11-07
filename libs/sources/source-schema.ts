import { z } from 'zod'
import { emptyStringToUndefined } from '@/libs/schema/empty-string'

const sourceSpeaker = z.object({
  sourceSpeakerId: z.string().optional(),
  speakerId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.string().optional(),
  bodyId: z.string().optional(),
  avatar: z.string().optional(),
})

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
  sourceSpeakers: z.array(sourceSpeaker).optional(),
})
