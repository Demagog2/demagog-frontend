import { z } from 'zod'

export const statementSchema = z.object({
  content: z.string().trim().min(1, 'Je třeba vyplnit znění výroku.'),
  sourceSpeakerId: z.string().trim().min(1, 'Vyberte řečníka výroku.'),
  evaluatorId: z.string().optional(),
  sourceId: z.string(),
  statementType: z.string(),
  firstCommentContent: z.string().optional(),
})
