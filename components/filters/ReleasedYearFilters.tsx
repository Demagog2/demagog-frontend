import { FragmentType, gql, useFragment } from '@/__generated__'
import { FilterSection } from '@/components/filtering/FilterSection'
import { ReleasedYearFilter } from '@/components/filtering/ReleasedYearFilter'

const ReleasedYearFiltersFragment = gql(`
  fragment ReleasedYearFilters on SearchResultStatement {
    years {
      year
      ...ReleasedYearFilter
    }
  }
`)

export function ReleasedYearFilters(props: {
  data: FragmentType<typeof ReleasedYearFiltersFragment>
}) {
  const data = useFragment(ReleasedYearFiltersFragment, props.data)

  return (
    <FilterSection name="Rok vydání">
      {data.years?.map((releasedYearAggregate) => (
        <ReleasedYearFilter
          key={releasedYearAggregate.year}
          year={releasedYearAggregate}
        />
      ))}
    </FilterSection>
  )
}
