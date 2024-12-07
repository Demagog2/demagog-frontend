import { z } from 'zod'

export const statementSchema = z.object({
  content: z.string().trim().min(1, 'Je třeba vyplnit znění výroku.'),
  sourceSpeakerId: z.string().trim().min(1, 'Vyberte řečníka výroku.'),
  evaluatorId: z.string().trim().min(1, 'Vyberte ověřovatele výroku.'),
  sourceId: z.string(),
  statementType: z.string(),
  firstCommentContent: z.string().optional(),
})

export const assessmentSchema = z
  .object({
    statementType: z.string(),
    sourceSpeakerId: z.string().trim().min(1, 'Vyberte řečníka výroku.'),
    title: z.string().optional(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
    promiseRatingId: z.string().optional(),
    veracityId: z.string().optional(),
    shortExplanation: z.string().optional(),
    explanation: z.string().optional(),
  })
  .refine((data) => data.statementType !== 'promise' || data.title?.length, {
    message: 'Zadejte název.',
    path: ['title'],
  })
