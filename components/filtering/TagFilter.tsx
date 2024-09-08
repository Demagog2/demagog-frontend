import gql from 'graphql-tag'
import { StatementCount } from './StatementCount'
import { FormCheckbox } from './controls/FormCheckbox'

export type TagAggregation = {
  tag: { id: string; name: string }
  isSelected: boolean
  count: number
}

export const TagFilterFragment = gql`
  fragment TagFilter on TagAggregate {
    tag {
      id
      name
    }
    isSelected
    count
  }
`

type Props = TagAggregation

export function TagFilter({ tag, count, isSelected = false }: Props) {
  return (
    <FormCheckbox
      value={tag.id}
      name={tag.name}
      isSelected={isSelected}
      label={<StatementCount count={count} />}
    />
  )
}
