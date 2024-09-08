import gql from 'graphql-tag'
import { StatementCount } from './StatementCount'
import { FormCheckbox } from './controls/FormCheckbox'

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
    <FormCheckbox
      value={veracity.name}
      name={veracity.name}
      isSelected={isSelected}
      isDisabled={count === 0}
      label={<StatementCount count={count} />}
    />
  )
}
