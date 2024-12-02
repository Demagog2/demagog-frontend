import { z } from 'zod'

export const statementSchema = z.object({
  content: z.string().trim().min(1, 'Je třeba vyplnit znění výroku.'),
  sourceSpeakerId: z.string().trim().min(1, 'Vyberte řečníka výroku.'),
  sourceId: z.string(),
  statementType: z.string(),
  evaluatorId: z.string().optional(),
  firstCommentContent: z.string().optional(),
})
