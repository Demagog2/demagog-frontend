import { FragmentType, gql, useFragment } from '@/__generated__'
import { FormCheckbox } from './controls/FormCheckbox'
import { PromiseCount } from './PromiseCount'

const PromiseRatingFilterFragment = gql(`
  fragment PromiseRatingFilter on PromiseRatingAggregate {
    promiseRating {
      id
      key
      name
    }
    isSelected
    count
  }
    
`)

type Props = {
  promiseRating: FragmentType<typeof PromiseRatingFilterFragment>
}

export function PromiseRatingFilter(props: Props) {
  const { promiseRating, count, isSelected } = useFragment(
    PromiseRatingFilterFragment,
    props.promiseRating
  )

  return (
    <FormCheckbox
      inputName="promise_ratings"
      value={promiseRating.key}
      name={promiseRating.name}
      isSelected={isSelected}
      isDisabled={count === 0}
      label={<PromiseCount count={count} />}
    />
  )
}
