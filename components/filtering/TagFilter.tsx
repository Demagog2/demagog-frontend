import { pluralize } from '@/libs/pluralize'
import gql from 'graphql-tag'

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
    <div className="check-btn py-2" key={tag.id}>
      <input
        name="tags"
        type="checkbox"
        value={tag.id}
        defaultChecked={isSelected}
      />
      <span className="checkmark" />
      <span className="small fw-600 me-2">{tag.name}</span>
      <span className="smallest min-w-40px">
        {count} {pluralize(count, 'výrok', 'výroky', 'výroků')}
      </span>
    </div>
  )
}
