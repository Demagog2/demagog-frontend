import { FragmentType, gql, useFragment } from '@/__generated__'
import { FilterSection } from '@/components/filtering/FilterSection'
import { VeracityFilter } from '@/components/filtering/VeracityFilter'

const VeracityFiltersFragment = gql(`
  fragment VeracityFilters on SearchResultStatement {
    veracities {
      veracity {
        id
      }
      ...VeracityFilter
    }
  }
`)

export function VeracityFilters(props: {
  data: FragmentType<typeof VeracityFiltersFragment>
}) {
  const data = useFragment(VeracityFiltersFragment, props.data)

  return (
    <FilterSection name="Hodnocení">
      {data.veracities?.map((veracityAggregate) => (
        <VeracityFilter
          key={veracityAggregate.veracity.id}
          veracity={veracityAggregate}
        />
      ))}
    </FilterSection>
  )
}
