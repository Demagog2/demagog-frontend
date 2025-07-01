import { z } from 'zod'

const MAX_FILE_SIZE = 4_000_000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
]

export const imageFileSchema = z
  .custom<File>()
  .transform((file) => (file?.size === 0 ? undefined : file))
  .refine(
    (file) => {
      return !file || file.size <= MAX_FILE_SIZE
    },
    {
      message: 'Maximální velikost obrázku jsou 4MB.',
    }
  )
  .refine(
    (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
    'Pouze soubory .jpg, .jpeg, .png, .webp, .gif jsou podporovány.'
  )

export const contentImageSchema = z.object({
  image: imageFileSchema,
})
