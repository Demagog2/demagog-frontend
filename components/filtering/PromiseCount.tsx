import { formatNumber } from '@/libs/format-number'
import { pluralize } from '@/libs/pluralize'

export function PromiseCount({ count }: { count: number }) {
  return (
    <>
      {formatNumber(count)} {pluralize(count, 'slib', 'sliby', 'slibů')}
    </>
  )
}
