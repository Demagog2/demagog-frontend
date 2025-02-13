import { z } from 'zod'

export const workshopSchema = z.object({
  name: z.string().min(1, 'Název workshopu musí mít alespoň jeden znak.'),
  description: z
    .string()
    .min(1, 'Popis workshopu musí mít alespoň jeden znak.'),
  price: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val), // Převod na číslo
    z.number().min(0, 'Cena musí být alespoň 0.') // Validace, že je číslo a větší než 0
  ),
})
