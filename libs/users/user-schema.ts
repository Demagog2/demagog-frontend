import { z } from 'zod'
import { imageFileSchema } from '../images/schema'

export const userSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, 'Jméno musí obsahovat alespoň jeden znak.'),
  lastName: z
    .string()
    .trim()
    .min(1, 'Příjmení musí obsahovat alespoň jeden znak.'),
  email: z.string().email(),
  roleId: z.string({ required_error: 'Vyberte oprávnění uživatele.' }),
  emailNotifications: z
    .preprocess((value) => value === 'on', z.boolean())
    .optional(),
  userPublic: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  bio: z.string().optional(),
  positionDescription: z.string().optional(),
  avatar: z.union([z.string(), imageFileSchema]).optional(),
  deleteAvatar: z
    .preprocess((value) => value === 'true', z.boolean())
    .optional(),
})
