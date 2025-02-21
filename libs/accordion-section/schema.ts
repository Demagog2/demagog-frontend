import { z } from 'zod'

export const accordionSectionSchema = z.object({
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

export const accordionItemSchema = z.object({
  title: z.string().trim().min(1, 'Název musí obsahovat alespoň jeden znak.'),
  order: z.preprocess(
    (val) => (typeof val === 'string' ? parseFloat(val) : val),
    z.number().optional()
  ),
  published: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  content: z.string().trim().optional(),
  memberListing: z
    .preprocess((value) => value === 'on', z.boolean())
    .optional(),
  accordionSectionId: z.string(),
})
