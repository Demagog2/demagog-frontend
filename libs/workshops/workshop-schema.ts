import { z } from 'zod'

export const workshopSchema = z.object({
  name: z.string().min(1, 'Název workshopu musí mít alespoň jeden znak.'),
  description: z
    .string()
    .min(1, 'Popis workshopu musí mít alespoň jeden znak.'),
  price: z.number(),
})
