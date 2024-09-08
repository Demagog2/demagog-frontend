import { FragmentType, gql, useFragment } from '@/__generated__'
import { StatementCount } from './StatementCount'
import { FormCheckbox } from './controls/FormCheckbox'

export const ReleasedYearFilterFragment = gql(`
  fragment ReleasedYearFilter on YearAggregate {
    year
    count
    isSelected
  }
`)

type Props = {
  year: FragmentType<typeof ReleasedYearFilterFragment>
}

export function ReleasedYearFilter(props: Props) {
  const { year, isSelected, count } = useFragment(
    ReleasedYearFilterFragment,
    props.year
  )

  return (
    <FormCheckbox
      inputName="years"
      value={year.toString()}
      name={year.toString()}
      label={<StatementCount count={count} />}
      isDisabled={count === 0}
      isSelected={isSelected}
    />
  )
}
