import { z } from 'zod'

const MAX_FILE_SIZE = 4_000_000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const imageFileSchema = z
  .custom<File>()
  .transform((file) => (file?.size === 0 ? undefined : file))
  .refine(
    (file) => {
      console.debug(file)
      console.debug(file?.size)
      return !file || file.size <= MAX_FILE_SIZE
    },
    {
      message: 'Maximalni velikost obrazku jsou 4MB.',
    }
  )
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Pouze soubory.jpg, .jpeg, .png, .webp jsou podporovany.'
  )

export const contentImageSchema = z.object({
  image: imageFileSchema,
})
