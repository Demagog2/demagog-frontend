import { z } from 'zod'

export const statementSchema = z.object({
  content: z.string().trim().min(1, 'Je třeba vyplnit znění výroku.'),
  sourceSpeakerId: z.string().trim().min(1, 'Vyberte řečníka výroku.'),
  evaluatorId: z.string().trim().min(1, 'Vyberte ověřovatele výroku.'),
  sourceId: z.string(),
  statementType: z.string(),
  firstCommentContent: z.string().optional(),
})

export const assessmentSchema = z.object({
  sourceSpeakerId: z.string().trim().min(1, 'Vyberte řečníka výroku.'),
  title: z.string().trim().min(1, 'Zadejte nazev'),
  tags: z.array(z.string()).optional(),
})
