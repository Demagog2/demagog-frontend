import { z } from 'zod'

export const articleIllustrationSchema = z.object({
  url: z.string().url(),
  includeAttachment: z
    .preprocess((value) => value === 'on', z.boolean())
    .optional(),
})
