import { z } from 'zod'

export const speakerSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Jméno musí obsahovat alespoň jeden znak.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Příjmení musí obsahovat alespoň jeden znak.'),
  role: z.string().trim().optional(),
  wikidataId: z.string().trim().optional(),
  websiteUrl: z.string().trim().optional(),
})

{
  /*
  TODO
  osobaId - do we still need osobaId? 
  memberships / body / name - how?
  avatar 
  */
}
