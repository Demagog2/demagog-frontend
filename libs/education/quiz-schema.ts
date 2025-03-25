import { z } from 'zod'

const quizAnswerSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Odpověď musí obsahovat alespoň jeden znak.'),
  isCorrect: z.preprocess((value) => value === 'on', z.boolean()),
})

export const quizSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Název musí obsahovat alespoň jeden znak.'),
  description: z.string().min(1, 'Popis musí obsahovat alespoň jeden znak.'),
  quizAnswers: z.array(quizAnswerSchema),
})
