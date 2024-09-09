import { ResetFilters } from '@/components/filtering/ResetFilters'
import { FormEventHandler, PropsWithChildren, ReactNode, useState } from 'react'
import classNames from 'classnames'

type FilterFormProps = PropsWithChildren<{
  hasAnyFilters: boolean

  onChange: FormEventHandler
  onReset: () => void

  renderFilters: ReactNode
  renderSearch?(): ReactNode
  renderFooter?(): ReactNode
}>

export function FilterFormRenderer(props: FilterFormProps) {
  const [areFiltersOpen, setFiltersOpen] = useState(props.hasAnyFilters)

  const SearchRenderer = props.renderSearch
  const FooterRenderer = props.renderFooter

  return (
    <form onChange={props.onChange} onReset={props.onReset}>
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

        {SearchRenderer && (
          <div className="col col-12 col-lg-8">
            <SearchRenderer />
          </div>
        )}

        {areFiltersOpen && (
          <div className="col col-12 col-lg-4">
            <div className="bg-light rounded-l p-5">
              {props.renderFilters}

              <ResetFilters />
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

      {FooterRenderer && (
        <div className="d-flex justify-content-center my-5 my-lg-10">
          <FooterRenderer />
        </div>
      )}
    </form>
  )
}
