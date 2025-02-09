import { z } from 'zod'

export const schema = z.object({
  title: z.string().min(1, 'Název tagu musí mít alespoň jeden znak.'),
  slug: z
    .string()
    .trim()
    .min(1, 'Zadejte url tagu.')
    .transform((val) => val.replace(/\s+/g, '-')),
  description: z.string().optional(),
  published: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  order: z.string().optional(),
  stats: z.string().optional(),
  icon: z.string().optional(),
})
