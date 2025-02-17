import { z } from 'zod'

const membershipSchema = z.object({
  id: z.string().optional(),
  since: z.string().optional(),
  until: z.string().optional(),
  bodyId: z.string(),
  bodyName: z.string().optional(),
})

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
  memberships: z.array(membershipSchema).optional(),
  osobaId: z.string().trim().optional(),
})

/* TODO: avatar */
