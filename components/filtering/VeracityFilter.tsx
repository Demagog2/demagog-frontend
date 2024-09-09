import { FragmentType, gql, useFragment } from '@/__generated__'
import { StatementCount } from './StatementCount'
import { FormCheckbox } from './controls/FormCheckbox'

export const VeracityFilterFragment = gql(`
  fragment VeracityFilter on VeracityAggregate {
    veracity {
      id
      key
      name
    }
    isSelected
    count
  }
`)

type Props = {
  veracity: FragmentType<typeof VeracityFilterFragment>
}

export function VeracityFilter(props: Props) {
  const { veracity, count, isSelected } = useFragment(
    VeracityFilterFragment,
    props.veracity
  )

  return (
    <FormCheckbox
      inputName="veracities"
      value={veracity.key}
      name={veracity.name}
      isSelected={isSelected}
      isDisabled={count === 0}
      label={<StatementCount count={count} />}
    />
  )
}
