import { z } from 'zod'

const VIDEO_TYPES = ['youtube', 'audio', 'facebook'] as const

export const sourceVideoSchema = z.object({
  video_type: z.enum(VIDEO_TYPES),
  video_id: z.string().min(1, 'Video ID je povinné'),
})

export type SourceVideoFormData = z.infer<typeof sourceVideoSchema>

export function isValidVideoType(
  value: unknown
): value is SourceVideoFormData['video_type'] {
  return typeof value === 'string' && VIDEO_TYPES.includes(value as any)
}
