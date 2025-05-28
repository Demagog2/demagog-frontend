import { z } from 'zod'
import { imageFileSchema } from '../images/schema'

export const workshopSchema = z.object({
  name: z.string().min(1, 'Název workshopu musí mít alespoň jeden znak.'),
  description: z
    .string()
    .min(1, 'Popis workshopu musí mít alespoň jeden znak.'),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().min(1, 'Cena musí být alespoň 1.')
  ),
  image: z.union([z.string(), imageFileSchema]).optional(),
})
