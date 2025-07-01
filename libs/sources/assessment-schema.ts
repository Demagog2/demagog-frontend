import { z } from 'zod'
import { ASSESSMENT_STATUS_BEING_EVALUATED } from '../constants/assessment'

export const assessmentSchema = z
  .object({
    statementType: z.string(),
    evaluationStatus: z.string(),
    sourceSpeakerId: z.string().trim().min(1, 'Vyberte řečníka výroku.'),
    title: z.string().optional(),
    content: z.string(),
    tags: z.array(z.string()).optional(),
    articleTags: z.array(z.string()).optional(),
    promiseRatingId: z.string().optional(),
    veracityId: z.string().optional(),
    shortExplanation: z.string().optional(),
    explanation: z.string().optional(),
    evaluatorId: z.string().optional(),
    published: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  })
  .refine(
    (data) =>
      data.evaluationStatus !== ASSESSMENT_STATUS_BEING_EVALUATED ||
      data.statementType !== 'promise' ||
      data.title?.length,
    {
      message: 'Zadejte název.',
      path: ['title'],
    }
  )
