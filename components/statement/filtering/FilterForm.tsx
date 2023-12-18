import { SearchButton } from '@/components/search/SearchButton'
import { ResetFilters } from '@/components/statement/filtering/ResetFilters'
import { Pagination } from '@/components/pagination'
import { PropsWithChildren, ReactNode, useState } from 'react'
import classNames from 'classnames'

type FilterFormProps = PropsWithChildren<{
  hasAnyFilters: boolean
  term: string
  pageSize: number
  page: number
  totalCount: number
  searchPlaceholder: string

  renderFilters(): ReactNode
}>

export function FilterForm(props: FilterFormProps) {
  const [areFiltersOpen, setFiltersOpen] = useState(props.hasAnyFilters)

  return (
    <form>
      <div className="row g-10 mt-10">
        <div className="col col-12 col-lg-4">
          <a
            className="btn w-100 h-44px"
            onClick={() => setFiltersOpen(!areFiltersOpen)}
          >
            <span className="text-white">
              {areFiltersOpen ? 'Skrýt filtry' : 'Zobrazit filtry'}
            </span>
          </a>
        </div>
        <div className="col col-12 col-lg-8">
          <div className="d-flex justify-content-end">
            <div className="w-100 mw-350px">
              <div className="w-100 position-relative">
                <input
                  name="q"
                  type="text"
                  defaultValue={props.term}
                  className="input outline focus-primary search"
                  placeholder={props.searchPlaceholder}
                />
                <SearchButton />
              </div>
            </div>
          </div>
        </div>

        {areFiltersOpen && (
          <div className="col col-12 col-lg-4">
            <div className="bg-light rounded-l p-5">
              {props.renderFilters()}

              <ResetFilters onClick={() => setFiltersOpen(false)} />
            </div>
          </div>
        )}

        <div
          className={classNames('col col-12 ', {
            'col-lg-8': areFiltersOpen,
          })}
        >
          {props.children}
        </div>
      </div>

      <div className="d-flex justify-content-center my-5 my-lg-10">
        <Pagination
          pageSize={props.pageSize}
          currentPage={props.page}
          totalCount={props.totalCount}
        />
      </div>
    </form>
  )
}
