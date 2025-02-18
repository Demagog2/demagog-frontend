import { z } from 'zod'

export const schema = z.object({
  name: z.string().trim().min(1, 'Název musí obsahovat alespoň 1 znak.'),
  shortName: z.string().optional(),
  isParty: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  link: z.string().trim().optional(),
  foundedAt: z.string().optional(),
  isInactive: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  terminatedAt: z.string().optional(),
})

{
  /* --TODO-- add logo img */
}
