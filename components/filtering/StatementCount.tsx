import { formatNumber } from '@/libs/format-number'
import { pluralize } from '@/libs/pluralize'

export function StatementCount({ count }: { count: number }) {
  return (
    <>
      {formatNumber(count)} {pluralize(count, 'výrok', 'výroky', 'výroků')}
    </>
  )
}
