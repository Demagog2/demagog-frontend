import { pluralize } from '@/libs/pluralize'
import gql from 'graphql-tag'

export type TagAggregation = {
  tag: { id: string; name: string }
  count: number
}

export const TagFilterFragment = gql`
  fragment TagFilter on TagAggregate {
    tag {
      id
      name
    }
    count
  }
`

export function TagFilter({ tag, count }: TagAggregation) {
  return (
    <div className="check-btn py-2" key={tag.id}>
      <input type="checkbox" defaultValue={tag.id} />
      <span className="checkmark" />
      <span className="small fw-600 me-2">{tag.name}</span>
      <span className="smallest min-w-40px">
        {count} {pluralize(count, 'výrok', 'výroky', 'výroků')}
      </span>
    </div>
  )
}
