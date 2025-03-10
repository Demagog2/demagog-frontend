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

const timeStringToSeconds = (time: string | number): number => {
  if (typeof time === 'number') return time

  // If the string is a plain number, parse it directly
  if (!time.includes(':')) {
    return parseInt(time, 10)
  }

  const [hours = '0', minutes = '0', seconds = '0'] = time.split(':')
  return (
    parseInt(hours, 10) * 3600 +
    parseInt(minutes, 10) * 60 +
    parseInt(seconds, 10)
  )
}

export const statementVideoMarksSchema = z.object({
  marks: z.array(
    z.object({
      statementId: z.string(),
      start: z.union([z.number(), z.string()]).transform(timeStringToSeconds),
      stop: z.union([z.number(), z.string()]).transform(timeStringToSeconds),
    })
  ),
})

export type StatementVideoMarkFormData = z.infer<
  typeof statementVideoMarksSchema
>
