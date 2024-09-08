import classNames from 'classnames'
import gql from 'graphql-tag'
import { StatementCount } from './StatementCount'
import { FormCheckbox } from './controls/FormCheckbox'

export type ReleasedYearAggregation = {
  year: number
  count: number
  isSelected: boolean
}

export const ReleasedYearFilterFragment = gql`
  fragment ReleasedYearFilter on YearAggregate {
    year
    count
    isSelected
  }
`

type Props = ReleasedYearAggregation

export function ReleasedYearFilter({ year, count, isSelected }: Props) {
  return (
    <FormCheckbox
      value={year.toString()}
      name={year.toString()}
      label={<StatementCount count={count} />}
      isDisabled={count === 0}
      isSelected={isSelected}
    />
  )
}
