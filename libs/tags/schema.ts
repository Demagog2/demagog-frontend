import { z } from 'zod'
import { StatementType } from '@/__generated__/graphql'

export const schema = z.object({
  name: z.string().min(1, 'Nazev stitku musi mit alespon jeden znak.'),
  forStatementType: z.enum(['factual', 'promise', 'newyears']),
})

export function toStatementType(
  statementType: 'newyears' | 'factual' | 'promise'
): StatementType {
  switch (statementType) {
    case 'newyears':
      return StatementType.Newyears
    case 'factual':
      return StatementType.Factual
    case 'promise':
      return StatementType.Promise
  }
}
