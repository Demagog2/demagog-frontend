import { z } from 'zod'

export const schema = z.object({
  name: z.string().min(1, 'Nazev stitku musi mit alespon jeden znak.'),
  forStatementType: z.enum(['factual', 'promise', 'newyear']),
})
