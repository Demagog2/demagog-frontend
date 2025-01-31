import { z } from 'zod'

export const schema = z.object({
  title: z.string().min(1, 'Název tagu musí mít alespoň jeden znak.'),
  slug: z.string().min(1, 'Je třeba vyplnit url.'),
  description: z.string().optional(),
  published: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  order: z.string(),
  stats: z.string(),
  icon: z.string(),
})
