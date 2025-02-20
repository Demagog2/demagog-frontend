import { z } from 'zod'

export const schema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Název sekce musí obsahovat alespoň jeden znak.'),
  order: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().optional()
  ),
  published: z.preprocess((value) => value === 'on', z.boolean()).optional(),
})
