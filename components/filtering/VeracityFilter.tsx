import classNames from 'classnames'
import gql from 'graphql-tag'
import { StatementCount } from './StatementCount'

export type VeracityAggregation = {
  veracity: {
    id: string
    key: string
    name: string
  }
  isSelected: boolean
  count: number
}

export const VeracityFilterFragment = gql`
  fragment VeracityFilter on VeracityAggregate {
    veracity {
      id
      key
      name
    }
    isSelected
    count
  }
`

type Props = VeracityAggregation

export function VeracityFilter({ veracity, count, isSelected }: Props) {
  return (
    <div
      key={veracity.id}
      className={classNames('check-btn', 'py-2', {
        disabled: count === 0,
      })}
    >
      <input
        type="checkbox"
        name="veracities"
        disabled={count === 0}
        value={veracity.key}
        defaultChecked={isSelected}
      />
      <span className="checkmark"></span>
      <span className="small fw-600 me-2">{veracity.name}</span>
      <span className="smallest min-w-40px">
        <StatementCount count={count} />
      </span>
    </div>
  )
}
