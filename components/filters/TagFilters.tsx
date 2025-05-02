import { FragmentType, gql, useFragment } from '@/__generated__'
import { FilterSection } from '@/components/filtering/FilterSection'
import { TagFilter } from '@/components/filtering/TagFilter'
import { StatementCount } from '@/components/filtering/StatementCount'

const TagFiltersFragment = gql(`
  fragment TagFilters on SearchResultStatement {
    tags {
      tag {
        id
      }
      ...TagFilter
    }
  }
`)

export function TagFilters(props: {
  data: FragmentType<typeof TagFiltersFragment>
}) {
  const data = useFragment(TagFiltersFragment, props.data)

  return (
    <FilterSection name="Témata" defaultOpen>
      {data.tags?.map((tagAggregate) => (
        <TagFilter
          key={tagAggregate.tag.id}
          tag={tagAggregate}
          renderLabel={StatementCount}
        />
      ))}
    </FilterSection>
  )
}
