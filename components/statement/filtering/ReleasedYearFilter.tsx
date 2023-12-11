import { pluralize } from '@/libs/pluralize'
import classNames from 'classnames'
import gql from 'graphql-tag'

export type ReleasedYearAggregation = {
  year: number
  count: number
}

export const ReleasedYearFilterFragment = gql`
  fragment ReleasedYearFilter on YearAggregate {
    year
    count
  }
`

type Props = ReleasedYearAggregation & {
  isSelected: boolean
}

export function ReleasedYearFilter({ year, count, isSelected }: Props) {
  return (
    <div className={classNames('check-btn', 'py-2', { disabled: count === 0 })}>
      <input
        type="checkbox"
        disabled={count === 0}
        name="years"
        value={year}
        defaultChecked={isSelected}
      />
      <span className="checkmark"></span>
      <span className="small fw-600 me-2">{year}</span>
      <span className="smallest min-w-40px">
        {count} {pluralize(count, 'výrok', 'výroky', 'výroků')}
      </span>
    </div>
  )
}
